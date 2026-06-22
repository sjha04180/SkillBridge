const { PDFParse } = require('pdf-parse');
console.log('Class keys:', Object.getOwnPropertyNames(PDFParse));
console.log('Prototype keys:', Object.getOwnPropertyNames(PDFParse.prototype));

try {
  const instance = new PDFParse();
  console.log('Instance keys:', Object.keys(instance));
} catch (e) {
  console.log('Instantiation error:', e.message);
}
