#!/usr/bin/env node
const { execSync } = require('child_process')
const fs = require('fs')
const path = require('path')

const SIZES = [16, 24, 32, 48, 64, 128, 256, 512]
const SOURCE_SVG = path.join(__dirname, '..', 'src-tauri', 'icons', 'linux.svg')
const OUTPUT_BASE = path.join(__dirname, '..', 'src-tauri', 'linux', 'icons')
const ICON_NAME = 'moe.yzf.bcm-convertor'

function ensureDir(dir) {
  if (!fs.existsSync(dir)) {
    fs.mkdirSync(dir, { recursive: true })
  }
}

function findConverter() {
  const checks = [
    {
      cmd: 'rsvg-convert --version',
      build: (svg, size, out) => `rsvg-convert -w ${size} -h ${size} "${svg}" -o "${out}"`
    },
    {
      cmd: 'inkscape --version',
      build: (svg, size, out) => `inkscape "${svg}" --export-filename="${out}" -w ${size} -h ${size}`
    },
    {
      cmd: 'convert --version',
      build: (svg, size, out) => `convert -background none -resize ${size}x${size} "${svg}" "${out}"`
    }
  ]
  for (const c of checks) {
    try {
      execSync(c.cmd, { stdio: 'ignore' })
      return c.build
    } catch {}
  }
  return null
}

function generateIcons() {
  console.log('Generating Linux app icons from SVG...')
  console.log('Source:', SOURCE_SVG)

  if (!fs.existsSync(SOURCE_SVG)) {
    console.error('Error: Source SVG not found at', SOURCE_SVG)
    process.exit(1)
  }

  const scalableDir = path.join(OUTPUT_BASE, 'scalable', 'apps')
  ensureDir(scalableDir)
  fs.copyFileSync(SOURCE_SVG, path.join(scalableDir, `${ICON_NAME}.svg`))
  console.log(`  scalable: SVG copied`)

  const converter = findConverter()
  if (!converter) {
    console.warn('\nWarning: No SVG converter found (rsvg-convert, inkscape, or ImageMagick).')
    console.warn('PNG icons were not generated. Only SVG is available.')
    console.warn('Install one of: librsvg2-bin, inkscape, imagemagick')
    return
  }

  for (const size of SIZES) {
    const dir = path.join(OUTPUT_BASE, `${size}x${size}`, 'apps')
    ensureDir(dir)
    const outPath = path.join(dir, `${ICON_NAME}.png`)
    const cmd = converter(SOURCE_SVG, size, outPath)
    execSync(cmd, { stdio: 'ignore' })
    console.log(`  ${size}x${size}: generated`)
  }

  console.log('\nIcons generated successfully!')
}

generateIcons()
