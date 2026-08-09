import * as fs from 'fs';
import * as path from 'path';

const baseDir = './src/assets/illustrations'; // Where your .svg files are
const outputFile = './src/app/illustrations/images/illustrations.registry.ts';

const getFiles = (dir) => {
  return fs.readdirSync(dir, { withFileTypes: true }).flatMap(file => {
    const res = path.resolve(dir, file.name);
    return file.isDirectory() ? getFiles(res) : res;
  }).filter(f => f.endsWith('.svg'));
};

const files = getFiles(baseDir);

const exports = files.map(filePath => {
  const fileName = path.parse(filePath).name;
  const parentDir = path.basename(path.dirname(filePath)); // 'light' or 'dark'
  
  // Create unique name: ill504Light or ill504Dark
  const suffix = parentDir.charAt(0).toUpperCase() + parentDir.slice(1);
  const calledName = suffix === 'Dark' ? `${fileName}-dark` : fileName;
  const camelName = fileName.replace(/-([a-z])/g, (g) => g[1].toUpperCase()).replace('-','_');
  const name = suffix === 'Dark' ? `Illust${camelName.charAt(0).toUpperCase() + camelName.slice(1)}${suffix}` : `Illust${camelName.charAt(0).toUpperCase() + camelName.slice(1)}`;
  // The 'name' used in the registry should probably include the theme for easy lookup
  
  let data = fs.readFileSync(filePath, 'utf8')
    .replace(/<\?xml.*?\?>/gi, '')
    .replace(/<!DOCTYPE.*?>/gi, '')
    .replace(/\r?\n|\r/g, '')
    .replace(/\t/g, ' ')
    .replace(/\s+/g, ' ')
    .trim();

  return `export const ${name} = { name: '${calledName}', data: '${data}' };`;
});

const fileContent = `// Auto-generated file - do not edit manually\n\n${exports.join('\n')}`;

fs.writeFileSync(outputFile, fileContent);
console.log(`Successfully converted ${files.length} illustrations to ${outputFile}`);