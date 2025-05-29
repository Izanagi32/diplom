const fs = require('fs-extra');
const path = require('path');
const zlib = require('zlib');
const { compress } = require('brotli');
const glob = require('glob');

// Конфігурація файлів для стиснення
const COMPRESSION_CONFIG = {
  // Типи файлів для стиснення
  fileTypes: ['*.html', '*.css', '*.js', '*.json', '*.xml', '*.svg', '*.txt'],
  // Мінімальний розмір файлу для стиснення (в байтах)
  minSize: 1024,
  // Вихідна папка
  outputDir: 'compressed'
};

async function compressWithGzip(content) {
  return new Promise((resolve, reject) => {
    zlib.gzip(content, { level: 9 }, (err, result) => {
      if (err) reject(err);
      else resolve(result);
    });
  });
}

function compressWithBrotli(content) {
  return compress(content, {
    mode: 1, // text mode
    quality: 11, // максимальне стиснення
    lgwin: 22
  });
}

async function compressFile(filePath) {
  try {
    const content = await fs.readFile(filePath);
    
    // Перевіряємо мінімальний розмір
    if (content.length < COMPRESSION_CONFIG.minSize) {
      console.log(`Пропускаємо ${filePath} - файл занадто малий (${content.length} байт)`);
      return;
    }
    
    const relativePath = path.relative('.', filePath);
    const outputBase = path.join(COMPRESSION_CONFIG.outputDir, relativePath);
    
    // Створюємо папки якщо не існують
    await fs.ensureDir(path.dirname(outputBase));
    
    // Gzip стиснення
    const gzipContent = await compressWithGzip(content);
    const gzipPath = outputBase + '.gz';
    await fs.writeFile(gzipPath, gzipContent);
    
    // Brotli стиснення
    const brotliContent = compressWithBrotli(content);
    const brotliPath = outputBase + '.br';
    await fs.writeFile(brotliPath, brotliContent);
    
    // Статистика стиснення
    const originalSize = content.length;
    const gzipSize = gzipContent.length;
    const brotliSize = brotliContent.length;
    
    console.log(`✅ ${relativePath}:`);
    console.log(`   Оригінал: ${(originalSize / 1024).toFixed(2)} KB`);
    console.log(`   Gzip: ${(gzipSize / 1024).toFixed(2)} KB (${((1 - gzipSize / originalSize) * 100).toFixed(1)}% стиснення)`);
    console.log(`   Brotli: ${(brotliSize / 1024).toFixed(2)} KB (${((1 - brotliSize / originalSize) * 100).toFixed(1)}% стиснення)`);
    console.log('');
    
  } catch (error) {
    console.error(`❌ Помилка при стисненні ${filePath}:`, error.message);
  }
}

async function main() {
  console.log('🚀 Розпочинаємо стиснення файлів...\n');
  
  // Очищаємо папку compressed
  await fs.remove(COMPRESSION_CONFIG.outputDir);
  await fs.ensureDir(COMPRESSION_CONFIG.outputDir);
  
  // Знаходимо всі файли для стиснення
  const patterns = COMPRESSION_CONFIG.fileTypes.map(pattern => pattern);
  let allFiles = [];
  
  for (const pattern of patterns) {
    const files = glob.sync(pattern, { 
      ignore: ['node_modules/**', 'compressed/**', '.git/**', 'scripts/**']
    });
    allFiles = allFiles.concat(files);
  }
  
  // Видаляємо дублікати
  allFiles = [...new Set(allFiles)];
  
  console.log(`Знайдено ${allFiles.length} файлів для стиснення\n`);
  
  // Стискаємо файли
  for (const file of allFiles) {
    await compressFile(file);
  }
  
  console.log('✨ Стиснення завершено!');
  console.log(`📁 Стиснені файли збережено в папці: ${COMPRESSION_CONFIG.outputDir}`);
}

if (require.main === module) {
  main().catch(console.error);
}

module.exports = { compressFile, compressWithGzip, compressWithBrotli }; 