const fs = require('fs');
const path = require('path');

const filePath = path.join(__dirname, '..', 'node_modules', 'next', 'dist', 'lib', 'find-pages-dir.js');

if (fs.existsSync(filePath)) {
  let content = fs.readFileSync(filePath, 'utf8');
  if (!content.includes('let srcDir = _path.default.join(dir, "src", name);')) {
    content = content.replace(
      'function findDir(dir, name) {\n    // prioritize ./${name} over ./src/${name}\n    let curDir = _path.default.join(dir, name);\n    if (_fs.default.existsSync(curDir)) return curDir;\n    curDir = _path.default.join(dir, "src", name);\n    if (_fs.default.existsSync(curDir)) return curDir;\n    return null;\n}',
      'function findDir(dir, name) {\n    let srcDir = _path.default.join(dir, "src", name);\n    if (_fs.default.existsSync(srcDir)) return srcDir;\n    let curDir = _path.default.join(dir, name);\n    if (_fs.default.existsSync(curDir)) return curDir;\n    return null;\n}'
    );
    fs.writeFileSync(filePath, content);
    console.log('[pulse] Successfully configured Next.js to prioritize src/ directory');
  }
}
