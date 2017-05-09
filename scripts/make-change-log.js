const fs = require('fs');

const lines = fs.readFileSync('log', 'utf-8').split('\n').filter(Boolean);

const output = [];

for (const line of lines) {
  const [hash, name] = /^(\S+) (.*)$/.exec(line).slice(1);
  const version = /^\d+\.\d+\.\d+/.exec(name);
  if (version) {
    output.push('');
    output.push(`## ${version}`);
    output.push('');
    continue;
  }
  if (/#/.test(name)) {
    output.push(` - ${name}`);
  }
}

console.log(output.join('\n'));

