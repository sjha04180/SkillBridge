import('pdf-parse').then((mod) => {
  console.log('ESM Keys:', Object.keys(mod));
  console.log('typeof mod.PDFParse:', typeof mod.PDFParse);
  console.log('typeof default:', typeof mod.default);
}).catch((err) => {
  console.error(err);
});
