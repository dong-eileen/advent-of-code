const fs = require('fs');
const readline = require('readline');

const solution = (fileReader, numDistinctChars) => {
    let charsToProcess = 0;
    fileReader.on('line', (line) => {
        for (let i = 0; i < line.length; i++) {
            const chars = line.slice(i, i+numDistinctChars);
            if (chars.length < numDistinctChars) {
                // don't need to process the last x chars if there aren't enough chars ahead of them
                return;
            }
            const isEveryCharDifferent = (new Set(chars)).size === numDistinctChars;
            if (isEveryCharDifferent) {
                charsToProcess = i+numDistinctChars;
                return;
            }
        }
    });
    fileReader.on('close', () => {
        console.log(charsToProcess);
    });
}

try {
    var fileReader = readline.createInterface({
        input: fs.createReadStream('input.txt')
    });
    solution(fileReader, 4);
    solution(fileReader, 14);
} catch (err) {
    console.error(err);
}