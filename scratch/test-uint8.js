const { PDFParse } = require('pdf-parse');
const mockPdfBuffer = Buffer.from('%PDF-1.4\n1 0 obj\n<<>>\nendobj\ntrailer\n<<\n/Root 1 0 R\n>>\n%%EOF');

async function test() {
  try {
    const uint8 = new Uint8Array(mockPdfBuffer);
    const parser = new PDFParse(uint8, { verbosity: 0 });
    console.log('Instance created with Uint8Array!');
    await parser.load();
    console.log('Parser loaded!');
    const text = await parser.getText();
    console.log('Parser text:', text);
  } catch (e) {
    console.log('Uint8Array error:', e.message);
  }
}

test();
