// Simple script to create SVG icons and convert to PNG for the extension
// This would normally be run in a Node.js environment with appropriate libraries

const iconSvg = `
<svg width="128" height="128" viewBox="0 0 128 128" xmlns="http://www.w3.org/2000/svg">
  <defs>
    <linearGradient id="grad" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" style="stop-color:#667eea;stop-opacity:1" />
      <stop offset="100%" style="stop-color:#764ba2;stop-opacity:1" />
    </linearGradient>
  </defs>
  
  <!-- Background circle -->
  <circle cx="64" cy="64" r="60" fill="url(#grad)" stroke="#fff" stroke-width="4"/>
  
  <!-- Block symbol (crossed out square) -->
  <rect x="40" y="40" width="48" height="48" fill="none" stroke="#fff" stroke-width="6" rx="4"/>
  
  <!-- Diagonal lines for "blocked" effect -->
  <line x1="35" y1="35" x2="93" y2="93" stroke="#fff" stroke-width="8" stroke-linecap="round"/>
  <line x1="93" y1="35" x2="35" y2="93" stroke="#fff" stroke-width="8" stroke-linecap="round"/>
  
  <!-- Small social media icons (simplified) -->
  <circle cx="48" cy="48" r="6" fill="#fff" opacity="0.8"/>
  <circle cx="80" cy="48" r="6" fill="#fff" opacity="0.8"/>
  <circle cx="48" cy="80" r="6" fill="#fff" opacity="0.8"/>
  <circle cx="80" cy="80" r="6" fill="#fff" opacity="0.8"/>
</svg>
`

console.log('SVG Icon:')
console.log(iconSvg)

// In a real implementation, you would:
// 1. Save this SVG to a file
// 2. Use a tool like Inkscape, ImageMagick, or a Node.js library to convert to PNG
// 3. Generate 16x16, 48x48, and 128x128 versions

// For now, we'll create placeholder instructions
console.log('\nTo create actual PNG icons:')
console.log('1. Save the SVG above to icon.svg')
console.log('2. Use ImageMagick: convert icon.svg -resize 16x16 icon16.png')
console.log('3. Use ImageMagick: convert icon.svg -resize 48x48 icon48.png')  
console.log('4. Use ImageMagick: convert icon.svg -resize 128x128 icon128.png')