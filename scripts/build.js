const fs = require('fs-extra');
const path = require('path');
const glob = require('glob');
const CleanCSS = require('clean-css');
const UglifyJS = require('uglify-js');
const { minify: htmlMinify } = require('html-minifier');
const { compressFile } = require('./compress');

// Конфігурація для мінімізації
const MINIFY_CONFIG = {
  html: {
    collapseWhitespace: true,
    removeComments: true,
    removeRedundantAttributes: true,
    removeScriptTypeAttributes: true,
    removeStyleLinkTypeAttributes: true,
    useShortDoctype: true,
    minifyCSS: true,
    minifyJS: true
  },
  css: {
    level: 2,
    returnPromise: false
  },
  js: {
    compress: {
      drop_console: false,
      drop_debugger: true
    },
    mangle: true
  }
};

async function minifyHTML(content, filePath) {
  try {
    const minified = htmlMinify(content, MINIFY_CONFIG.html);
    return minified;
  } catch (error) {
    console.error(`❌ Помилка мінімізації HTML ${filePath}:`, error.message);
    return content;
  }
}

function minifyCSS(content, filePath) {
  try {
    const cleanCSS = new CleanCSS(MINIFY_CONFIG.css);
    const result = cleanCSS.minify(content);
    
    if (result.errors.length > 0) {
      console.error(`❌ Помилки CSS ${filePath}:`, result.errors);
      return content;
    }
    
    return result.styles;
  } catch (error) {
    console.error(`❌ Помилка мінімізації CSS ${filePath}:`, error.message);
    return content;
  }
}

function minifyJS(content, filePath) {
  try {
    const result = UglifyJS.minify(content, MINIFY_CONFIG.js);
    
    if (result.error) {
      console.error(`❌ Помилка JS ${filePath}:`, result.error);
      return content;
    }
    
    return result.code;
  } catch (error) {
    console.error(`❌ Помилка мінімізації JS ${filePath}:`, error.message);
    return content;
  }
}

async function processFile(filePath) {
  try {
    const content = await fs.readFile(filePath, 'utf8');
    const ext = path.extname(filePath).toLowerCase();
    
    let minifiedContent = content;
    let compressionRatio = 0;
    
    switch (ext) {
      case '.html':
        minifiedContent = await minifyHTML(content, filePath);
        break;
      case '.css':
        minifiedContent = minifyCSS(content, filePath);
        break;
      case '.js':
        minifiedContent = minifyJS(content, filePath);
        break;
      default:
        console.log(`ℹ️  Пропускаємо мінімізацію для ${filePath} (непідтримуваний тип)`);
        return;
    }
    
    // Записуємо мінімізований файл
    await fs.writeFile(filePath, minifiedContent);
    
    // Обчислюємо коефіцієнт стиснення
    compressionRatio = ((content.length - minifiedContent.length) / content.length * 100);
    
    console.log(`✅ ${path.relative('.', filePath)}:`);
    console.log(`   До: ${(content.length / 1024).toFixed(2)} KB`);
    console.log(`   Після: ${(minifiedContent.length / 1024).toFixed(2)} KB`);
    console.log(`   Економія: ${compressionRatio.toFixed(1)}%\n`);
    
  } catch (error) {
    console.error(`❌ Помилка обробки ${filePath}:`, error.message);
  }
}

async function main() {
  console.log('🔧 Розпочинаємо мінімізацію файлів...\n');
  
  // Знаходимо файли для мінімізації
  const htmlFiles = glob.sync('*.html', { ignore: ['node_modules/**', 'compressed/**'] });
  const cssFiles = glob.sync('src/css/*.css', { ignore: ['node_modules/**', 'compressed/**'] });
  const jsFiles = glob.sync('src/js/*.js', { ignore: ['node_modules/**', 'compressed/**'] });
  
  const allFiles = [...htmlFiles, ...cssFiles, ...jsFiles];
  
  console.log(`Знайдено ${allFiles.length} файлів для мінімізації\n`);
  
  // Обробляємо файли
  for (const file of allFiles) {
    await processFile(file);
  }
  
  console.log('✨ Мінімізація завершена!\n');
  
  // Автоматично запускаємо стиснення після мінімізації
  console.log('🚀 Розпочинаємо стиснення мінімізованих файлів...\n');
  
  // Стискаємо всі текстові файли
  const compressionFiles = glob.sync('*.{html,css,js,json,xml,svg,txt}', { 
    ignore: ['node_modules/**', 'compressed/**', 'scripts/**'] 
  });
  
  const srcFiles = glob.sync('src/**/*.{css,js,json,xml,svg,txt}', { 
    ignore: ['node_modules/**', 'compressed/**'] 
  });
  
  const allCompressionFiles = [...compressionFiles, ...srcFiles];
  
  for (const file of allCompressionFiles) {
    await compressFile(file);
  }
  
  console.log('\n🎉 Build процес завершено успішно!');
}

if (require.main === module) {
  main().catch(console.error);
}

module.exports = { minifyHTML, minifyCSS, minifyJS, processFile }; 