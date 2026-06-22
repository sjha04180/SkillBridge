const { PDFParse } = require('pdf-parse');
const mockPdfBuffer = Buffer.from('%PDF-1.4\n1 0 obj\n<<>>\nendobj\ntrailer\n<<\n/Root 1 0 R\n>>\n%%EOF');

async function test() {
  try {
    const uint8 = new Uint8Array(mockPdfBuffer);
    const parser = new PDFParse({ data: uint8, verbosity: 0 });
    console.log('Instance created with data option!');
    await parser.load();
    console.log('Parser loaded!');
    const result = await parser.getText();
    console.log('Parser text:', result.text);
  } catch (e) {
    console.log('Error:', e.message);
  }
}

test();
