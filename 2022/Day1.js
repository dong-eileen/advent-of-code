const fs = require('fs');
const readline = require('readline');

// find top 3 maxes and sum them
const part2 = (fileReader) => {
    let sum = 0;
    let sums = [];
    fileReader.on('line', (line) => {
        if (!line) {
            // one elf's totals have been calculated
            sums.push(sum);
            sum = 0;
        } else if (line) {
            // sum what the elf's carrying
            sum += +line;
        }
    });
    fileReader.on('close', () => {
        sums.sort((s1, s2) => +s2 - +s1); // numerical sort, descending
        console.log(sums[0] + sums[1] + sums[2]);
    });
}

// find highest max; each sum ends at an empty line
const part1 = (fileReader) => {
    let max = 0;
    let sum = 0;
    fileReader.on('line', (line) => {
        if (!line) {
            // one elf's totals have been calculated; check if that elf is carrying more than the current max
            max = sum > max ? sum : max;
            sum = 0;
        } else if (line) {
            // sum what the elf's carrying
            sum += +line;
        }
    });
    fileReader.on('close', () => {
        console.log(max);
    });
}

try {
    var fileReader = readline.createInterface({
        input: fs.createReadStream('input.txt')
    });
    part2(fileReader);
} catch (err) {
    console.error(err);
}