const fs = require('fs');
const fsp = require('fs/promises');
const path = require('path');
const { createClient } = require('@supabase/supabase-js');

const IMAGE_EXTENSIONS = new Set(['.jpg', '.jpeg', '.png', '.webp', '.gif', '.avif']);

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
    category: 'Accessoires',
    price: 0,
    stock: 0,
    active: true,
    dryRun: false,
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
    switch (flag) {
      case '--category':
        options.category = rawValue || options.category;
        break;
      case '--price':
        options.price = Number(rawValue ?? options.price);
        break;
      case '--stock':
        options.stock = Number(rawValue ?? options.stock);
        break;
      case '--active':
        options.active = rawValue === 'true';
        break;
      default:
        throw new Error(`Option inconnue: ${flag}`);
    }
  }

  if (!options.sourceDir) {
    throw new Error('Usage: node scripts/import-accessories.cjs "<dossier>" [--price=0] [--stock=0] [--active=true] [--dry-run]');
  }

  if (Number.isNaN(options.price) || Number.isNaN(options.stock)) {
    throw new Error('Les options --price et --stock doivent être numériques.');
  }

  return options;
}

async function collectImages(rootDir, currentDir = rootDir) {
  const entries = await fsp.readdir(currentDir, { withFileTypes: true });
  const files = [];

  for (const entry of entries) {
    const fullPath = path.join(currentDir, entry.name);
    if (entry.isDirectory()) {
      files.push(...await collectImages(rootDir, fullPath));
      continue;
    }

    const ext = path.extname(entry.name).toLowerCase();
    if (!IMAGE_EXTENSIONS.has(ext)) continue;

    const relativePath = path.relative(rootDir, fullPath);
    files.push({
      fullPath,
      relativePath,
      extension: ext,
      baseName: path.basename(entry.name, ext),
    });
  }

  return files.sort((a, b) => a.relativePath.localeCompare(b.relativePath, 'fr'));
}

function mimeTypeFromExtension(extension) {
  switch (extension) {
    case '.jpg':
    case '.jpeg':
      return 'image/jpeg';
    case '.png':
      return 'image/png';
    case '.webp':
      return 'image/webp';
    case '.gif':
      return 'image/gif';
    case '.avif':
      return 'image/avif';
    default:
      return 'application/octet-stream';
  }
}

function safeStorageSegment(value) {
  return value
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .replace(/[^a-zA-Z0-9._ -]/g, '-')
    .replace(/\s+/g, '-')
    .replace(/-+/g, '-')
    .replace(/^-|-$/g, '');
}

function storagePathFromRelative(relativePath) {
  const normalized = relativePath
    .split(path.sep)
    .map((segment) => safeStorageSegment(segment))
    .join('/');
  return `accessories/${normalized}`;
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

  const files = await collectImages(sourceDir);
  if (files.length === 0) {
    throw new Error(`Aucune image trouvée dans ${sourceDir}`);
  }

  const supabase = createClient(supabaseUrl, serviceRoleKey, {
    auth: { persistSession: false, autoRefreshToken: false },
  });

  const summary = {
    scanned: files.length,
    created: 0,
    updated: 0,
    uploaded: 0,
    skipped: 0,
    failures: [],
  };

  console.log(`Import de ${files.length} image(s) depuis ${sourceDir}`);
  console.log(`Paramètres: catégorie=${options.category}, prix=${options.price}, stock=${options.stock}, actif=${options.active}`);
  if (options.dryRun) {
    console.log('Mode dry-run activé: aucune écriture ne sera faite.');
  }

  for (const file of files) {
    const productName = file.baseName;
    const imageAlt = productName;
    const imagePath = storagePathFromRelative(file.relativePath);

    try {
      console.log(`- ${file.relativePath}`);

      if (!options.dryRun) {
        const fileBuffer = await fsp.readFile(file.fullPath);
        const uploadResult = await supabase.storage
          .from('product-images')
          .upload(imagePath, fileBuffer, {
            contentType: mimeTypeFromExtension(file.extension),
            upsert: true,
          });

        if (uploadResult.error) {
          throw uploadResult.error;
        }

        summary.uploaded += 1;
      }

      const { data: publicUrlData } = supabase.storage.from('product-images').getPublicUrl(imagePath);
      const imageUrl = publicUrlData.publicUrl;

      const { data: existingProduct, error: selectError } = await supabase
        .from('products')
        .select('id')
        .eq('name', productName)
        .eq('category', options.category)
        .maybeSingle();

      if (selectError) {
        throw selectError;
      }

      const payload = {
        name: productName,
        brand: null,
        category: options.category,
        description: null,
        price: options.price,
        original_price: null,
        stock: options.stock,
        badge: null,
        image_path: imagePath,
        image_url: imageUrl,
        image_alt: imageAlt,
        is_active: options.active,
      };

      if (options.dryRun) {
        console.log(`  dry-run -> ${existingProduct ? 'update' : 'create'} ${productName}`);
        continue;
      }

      if (existingProduct) {
        const { error: updateError } = await supabase
          .from('products')
          .update(payload)
          .eq('id', existingProduct.id);

        if (updateError) {
          throw updateError;
        }

        summary.updated += 1;
      } else {
        const { error: insertError } = await supabase
          .from('products')
          .insert(payload);

        if (insertError) {
          throw insertError;
        }

        summary.created += 1;
      }
    } catch (error) {
      summary.failures.push({
        file: file.relativePath,
        message: error instanceof Error ? error.message : String(error),
      });
      console.error(`  échec -> ${summary.failures[summary.failures.length - 1].message}`);
    }
  }

  console.log('\nRésumé');
  console.log(JSON.stringify(summary, null, 2));

  if (summary.failures.length > 0) {
    process.exitCode = 1;
  }
}

main().catch((error) => {
  console.error(error instanceof Error ? error.message : String(error));
  process.exit(1);
});
