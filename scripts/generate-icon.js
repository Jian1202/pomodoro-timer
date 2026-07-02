// 生成 256×256 番茄图标（ICO 格式），纯 Node.js，无需任何依赖
const fs = require('fs')
const path = require('path')

const SIZE = 256
const CENTER = SIZE / 2
const OUTER_R = 114 // 外圈（红色果体）
const INNER_R = 60  // 内圈（高光）

// 写入 32-bit little-endian 整数
function writeU32(buf, offset, val) {
  buf.writeUInt32LE(val, offset)
}

// 生成 BMP 像素数据（BGRA，自底向上）
function generatePixels() {
  const pixels = Buffer.alloc(SIZE * SIZE * 4)
  for (let y = 0; y < SIZE; y++) {
    for (let x = 0; x < SIZE; x++) {
      const dx = x - CENTER
      const dy = y - CENTER
      const dist = Math.sqrt(dx * dx + dy * dy)
      const invY = SIZE - 1 - y // BMP 自底向上
      const off = (invY * SIZE + x) * 4

      if (dist <= OUTER_R) {
        // 果体：从外缘到中心渐变
        const t = dist / OUTER_R
        const rr = Math.round(233 * (0.35 + 0.65 * (1 - t)))
        const gg = Math.round(69 * (0.25 + 0.75 * (1 - t)) + 10 * t)
        const bb = Math.round(96 * (0.2 + 0.8 * (1 - t)))

        pixels[off] = bb     // B
        pixels[off + 1] = gg // G
        pixels[off + 2] = rr // R
        pixels[off + 3] = 255 // A
      } else {
        // 透明
        pixels[off] = 0
        pixels[off + 1] = 0
        pixels[off + 2] = 0
        pixels[off + 3] = 0
      }
    }
  }
  return pixels
}

// ---- 构建 ICO ----
const pixelData = generatePixels()
const bmpSize = 40 + pixelData.length // BITMAPINFOHEADER + pixels
const icoHeaderSize = 6
const icoEntrySize = 16
const dataOffset = icoHeaderSize + icoEntrySize
const fileSize = dataOffset + bmpSize

const buf = Buffer.alloc(fileSize)

// ICO 头部
buf.writeUInt16LE(0, 0)   // reserved
buf.writeUInt16LE(1, 2)   // type = ICO
buf.writeUInt16LE(1, 4)   // 1 image

// ICO 目录条目
buf.writeUInt8(0, 6)      // width = 0 表示 256
buf.writeUInt8(0, 7)      // height = 0 表示 256
buf.writeUInt8(0, 8)      // palette (0 = no palette)
buf.writeUInt8(0, 9)      // reserved
buf.writeUInt16LE(1, 10)  // planes
buf.writeUInt16LE(32, 12) // bpp
writeU32(buf, 14, bmpSize) // size of BMP data
writeU32(buf, 18, dataOffset) // offset to BMP data

// BITMAPINFOHEADER
const bmp = buf.slice(dataOffset)
writeU32(bmp, 0, 40)           // biSize
writeU32(bmp, 4, SIZE)         // biWidth
writeU32(bmp, 8, SIZE * 2)     // biHeight (2x because ICO uses XOR+AND mask)
writeU32(bmp, 12, 1)           // biPlanes
writeU32(bmp, 14, 32)          // biBitCount
writeU32(bmp, 16, 0)           // biCompression (BI_RGB)
writeU32(bmp, 20, pixelData.length) // biSizeImage
writeU32(bmp, 24, 0)           // biXPelsPerMeter
writeU32(bmp, 28, 0)           // biYPelsPerMeter
writeU32(bmp, 32, 0)           // biClrUsed
writeU32(bmp, 36, 0)           // biClrImportant

// 像素数据
pixelData.copy(bmp, 40)

// 写入文件
const outPath = path.resolve(__dirname, '..', 'public', 'icon.ico')
fs.mkdirSync(path.dirname(outPath), { recursive: true })
fs.writeFileSync(outPath, buf)
console.log(`✅ 图标已生成: ${outPath} (${SIZE}×${SIZE}, ${(fileSize / 1024).toFixed(0)} KB)`)
