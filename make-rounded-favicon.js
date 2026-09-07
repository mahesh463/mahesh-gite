const fs = require('fs');
const path = require('path');
const zlib = require('zlib');

// CRC32 table
const crcTable = new Uint32Array(256);
for (let i = 0; i < 256; i++) {
  let c = i;
  for (let k = 0; k < 8; k++) {
    c = (c & 1) ? (0xEDB88320 ^ (c >>> 1)) : (c >>> 1);
  }
  crcTable[i] = c >>> 0;
}

function calcCrc(buf) {
  let c = 0xFFFFFFFF;
  for (let i = 0; i < buf.length; i++) {
    c = crcTable[(c ^ buf[i]) & 0xFF] ^ (c >>> 8);
  }
  return (c ^ 0xFFFFFFFF) >>> 0;
}

function makeChunk(type, data) {
  const len = data.length;
  const chunk = Buffer.alloc(12 + len);
  chunk.writeUInt32BE(len, 0);
  chunk.write(type, 4, 4, 'ascii');
  data.copy(chunk, 8);
  const typeAndData = chunk.subarray(4, 8 + len);
  const crc = calcCrc(typeAndData);
  chunk.writeUInt32BE(crc, 8 + len);
  return chunk;
}

function paethPredictor(a, b, c) {
  const p = a + b - c;
  const pa = Math.abs(p - a);
  const pb = Math.abs(p - b);
  const pc = Math.abs(p - c);
  if (pa <= pb && pa <= pc) return a;
  if (pb <= pc) return b;
  return c;
}

function roundPngFile(inputPath, outputPath) {
  const fileBuf = fs.readFileSync(inputPath);
  if (fileBuf.subarray(0, 8).toString('hex') !== '89504e470d0a1a0a') {
    throw new Error('Not a PNG file');
  }

  let pos = 8;
  let width, height, bitDepth, colorType;
  const idatParts = [];

  while (pos < fileBuf.length) {
    const len = fileBuf.readUInt32BE(pos);
    const type = fileBuf.toString('ascii', pos + 4, pos + 8);
    const data = fileBuf.subarray(pos + 8, pos + 8 + len);

    if (type === 'IHDR') {
      width = data.readUInt32BE(0);
      height = data.readUInt32BE(4);
      bitDepth = data[8];
      colorType = data[9];
    } else if (type === 'IDAT') {
      idatParts.push(data);
    }
    pos += 12 + len;
  }

  const allIdat = Buffer.concat(idatParts);
  const decompressed = zlib.inflateSync(allIdat);

  let bpp;
  if (colorType === 6) bpp = 4; // RGBA
  else if (colorType === 2) bpp = 3; // RGB
  else throw new Error(`Unsupported color type: ${colorType}`);

  const stride = width * bpp;
  const rawRgba = Buffer.alloc(width * height * 4);

  // Unfilter scanlines to raw RGBA
  let inPos = 0;
  let prevRawRow = Buffer.alloc(stride, 0);

  for (let y = 0; y < height; y++) {
    const filter = decompressed[inPos++];
    const currentRow = Buffer.alloc(stride);

    for (let x = 0; x < stride; x++) {
      const val = decompressed[inPos++];
      const byteIdx = x % bpp;
      const a = x >= bpp ? currentRow[x - bpp] : 0;
      const b = prevRawRow[x];
      const c = x >= bpp ? prevRawRow[x - bpp] : 0;

      let unfiltered = 0;
      if (filter === 0) unfiltered = val;
      else if (filter === 1) unfiltered = (val + a) & 0xFF;
      else if (filter === 2) unfiltered = (val + b) & 0xFF;
      else if (filter === 3) unfiltered = (val + Math.floor((a + b) / 2)) & 0xFF;
      else if (filter === 4) unfiltered = (val + paethPredictor(a, b, c)) & 0xFF;
      currentRow[x] = unfiltered;
    }

    // Convert currentRow to RGBA in rawRgba
    for (let px = 0; px < width; px++) {
      const outOffset = (y * width + px) * 4;
      if (bpp === 4) {
        rawRgba[outOffset] = currentRow[px * 4];
        rawRgba[outOffset + 1] = currentRow[px * 4 + 1];
        rawRgba[outOffset + 2] = currentRow[px * 4 + 2];
        rawRgba[outOffset + 3] = currentRow[px * 4 + 3];
      } else {
        rawRgba[outOffset] = currentRow[px * 3];
        rawRgba[outOffset + 1] = currentRow[px * 3 + 1];
        rawRgba[outOffset + 2] = currentRow[px * 3 + 2];
        rawRgba[outOffset + 3] = 255;
      }
    }
    prevRawRow = currentRow;
  }

  // Circular masking with smooth anti-aliased edge
  const cx = width / 2;
  const cy = height / 2;
  const radius = Math.min(cx, cy) - 1.5;

  for (let y = 0; y < height; y++) {
    for (let x = 0; x < width; x++) {
      const dx = x + 0.5 - cx;
      const dy = y + 0.5 - cy;
      const dist = Math.sqrt(dx * dx + dy * dy);
      const outOffset = (y * width + x) * 4;

      if (dist >= radius + 1) {
        // Outside circle completely: 100% transparent!
        rawRgba[outOffset + 3] = 0;
      } else if (dist > radius - 1) {
        // Smooth anti-aliased boundary
        const factor = (radius + 1 - dist) / 2;
        rawRgba[outOffset + 3] = Math.round(rawRgba[outOffset + 3] * Math.max(0, Math.min(1, factor)));
      }
    }
  }

  // Build new PNG with filter 0 (None)
  const outScanlines = Buffer.alloc(height * (1 + width * 4));
  let outPos = 0;
  for (let y = 0; y < height; y++) {
    outScanlines[outPos++] = 0; // Filter None
    const rowOffset = y * width * 4;
    rawRgba.copy(outScanlines, outPos, rowOffset, rowOffset + width * 4);
    outPos += width * 4;
  }

  const compressed = zlib.deflateSync(outScanlines, { level: 9 });

  // New IHDR for RGBA 8-bit
  const newIhdr = Buffer.alloc(13);
  newIhdr.writeUInt32BE(width, 0);
  newIhdr.writeUInt32BE(height, 4);
  newIhdr[8] = 8; // bit depth
  newIhdr[9] = 6; // RGBA
  newIhdr[10] = 0;
  newIhdr[11] = 0;
  newIhdr[12] = 0;

  const pngSignature = Buffer.from([0x89, 0x50, 0x4E, 0x47, 0x0D, 0x0A, 0x1A, 0x0A]);
  const ihdrChunk = makeChunk('IHDR', newIhdr);
  const idatChunk = makeChunk('IDAT', compressed);
  const iendChunk = makeChunk('IEND', Buffer.alloc(0));

  const resultPng = Buffer.concat([pngSignature, ihdrChunk, idatChunk, iendChunk]);
  fs.writeFileSync(outputPath, resultPng);
  console.log(`Saved rounded PNG to: ${outputPath} (${resultPng.length} bytes)`);
  return resultPng;
}

