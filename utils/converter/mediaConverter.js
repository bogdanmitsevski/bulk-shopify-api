const fs = require('fs');
const download = require('image-downloader');
const fsPromises = require('fs/promises');
function downloadImage(url, filepath) {
    return download.image({
        url,
        dest: filepath
    });
}

async function downloadMedia() {
    const mediaString = await fsPromises.readFile('/Users/Bogdan/Desktop/writeFile/resultData/MEDIA.jsonl', 'utf-8');
    let jsonMediaString = `[ ${mediaString.split(/\n/).toString().replace(/\,(?!\s*?[\{\[\"\'\w])/g, '')} ]`;
    let parsedMediaString = JSON.parse(jsonMediaString);

    for (let i = 0; i < parsedMediaString.length; i++) {
        if (Object.keys(parsedMediaString[i]).length === 3) {
            downloadImage(parsedMediaString[i].preview.image.url, '/Users/Bogdan/Desktop/writeFile/resultData/productPhotos');
        }
    }
    console.log('Download Completed Successfully');
};


module.exports = { downloadMedia };