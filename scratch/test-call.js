const { PDFParse } = require('pdf-parse');
console.log('typeof PDFParse:', typeof PDFParse);

// Mock PDF header buffer
const mockPdfBuffer = Buffer.from('%PDF-1.4\n1 0 obj\n<<>>\nendobj\ntrailer\n<<\n/Root 1 0 R\n>>\n%%EOF');
PDFParse(mockPdfBuffer).then((data) => {
  console.log('PDFParse run completed! Text:', data.text);
}).catch((err) => {
  console.log('PDFParse run error (expected if mock is invalid, but type check is key):', err.message);
});
