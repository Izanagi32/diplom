const fs = require('fs-extra');
const path = require('path');
const glob = require('glob');

async function analyzeCompression() {
  console.log('📊 Аналіз ефективності стиснення\n');
  console.log('=' .repeat(80));
  
  const compressedDir = 'compressed';
  const originalFiles = glob.sync('**/*.{html,css,js,json,xml,svg,txt}', {
    ignore: ['node_modules/**', 'compressed/**', 'scripts/**', '.git/**']
  });
  
  let totalOriginalSize = 0;
  let totalGzipSize = 0;
  let totalBrotliSize = 0;
  let processedFiles = 0;
  
  const results = [];
  
  for (const originalFile of originalFiles) {
    const originalPath = originalFile;
    const gzipPath = path.join(compressedDir, originalFile + '.gz');
    const brotliPath = path.join(compressedDir, originalFile + '.br');
    
    try {
      if (await fs.pathExists(originalPath) && 
          await fs.pathExists(gzipPath) && 
          await fs.pathExists(brotliPath)) {
        
        const originalStat = await fs.stat(originalPath);
        const gzipStat = await fs.stat(gzipPath);
        const brotliStat = await fs.stat(brotliPath);
        
        const originalSize = originalStat.size;
        const gzipSize = gzipStat.size;
        const brotliSize = brotliStat.size;
        
        const gzipRatio = ((originalSize - gzipSize) / originalSize * 100);
        const brotliRatio = ((originalSize - brotliSize) / originalSize * 100);
        
        results.push({
          file: originalFile,
          originalSize,
          gzipSize,
          brotliSize,
          gzipRatio,
          brotliRatio
        });
        
        totalOriginalSize += originalSize;
        totalGzipSize += gzipSize;
        totalBrotliSize += brotliSize;
        processedFiles++;
      }
    } catch (error) {
      // Пропускаємо файли з помилками
    }
  }
  
  // Сортуємо за розміром оригінального файлу
  results.sort((a, b) => b.originalSize - a.originalSize);
  
  console.log(`Файл\t\t\t\tОригінал\tGzip\t\tBrotli\t\tGzip %\tBrotli %`);
  console.log('-'.repeat(80));
  
  for (const result of results) {
    const fileName = result.file.length > 25 ? 
      result.file.substring(0, 22) + '...' : 
      result.file.padEnd(25);
    
    console.log(
      `${fileName}\t${(result.originalSize / 1024).toFixed(1)}KB\t\t` +
      `${(result.gzipSize / 1024).toFixed(1)}KB\t\t` +
      `${(result.brotliSize / 1024).toFixed(1)}KB\t\t` +
      `${result.gzipRatio.toFixed(1)}%\t${result.brotliRatio.toFixed(1)}%`
    );
  }
  
  console.log('=' .repeat(80));
  console.log('\n📈 Загальна статистика:');
  console.log(`Файлів оброблено: ${processedFiles}`);
  console.log(`Загальний розмір оригіналів: ${(totalOriginalSize / 1024).toFixed(2)} KB`);
  console.log(`Загальний розмір Gzip: ${(totalGzipSize / 1024).toFixed(2)} KB`);
  console.log(`Загальний розмір Brotli: ${(totalBrotliSize / 1024).toFixed(2)} KB`);
  
  const totalGzipRatio = ((totalOriginalSize - totalGzipSize) / totalOriginalSize * 100);
  const totalBrotliRatio = ((totalOriginalSize - totalBrotliSize) / totalOriginalSize * 100);
  
  console.log(`\n💾 Економія простору:`);
  console.log(`Gzip: ${totalGzipRatio.toFixed(1)}% (${((totalOriginalSize - totalGzipSize) / 1024).toFixed(2)} KB)`);
  console.log(`Brotli: ${totalBrotliRatio.toFixed(1)}% (${((totalOriginalSize - totalBrotliSize) / 1024).toFixed(2)} KB)`);
  
  console.log(`\n🔄 Підтримка браузерів:`);
  console.log(`Gzip: Всі сучасні браузери (100%)`);
  console.log(`Brotli: Chrome 50+, Firefox 44+, Safari 14+ (~95%)`);
  
  console.log(`\n🚀 Рекомендації для веб-сервера:`);
  console.log(`1. Налаштуйте автоматичне стиснення на сервері`);
  console.log(`2. Використовуйте правильні MIME типи`);
  console.log(`3. Налаштуйте кешування для статичних ресурсів`);
  console.log(`4. Встановіть правильні HTTP заголовки`);
}

if (require.main === module) {
  analyzeCompression().catch(console.error);
}

module.exports = { analyzeCompression }; 