const fs = require('fs');

let code = fs.readFileSync('src/layout/MainLayout.jsx', 'utf8');

// Replace className={styles.xxx} with className="xxx"
code = code.replace(/className=\{styles\.([a-zA-Z0-9_]+)\}/g, 'className="$1"');

// Replace styles.xxx with "xxx"
code = code.replace(/styles\.([a-zA-Z0-9_]+)/g, '"$1"');

// Replace import styles from "./MainLayout.module.css";
code = code.replace(/import styles from "\.\/MainLayout\.module\.css";\n/g, '');

fs.writeFileSync('src/layout/MainLayout.jsx', code);
console.log("MainLayout.jsx refactored.");

let indexCss = fs.readFileSync('src/index.css', 'utf8');
let moduleCss = fs.readFileSync('src/layout/MainLayout.module.css', 'utf8');

// Remove @reference and @custom-variant from moduleCss
moduleCss = moduleCss.replace(/@reference "\.\.\/index\.css";\n/g, '');
moduleCss = moduleCss.replace(/@custom-variant dark \([^)]+\);\n/g, '');

// Append to index.css
indexCss += '\n/* MainLayout Styles */\n' + moduleCss;

fs.writeFileSync('src/index.css', indexCss);
console.log("MainLayout.module.css appended to index.css.");

// Now do the same for Login.module.css
let loginCode = fs.readFileSync('src/pages/Login.jsx', 'utf8');
loginCode = loginCode.replace(/className=\{styles\.([a-zA-Z0-9_]+)\}/g, 'className="$1"');
loginCode = loginCode.replace(/styles\.([a-zA-Z0-9_]+)/g, '"$1"');
loginCode = loginCode.replace(/import styles from "\.\/Login\.module\.css";\n/g, '');
fs.writeFileSync('src/pages/Login.jsx', loginCode);

let loginCss = fs.readFileSync('src/pages/Login.module.css', 'utf8');
loginCss = loginCss.replace(/@reference "\.\.\/index\.css";\n/g, '');
loginCss = loginCss.replace(/@custom-variant dark \([^)]+\);\n/g, '');

indexCss = fs.readFileSync('src/index.css', 'utf8');
indexCss += '\n/* Login Styles */\n' + loginCss;
fs.writeFileSync('src/index.css', indexCss);
console.log("Login styles appended to index.css.");
