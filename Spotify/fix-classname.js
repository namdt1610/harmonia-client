const fs = require('fs');
const path = require('path');
const util = require('util');
const readdir = util.promisify(fs.readdir);
const readFile = util.promisify(fs.readFile);
const writeFile = util.promisify(fs.writeFile);
const stat = util.promisify(fs.stat);

const UI_COMPONENTS_DIR = path.join(__dirname, 'src', 'components', 'ui');

async function fixClassNameErrors() {
  try {
    const files = await readdir(UI_COMPONENTS_DIR);
    const tsxFiles = files.filter(file => file.endsWith('.tsx'));
    
    console.log(`Found ${tsxFiles.length} TSX files in the UI components directory`);
    
    let fixedFiles = 0;
    
    for (const file of tsxFiles) {
      const filePath = path.join(UI_COMPONENTS_DIR, file);
      const fileStats = await stat(filePath);
      
      if (!fileStats.isFile()) continue;
      
      let content = await readFile(filePath, 'utf8');
      const originalContent = content;
      
      // Fix pattern: className={cn(..., className)} -> className={cn(..., className ?? "")}
      content = content.replace(/className=\{cn\(([\s\S]*?)(,\s*className)(\s*)\)/g, 'className={cn($1$2 ?? ""$3)');
      
      // Fix pattern: inset && "class" -> inset ? "class" : ""
      content = content.replace(/(\w+)\s*&&\s*(["'])([^"']+)\2/g, '$1 ? $2$3$2 : ""');
      
      if (content !== originalContent) {
        await writeFile(filePath, content, 'utf8');
        console.log(`Fixed className errors in ${file}`);
        fixedFiles++;
      }
    }
    
    console.log(`Fixed className errors in ${fixedFiles} files`);
  } catch (error) {
    console.error('Error fixing className errors:', error);
  }
}

fixClassNameErrors();
