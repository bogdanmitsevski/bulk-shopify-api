const fs    = require('fs');
const today = new Date();


async function changeExtension() {
    fs.rename(`/Users/Bogdan/Desktop/writeFile/file.jsonl`, `/Users/Bogdan/Desktop/writeFile/backup_${today.toLocaleDateString()}.json`, function (err) {
        if (err) console.log('ERROR: ' + err);
    });
}

module.exports = { changeExtension };