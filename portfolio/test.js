const { execSync } = require('child_process');
const fs = require('fs');

try {
  const output = execSync('npx vite build', { encoding: 'utf-8' });
  fs.writeFileSync('log.txt', output);
} catch (error) {
  fs.writeFileSync('log.txt', `STDOUT: ${error.stdout}\nSTDERR: ${error.stderr}\nMESSAGE: ${error.message}`);
}
