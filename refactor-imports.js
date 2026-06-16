const fs = require('fs');
const path = require('path');

const srcDir = path.join(__dirname, 'src');

function getAllFiles(dir, fileList = []) {
  const files = fs.readdirSync(dir);
  for (const file of files) {
    const filePath = path.join(dir, file);
    if (fs.statSync(filePath).isDirectory()) {
      getAllFiles(filePath, fileList);
    } else if (filePath.endsWith('.ts')) {
      fileList.push(filePath);
    }
  }
  return fileList;
}

const files = getAllFiles(srcDir);

let changedFiles = 0;

for (const file of files) {
  let content = fs.readFileSync(file, 'utf8');
  let changed = false;

  const importRegex = /(import|export)\s+(?:.*?)\s+from\s+['"]([^'"]+)['"]/gs;

  content = content.replace(importRegex, (match, p1, importPath) => {
    if (importPath.startsWith('.')) {
      const currentDir = path.dirname(file);
      const absoluteImportPath = path.resolve(currentDir, importPath);

      if (absoluteImportPath.startsWith(srcDir)) {
        const relativeToSrc = path.relative(srcDir, absoluteImportPath).replace(/\\/g, '/');

        if (relativeToSrc.startsWith('domain/')) {
          changed = true;
          return match.replace(importPath, `@domain/${relativeToSrc.substring('domain/'.length)}`);
        } else if (relativeToSrc.startsWith('application/')) {
          changed = true;
          return match.replace(importPath, `@application/${relativeToSrc.substring('application/'.length)}`);
        } else if (relativeToSrc.startsWith('infrastructure/')) {
          changed = true;
          return match.replace(importPath, `@infrastructure/${relativeToSrc.substring('infrastructure/'.length)}`);
        }
      }
    }
    return match;
  });

  if (changed) {
    fs.writeFileSync(file, content, 'utf8');
    changedFiles++;
    console.log(`Updated imports in ${path.relative(__dirname, file)}`);
  }
}

console.log(`Successfully updated ${changedFiles} files.`);
