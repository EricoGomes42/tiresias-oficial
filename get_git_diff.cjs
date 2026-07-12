const { execSync } = require('child_process');
try {
    const diff = execSync('git log -p -1 index.html', { encoding: 'utf-8' });
    console.log(diff.substring(0, 2000));
} catch(e) {
    console.log("Git log failed");
}