// Make a valid ICO file wrapping the PNG
function createIco(pngBuffer, icoPath) {
  const icoHeader = Buffer.alloc(6);
  icoHeader.writeUInt16LE(0, 0); // Reserved
  icoHeader.writeUInt16LE(1, 2); // Type 1 = ICO
  icoHeader.writeUInt16LE(1, 4); // Number of images = 1

  const entry = Buffer.alloc(16);
  entry[0] = 0; // width 0 means 256 or derived
  entry[1] = 0; // height 0 means 256 or derived
  entry[2] = 0; // colors in palette
  entry[3] = 0; // reserved
  entry.writeUInt16LE(1, 4); // color planes
  entry.writeUInt16LE(32, 6); // bits per pixel
  entry.writeUInt32LE(pngBuffer.length, 8); // image size
  entry.writeUInt32LE(22, 12); // offset: 6 header + 16 entry = 22

  const icoBuf = Buffer.concat([icoHeader, entry, pngBuffer]);
  fs.writeFileSync(icoPath, icoBuf);
  console.log(`Saved rounded ICO to: ${icoPath} (${icoBuf.length} bytes)`);
}

// Execute
const srcDir = path.join(__dirname, 'src', 'assets');
const pubDir = path.join(__dirname, 'public', 'assets');
const inputLogo = path.join(srcDir, 'Mahesh_gite_logo.png');

if (!fs.existsSync(inputLogo)) {
  console.error('Input logo not found:', inputLogo);
  process.exit(1);
}

if (!fs.existsSync(pubDir)) fs.mkdirSync(pubDir, { recursive: true });

// 1. Generate rounded PNG
const roundedPng = roundPngFile(inputLogo, path.join(srcDir, 'Mahesh_gite_logo_rounded.png'));
fs.writeFileSync(path.join(pubDir, 'Mahesh_gite_logo_rounded.png'), roundedPng);

// Also overwrite the main logo asset in public/assets and src/assets if needed or save as rounded
fs.writeFileSync(path.join(pubDir, 'Mahesh_gite_logo.png'), roundedPng);
fs.writeFileSync(path.join(srcDir, 'Mahesh_gite_logo.png'), roundedPng);

// 2. Generate rounded ICO files
createIco(roundedPng, path.join(__dirname, 'src', 'favicon.ico'));
createIco(roundedPng, path.join(__dirname, 'public', 'favicon.ico'));

console.log('All favicons and logos successfully transformed into perfect circles with transparent corners!');
