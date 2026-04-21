const fs = require('fs');
const fsp = require('fs/promises');
const path = require('path');
const { createClient } = require('@supabase/supabase-js');

function loadEnvFile(filePath) {
  if (!fs.existsSync(filePath)) return;
  const content = fs.readFileSync(filePath, 'utf8');
  for (const rawLine of content.split(/\r?\n/)) {
    const line = rawLine.trim();
    if (!line || line.startsWith('#')) continue;
    const eqIndex = line.indexOf('=');
    if (eqIndex === -1) continue;
    const key = line.slice(0, eqIndex).trim();
    let value = line.slice(eqIndex + 1).trim();
    if ((value.startsWith('"') && value.endsWith('"')) || (value.startsWith("'") && value.endsWith("'"))) {
      value = value.slice(1, -1);
    }
    if (!process.env[key]) {
      process.env[key] = value;
    }
  }
}

function parseArgs(argv) {
  const options = {
    sourceDir: null,
    bucket: 'imageTelephones',
    dryRun: false,
    brand: null,
    pathPrefix: '',
  };

  for (const arg of argv) {
    if (!arg.startsWith('--') && !options.sourceDir) {
      options.sourceDir = arg;
      continue;
    }
    if (arg === '--dry-run') {
      options.dryRun = true;
      continue;
    }
    const [flag, rawValue] = arg.split('=', 2);
    if (flag === '--bucket' && rawValue) {
      options.bucket = rawValue;
      continue;
    }
    if (flag === '--brand' && rawValue) {
      options.brand = rawValue;
      continue;
    }
    if (flag === '--path-prefix' && rawValue) {
      options.pathPrefix = rawValue.replace(/^\/+|\/+$/g, '');
      continue;
    }
    throw new Error(`Option inconnue: ${flag}`);
  }

  if (!options.sourceDir) {
    throw new Error('Usage: node scripts/sync-repair-images.cjs "<dossier-smartphone>" [--bucket=imageTelephones] [--dry-run]');
  }

  return options;
}

function normalizeText(value) {
  return value
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, ' ')
    .trim()
    .replace(/\s+/g, ' ');
}

function stripCleanupStem(stem) {
  return stem
    .replace(/\s*\(\d+\)\s*$/g, '')
    .replace(/(?:_cleanup)+$/g, '')
    .replace(/_+$/g, '');
}

async function collectFiles(rootDir) {
  const files = [];
  const brandDirs = await fsp.readdir(rootDir, { withFileTypes: true });

  for (const brandDir of brandDirs) {
    if (!brandDir.isDirectory()) continue;
    const dirPath = path.join(rootDir, brandDir.name);
    const entries = await fsp.readdir(dirPath, { withFileTypes: true });
    for (const entry of entries) {
      if (!entry.isFile()) continue;
      const ext = path.extname(entry.name).toLowerCase();
      if (ext !== '.webp') continue;
      const originalStem = path.basename(entry.name, ext);
      const cleanStem = stripCleanupStem(originalStem);
      const relativeTargetPath = `${brandDir.name.toLowerCase()}/${cleanStem}.webp`;
      files.push({
        fullPath: path.join(dirPath, entry.name),
        brandFolder: brandDir.name.toLowerCase(),
        originalName: entry.name,
        cleanStem,
        key: `${brandDir.name.toLowerCase()}|${normalizeText(cleanStem)}`,
        targetPath: relativeTargetPath,
      });
    }
  }

  return files;
}

