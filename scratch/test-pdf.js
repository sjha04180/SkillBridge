const pdfParse = require('pdf-parse');
console.log('CommonJS require works:', typeof pdfParse === 'function');

try {
  const p = require('pdf-parse/lib/pdf-parse.js');
  console.log('CommonJS direct file path works:', typeof p === 'function');
} catch (e) {
  console.log('CommonJS direct path error:', e.message);
}
