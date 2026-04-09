const fs = require('fs');
const path = require('path');

const srcDir = path.join(__dirname, 'dist', 'browser');
const extDir = path.join(__dirname, 'extension');

function copyDir(src, dest) {
  if (!fs.existsSync(dest)) fs.mkdirSync(dest, { recursive: true });
  const entries = fs.readdirSync(src, { withFileTypes: true });
  for (let entry of entries) {
    const srcPath = path.join(src, entry.name);
    const destPath = path.join(dest, entry.name);
    if (entry.isDirectory()) {
      copyDir(srcPath, destPath);
    } else {
      fs.copyFileSync(srcPath, destPath);
    }
  }
}

copyDir(srcDir, extDir);

const manifest = {
  "manifest_version": 3,
  "name": "BookMarkHub",
  "version": "1.0.0",
  "description": "发现导航是一个轻量级免费且强大的导航网站。现已作为您的 Edge 浏览器新标签页扩展。",
  "icons": {
    "16": "icons/icon-192x192.png",
    "48": "icons/icon-192x192.png",
    "128": "icons/icon-512x512.png"
  },
  "action": {
    "default_title": "BookMarkHub",
    "default_icon": "icons/icon-192x192.png"
  },
  "chrome_url_overrides": {
    "newtab": "index.html"
  },
  "permissions": ["storage"],
  "host_permissions": ["<all_urls>"]
};

fs.writeFileSync(path.join(extDir, 'manifest.json'), JSON.stringify(manifest, null, 2), 'utf8');

let indexHtml = fs.readFileSync(path.join(extDir, 'index.html'), 'utf8');
indexHtml = indexHtml.replace(/<base href="\.\/">/g, '');
indexHtml = indexHtml.replace(/<base href="\/">/g, '');
indexHtml = indexHtml.replace(/<base href="">/g, '');
indexHtml = indexHtml.replace(/<link rel="stylesheet" href="([^"]+)" media="print" onload="this\.media='all'">/g, '<link rel="stylesheet" href="$1">');
indexHtml = indexHtml.replace(/<noscript><link rel="stylesheet" href="([^"]+)"><\/noscript>/g, '');

let inlineScriptContent = '';
const scriptRegex = /<script>([\s\S]*?)<\/script>/gi;
let match;
while ((match = scriptRegex.exec(indexHtml)) !== null) {
  inlineScriptContent += match[1] + '\n';
}
indexHtml = indexHtml.replace(scriptRegex, '');
if (inlineScriptContent.trim() !== '') {
  fs.writeFileSync(path.join(extDir, 'inline-scripts.js'), inlineScriptContent, 'utf8');
  indexHtml = indexHtml.replace('</head>', '  <script src="inline-scripts.js"></script>\n  </head>');
}
fs.writeFileSync(path.join(extDir, 'index.html'), indexHtml, 'utf8');

const srcDataDir = path.join(__dirname, 'data');
const destDataDir = path.join(extDir, 'data');
if (fs.existsSync(srcDataDir)) {
  copyDir(srcDataDir, destDataDir);
}

// Fix xe-user-name dark mode issue in chunks
const entries = fs.readdirSync(extDir);
for (let entry of entries) {
  if (entry.startsWith('chunk-') && entry.endsWith('.js')) {
    let jsContent = fs.readFileSync(path.join(extDir, entry), 'utf8');
    if (jsContent.includes('.xe-user-name[_ngcontent-%COMP%]')) {
      if (!jsContent.includes('.dark .xe-user-name[_ngcontent-%COMP%]{color:#fff!important}')) {
        jsContent = jsContent.replace(
          /\.icon2\[_ngcontent-%COMP%\]\s*\.name\[_ngcontent-%COMP%\]\{margin-top:2px;text-align:center\}"\]\}\);/g,
          '.icon2[_ngcontent-%COMP%] .name[_ngcontent-%COMP%]{margin-top:2px;text-align:center}.dark .xe-user-name[_ngcontent-%COMP%]{color:#fff!important}"]});'
        );
        fs.writeFileSync(path.join(extDir, entry), jsContent, 'utf8');
      }
    }
  }
}