async function main() {
  loadEnvFile(path.resolve('.env.local'));
  const options = parseArgs(process.argv.slice(2));
  const sourceDir = path.resolve(options.sourceDir);

  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY;
  if (!supabaseUrl || !serviceRoleKey) {
    throw new Error('Variables Supabase manquantes dans .env.local');
  }

  const stats = await fsp.stat(sourceDir).catch(() => null);
  if (!stats?.isDirectory()) {
    throw new Error(`Dossier introuvable: ${sourceDir}`);
  }

  const sourceFiles = await collectFiles(sourceDir);
  if (sourceFiles.length === 0) {
    throw new Error(`Aucune image .webp trouvée dans ${sourceDir}`);
  }

  const brandFolderToDbBrand = {
    honor: 'Honor',
    motorola: 'Motorola',
    oneplus: 'OnePlus',
    oppo: 'OPPO',
    realme: 'Realme',
    samsung: 'Samsung',
    sony: 'Sony',
    tcl: 'TCL',
    vivo: 'Vivo',
    wiko: 'Wiko',
    xiaomi: 'Xiaomi',
  };

  const sourceMap = new Map();
  for (const file of sourceFiles) {
    if (options.brand && brandFolderToDbBrand[file.brandFolder] !== options.brand) {
      continue;
    }
    if (!sourceMap.has(file.key)) {
      sourceMap.set(file.key, file);
    }
  }

  const supabase = createClient(supabaseUrl, serviceRoleKey, {
    auth: { persistSession: false, autoRefreshToken: false },
  });

  const { data: repairs, error: repairsError } = await supabase
    .from('repairs')
    .select('id, brand, model, repair_type, image_url')
    .order('brand')
    .order('model')
    .order('repair_type');

  if (repairsError) {
    throw repairsError;
  }

  const matches = [];
  const unmatchedRepairs = [];

  for (const repair of repairs ?? []) {
    if (options.brand && repair.brand !== options.brand) {
      continue;
    }
    const brandFolder = Object.entries(brandFolderToDbBrand).find(([, brand]) => brand === repair.brand)?.[0];
    if (!brandFolder) {
      unmatchedRepairs.push(repair);
      continue;
    }

    const key = `${brandFolder}|${normalizeText(repair.model)}`;
    const file = sourceMap.get(key);

    if (!file) {
      unmatchedRepairs.push(repair);
      continue;
    }

    matches.push({
      repair,
      file,
      storagePath: options.pathPrefix ? `${options.pathPrefix}/${file.targetPath}` : file.targetPath,
      publicUrl: `${supabaseUrl}/storage/v1/object/public/${options.bucket}/${options.pathPrefix ? `${options.pathPrefix}/` : ''}${file.targetPath}`,
    });
  }

  const uniqueUploads = new Map();
  for (const match of matches) {
    uniqueUploads.set(match.storagePath, match.file);
  }

  console.log(`Images source: ${sourceFiles.length}`);
  console.log(`Réparations trouvées: ${(repairs ?? []).length}`);
  console.log(`Réparations matchées: ${matches.length}`);
  console.log(`Fichiers uniques à envoyer: ${uniqueUploads.size}`);
  console.log(`Réparations sans correspondance: ${unmatchedRepairs.length}`);

  if (options.dryRun) {
    const preview = matches.slice(0, 20).map((match) => ({
      brand: match.repair.brand,
      model: match.repair.model,
      repair_type: match.repair.repair_type,
      source: match.file.originalName,
      targetPath: match.file.targetPath,
    }));
    console.log(JSON.stringify({ preview, unmatchedSample: unmatchedRepairs.slice(0, 20) }, null, 2));
    return;
  }

  let uploaded = 0;
  for (const [storagePath, file] of uniqueUploads.entries()) {
    const buffer = await fsp.readFile(file.fullPath);
    const { error } = await supabase.storage.from(options.bucket).upload(storagePath, buffer, {
      contentType: 'image/webp',
      upsert: true,
    });
    if (error) {
      throw error;
    }
    uploaded += 1;
  }

  let updated = 0;
  for (const match of matches) {
    const { error } = await supabase
      .from('repairs')
      .update({ image_url: match.publicUrl })
      .eq('id', match.repair.id);

    if (error) {
      throw error;
    }
    updated += 1;
  }

  console.log(JSON.stringify({ uploaded, updated, unmatched: unmatchedRepairs.length }, null, 2));
}

main().catch((error) => {
  console.error(error instanceof Error ? error.message : String(error));
  process.exit(1);
});
