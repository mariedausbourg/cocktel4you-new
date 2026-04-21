const fs = require('fs');
const path = require('path');
const { createClient } = require('@supabase/supabase-js');

const TITLE_BY_IMAGE_PATH = {
  'accessories/2237-auriculares-vention-echo-lite-e11-plus-inalambricos-bluetooth-autonomia-30h-negros-comprar.webp': 'Écouteurs Bluetooth Vention Echo Lite E11 Plus',
  'accessories/belkin-boostChange-PowerBank-10k.webp': 'Batterie externe Belkin BoostCharge 10K',
  'accessories/c9e1c3df-ed46-405c-bfbe-04d77a9c2ca3_i-usams-zb352-czarny.webp': 'Mini ventilateur pliable USAMS ZB352',
  'accessories/cable-de-charge-rapide-usb-type-c-vers-usb-type-c-pd-60w-devia-100cm.webp': 'Câble USB-C vers USB-C Devia PD 60W 1 m',
  'accessories/cables-lightning-fairplay-usb-cable.webp': 'Câble Lightning Fairplay USB',
  'accessories/CLEAR-tempered-glass.webp': 'Verre trempé Clear',
  'accessories/connect-batterie-externe-magsafe-power-bank-10-000-mah.webp': 'Batterie externe MagSafe Connect 10 000 mAh',
  'accessories/ecouteurs-filaire-usb-type-c-blanc-fairplay.webp': 'Écouteurs filaires USB-C Fairplay',
  'accessories/fairplay-cable-senecio-usb-a-vers-micro-usb.webp': 'Câble USB-A vers Micro-USB Fairplay',
  'accessories/fairplay-chargeur-12w-usb-a.webp': 'Chargeur secteur Fairplay 12W USB-A',
  'accessories/fairplay-chargeur-usb-c-20w.webp': 'Chargeur secteur Fairplay 20W USB-C',
  'accessories/fairplay-ecouteurs-jack-35mm.webp': 'Écouteurs jack 3,5 mm Fairplay',
  'accessories/FAIRPLAY-MAGNETCAR.webp': 'Support voiture magnétique Fairplay',
  'accessories/FAIRPLAY-PACK-CHARGEUR-VOITURE-60W-CABLE-LIGHTNING-boite.webp': 'Pack chargeur voiture Fairplay 60W + câble Lightning',
  'accessories/lightning-earphones-Fairplay.webp': 'Écouteurs Lightning Fairplay',
  'accessories/mcdodo-single-light-wireless-selfie-stick.webp': 'Perche selfie sans fil MCDODO avec éclairage',
  'accessories/Pmma-watch.webp': 'Protection écran Apple Watch PMMA',
  'accessories/pny-carte-memoire-microsd-32go-performance-plus-c1.webp': 'Carte mémoire microSD PNY 32 Go Performance Plus',
  'accessories/popsockets.webp': 'PopSockets',
  'accessories/rurihai-3d-tvrzene-sklo-pro-apple-watch-44mm.webp': 'Verre trempé 3D Apple Watch 44 mm',
  'accessories/USAMS-US-YD011-IPX8-jpg.webp': 'Pochette étanche smartphone USAMS IPX8',
  'accessories/USB-C-TO-USB-C-CABLE.webp': 'Câble USB-C vers USB-C',
  'accessories/usbc-carset.webp': 'Chargeur voiture USB-C Fairplay',
};

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

async function main() {
  loadEnvFile(path.resolve('.env.local'));

  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

  if (!supabaseUrl || !serviceRoleKey) {
    throw new Error('Variables Supabase manquantes dans .env.local');
  }

  const supabase = createClient(supabaseUrl, serviceRoleKey, {
    auth: { persistSession: false, autoRefreshToken: false },
  });

  const { data: products, error: selectError } = await supabase
    .from('products')
    .select('id,name,image_path')
    .eq('category', 'Accessoires')
    .in('image_path', Object.keys(TITLE_BY_IMAGE_PATH))
    .order('name', { ascending: true });

  if (selectError) {
    throw selectError;
  }

  const summary = {
    updated: 0,
    skipped: 0,
    missing: [],
  };

  const foundPaths = new Set();

  for (const product of products ?? []) {
    foundPaths.add(product.image_path);
    const nextTitle = TITLE_BY_IMAGE_PATH[product.image_path];

    if (!nextTitle || product.name === nextTitle) {
      summary.skipped += 1;
      continue;
    }

    const { error: updateError } = await supabase
      .from('products')
      .update({
        name: nextTitle,
        image_alt: nextTitle,
      })
      .eq('id', product.id);

    if (updateError) {
      throw updateError;
    }

    summary.updated += 1;
    console.log(`${product.name} -> ${nextTitle}`);
  }

  for (const imagePath of Object.keys(TITLE_BY_IMAGE_PATH)) {
    if (!foundPaths.has(imagePath)) {
      summary.missing.push(imagePath);
    }
  }

  console.log('');
  console.log(`Mis a jour: ${summary.updated}`);
  console.log(`Deja corrects: ${summary.skipped}`);
  console.log(`Introuvables: ${summary.missing.length}`);

  if (summary.missing.length > 0) {
    for (const imagePath of summary.missing) {
      console.log(`- ${imagePath}`);
    }
  }
}

main().catch((error) => {
  console.error(error);
  process.exit(1);
});
