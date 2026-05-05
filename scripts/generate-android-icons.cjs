#!/usr/bin/env node
/**
 * 生成 Android 应用图标
 * 将源图片复制到不同尺寸的 mipmap 目录
 */

const fs = require('fs')
const path = require('path')

// Android 图标尺寸定义
const ICON_SIZES = {
  'mipmap-mdpi': 48, // 中等密度
  'mipmap-hdpi': 72, // 高密度
  'mipmap-xhdpi': 96, // 超高密度
  'mipmap-xxhdpi': 144, // 超超高密度
  'mipmap-xxxhdpi': 192 // 超超超高密度
}

const SOURCE_ICON = path.join(__dirname, '..', 'public', 'kitten3_player_icon.png')
const OUTPUT_BASE = path.join(__dirname, '..', 'src-tauri', 'convert', 'android', 'shell', 'app', 'src', 'main', 'res')

function generateIcons() {
  console.log('Generating Android app icons...')
  console.log('Source:', SOURCE_ICON)

  // 检查源文件是否存在
  if (!fs.existsSync(SOURCE_ICON)) {
    console.error('Error: Source icon not found at', SOURCE_ICON)
    process.exit(1)
  }

  // 为每个尺寸创建图标
  for (const [folder, size] of Object.entries(ICON_SIZES)) {
    const outputDir = path.join(OUTPUT_BASE, folder)
    const outputPath = path.join(outputDir, 'ic_launcher.png')

    // 确保目录存在
    if (!fs.existsSync(outputDir)) {
      fs.mkdirSync(outputDir, { recursive: true })
    }

    // 复制源文件作为图标
    fs.copyFileSync(SOURCE_ICON, outputPath)

    console.log(`  ${folder}: ${size}x${size} -> ${outputPath}`)
  }

  console.log('\nIcons generated successfully!')
  console.log('Note: Currently copying original image. For production, consider resizing images to proper dimensions.')
}

generateIcons()
