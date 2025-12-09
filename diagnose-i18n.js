// Diagnostic script to check i18n configuration
const fs = require('fs');
const path = require('path');

console.log('========================================');
console.log('i18n Diagnostic Tool');
console.log('========================================\n');

// Check if locale files exist
const locales = ['ko-KR', 'en-US', 'zh-CN'];
const files = ['menu.ts', 'pages.ts', 'globalHeader.ts'];

console.log('1. Checking locale files...\n');
locales.forEach(locale => {
  console.log(`  ${locale}:`);
  files.forEach(file => {
    const filePath = path.join('src', 'locales', locale, file);
    const exists = fs.existsSync(filePath);
    console.log(`    ${file}: ${exists ? '✓ EXISTS' : '✗ MISSING'}`);
    
    if (exists) {
      const content = fs.readFileSync(filePath, 'utf8');
      // Check if it has export default
      if (!content.includes('export default')) {
        console.log(`      ⚠ WARNING: Missing 'export default'`);
      }
      // Check if menu.ts has menu.products
      if (file === 'menu.ts' && !content.includes('menu.products')) {
        console.log(`      ⚠ WARNING: Missing 'menu.products' key`);
      }
    }
  });
  console.log('');
});

console.log('2. Checking locale index files...\n');
locales.forEach(locale => {
  const indexPath = path.join('src', 'locales', `${locale}.ts`);
  const exists = fs.existsSync(indexPath);
  console.log(`  ${locale}.ts: ${exists ? '✓ EXISTS' : '✗ MISSING'}`);
  
  if (exists) {
    const content = fs.readFileSync(indexPath, 'utf8');
    // Check if it imports menu
    if (!content.includes("import menu from")) {
      console.log(`    ⚠ WARNING: Missing menu import`);
    }
    // Check if it spreads menu
    if (!content.includes("...menu")) {
      console.log(`    ⚠ WARNING: Missing ...menu spread`);
    }
  }
});

console.log('\n3. Checking config/config.ts...\n');
const configPath = path.join('config', 'config.ts');
if (fs.existsSync(configPath)) {
  const content = fs.readFileSync(configPath, 'utf8');
  console.log('  ✓ config.ts exists');
  
  if (content.includes('locale:')) {
    console.log('  ✓ locale configuration found');
    if (content.includes("default: 'ko-KR'")) {
      console.log('  ✓ default language is ko-KR');
    } else {
      console.log('  ⚠ WARNING: default language is not ko-KR');
    }
  } else {
    console.log('  ✗ locale configuration missing');
  }
} else {
  console.log('  ✗ config.ts not found');
}

console.log('\n4. Checking for cache folders...\n');
const cacheFolders = ['.umi', 'node_modules/.cache', 'dist'];
cacheFolders.forEach(folder => {
  const exists = fs.existsSync(folder);
  console.log(`  ${folder}: ${exists ? '⚠ EXISTS (should be deleted)' : '✓ CLEAN'}`);
});

console.log('\n========================================');
console.log('Diagnostic Complete');
console.log('========================================\n');

console.log('RECOMMENDATIONS:');
console.log('1. If cache folders exist, run: fix-i18n.bat');
console.log('2. After clearing cache, run: npm start');
console.log('3. Open browser in Incognito mode');
console.log('4. Hard refresh with Ctrl+Shift+R\n');
