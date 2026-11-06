// Check portable runtime references and current documentation links before publishing.
const fs = require('node:fs');
const path = require('node:path');
const assert = require('node:assert/strict');
const root = path.resolve(__dirname, '..');
let checked = 0;
for (const file of ['index.html', 'script.js', 'profile-art.js', 'profile-experience.js', 'profile-experience.css', 'serve.cjs']) {
  const source = fs.readFileSync(path.join(root, file), 'utf8');
  assert(!/[CD]:[\\/]friends-interactive-presentation/i.test(source), file + ': absolute project path');
  for (const match of source.matchAll(/(?:src|href)=["']([^"'#]+)["']/g)) {
    const target = match[1];
    if (/^(?:https?:|data:|\$|\/)/.test(target) || target.includes('${')) continue;
    assert(fs.existsSync(path.join(root, target.split(/[?#]/)[0])), file + ': missing ' + target);
    checked++;
  }
}
for (const file of ['README.md', 'PRD.md', 'FINAL_COMPLIANCE_REPORT.md', 'RED_TEAM_REVIEW.md', 'llm_logs/README.md', 'docs/PROFILE_UPGRADE_FILES.md']) {
  const source = fs.readFileSync(path.join(root, file), 'utf8');
  for (const match of source.matchAll(/\]\(([^)]+)\)/g)) {
    const target = match[1];
    if (/^(?:https?:|#|mailto:)/.test(target)) continue;
    assert(fs.existsSync(path.resolve(root, path.dirname(file), target.split('#')[0])), file + ': missing ' + target);
    checked++;
  }
}
console.log(JSON.stringify({passed: true, checkedLocalReferences: checked}));
