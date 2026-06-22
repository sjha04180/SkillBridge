const { PDFParse } = require('pdf-parse');
const mockPdfBuffer = Buffer.from('%PDF-1.4\n1 0 obj\n<<>>\nendobj\ntrailer\n<<\n/Root 1 0 R\n>>\n%%EOF');

async function test() {
  try {
    const parser = new PDFParse(mockPdfBuffer, { verbosity: 0 });
    console.log('Instance created with buffer!');
    await parser.load();
    console.log('Parser loaded!');
    const text = await parser.getText();
    console.log('Parser text:', text);
  } catch (e) {
    console.log('Buffer error:', e.message);
  }

  try {
    const parser = new PDFParse({ verbosity: 0 });
    console.log('Instance created with options!');
    await parser.load(mockPdfBuffer);
    console.log('Parser loaded with load(buffer)!');
    const text = await parser.getText();
    console.log('Parser text:', text);
  } catch (e) {
    console.log('Options error:', e.message);
  }
}

test();
