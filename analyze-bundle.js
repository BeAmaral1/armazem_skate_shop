/**
 * Script para analisar tamanho do bundle após build
 * Execute: node analyze-bundle.js
 */

import { readdir, stat } from 'fs/promises';
import { join } from 'path';

const formatBytes = (bytes) => {
  if (bytes === 0) return '0 Bytes';
  const k = 1024;
  const sizes = ['Bytes', 'KB', 'MB', 'GB'];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return Math.round((bytes / Math.pow(k, i)) * 100) / 100 + ' ' + sizes[i];
};

const analyzeDir = async (dirPath, prefix = '') => {
  const files = await readdir(dirPath);
  let totalSize = 0;
  const results = [];

  for (const file of files) {
    const filePath = join(dirPath, file);
    const stats = await stat(filePath);

    if (stats.isDirectory()) {
      const { size, items } = await analyzeDir(filePath, prefix + '  ');
      totalSize += size;
      results.push({
        name: `📁 ${file}/`,
        size,
        formatted: formatBytes(size)
      });
      results.push(...items.map(item => ({ ...item, name: '  ' + item.name })));
    } else {
      totalSize += stats.size;
      const ext = file.split('.').pop();
      const icon = ext === 'js' ? '📜' : ext === 'css' ? '🎨' : ext === 'html' ? '📄' : '📦';
      results.push({
        name: `${icon} ${file}`,
        size: stats.size,
        formatted: formatBytes(stats.size)
      });
    }
  }

  return { size: totalSize, items: results };
};

const analyze = async () => {
  console.log('\n🔍 Analisando Bundle...\n');
  console.log('='.repeat(60));
  
  try {
    const { size, items } = await analyzeDir('./dist');
    
    // Ordenar por tamanho
    items.sort((a, b) => b.size - a.size);
    
    // Mostrar os 20 maiores arquivos
    console.log('\n📊 Top 20 Maiores Arquivos:\n');
    items.slice(0, 20).forEach((item, index) => {
      console.log(`${(index + 1).toString().padStart(2, '0')}. ${item.name.padEnd(50, '.')} ${item.formatted.padStart(12)}`);
    });
    
    // Resumo por tipo
    const byType = {};
    items.forEach(item => {
      const ext = item.name.includes('.') ? item.name.split('.').pop().split(' ')[0] : 'folder';
      byType[ext] = (byType[ext] || 0) + item.size;
    });
    
    console.log('\n' + '='.repeat(60));
    console.log('\n📦 Resumo por Tipo:\n');
    Object.entries(byType)
      .sort(([, a], [, b]) => b - a)
      .forEach(([type, size]) => {
        console.log(`${type.toUpperCase().padEnd(10)} ${formatBytes(size).padStart(12)}`);
      });
    
    console.log('\n' + '='.repeat(60));
    console.log(`\n✅ TOTAL: ${formatBytes(size)}\n`);
    
    // Avisos
    if (size > 1024 * 1024 * 2) {
      console.log('⚠️  AVISO: Bundle maior que 2MB!');
    } else if (size > 1024 * 1024) {
      console.log('⚡ Bundle OK (< 2MB)');
    } else {
      console.log('🚀 Bundle EXCELENTE (< 1MB)!');
    }
    
    console.log('\n' + '='.repeat(60) + '\n');
    
  } catch (error) {
    console.error('❌ Erro ao analisar:', error.message);
    console.log('\n💡 Execute "npm run build" primeiro!\n');
  }
};

analyze();
