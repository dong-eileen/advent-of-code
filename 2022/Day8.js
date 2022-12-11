const fs = require('fs');
const readline = require('readline');

const printTreeGrid = (treeGrid) => {
    treeGrid.forEach(row => {
        console.log(row.join(''));
    });
}

const getFullTreeColumn= (treeGrid, col) => {
    return treeGrid.map(row => row[col]);
}

//#region Part 2

const calculateScenicScore = (treeGrid, row, col) => {
    const height = treeGrid[row][col];
    let numValidTreesToLeft = 0;
    let numValidTreesToRight = 0;
    if (col > 0) {
        // do while because apparently the first tall tree counts too
        let c = col;
        do {
            numValidTreesToLeft++;
            c--;
        } while (c > 0 && treeGrid[row][c] < height);
    }
    if (col < treeGrid[row].length - 1) {
        let c = col;
        do {
            numValidTreesToRight++;
            c++;
        } while(c < treeGrid[row].length-1 && treeGrid[row][c] < height);
    }
    let numValidTreesToTop = 0;
    if (row > 0) {
        let r = row;
        do {
            numValidTreesToTop++;
            r--;
        } while(r > 0 && treeGrid[r][col] < height);
    }
    let numValidTreesToBottom = 0;
    if (row < treeGrid.length - 1) {
        let r = row;
        do {
            numValidTreesToBottom++;
            r++;
        } while (r < treeGrid.length-1 && treeGrid[r][col] < height);
    }

    if (row === 3 && col === 2) {
        console.log(height);
        console.log('top'+ numValidTreesToTop);
        console.log('bottom'+numValidTreesToBottom);
        console.log('right'+numValidTreesToRight);
        console.log('left'+numValidTreesToLeft);
    }
    return numValidTreesToBottom * numValidTreesToTop * numValidTreesToLeft * numValidTreesToRight;
}

const part2 = (fileReader) => {
    let treeGrid = [];
    fileReader.on('line', (line) => {
        treeGrid.push(line.split('').map(height => +height));
    });
    fileReader.on('close', () => {
        let maxScenicScore = 0;
        treeGrid.forEach((_, row) => {
            treeGrid[row].forEach((_, col) => {
                const scenicScore = calculateScenicScore(treeGrid, row, col);
                if (maxScenicScore < scenicScore) {
                    maxScenicScore = scenicScore;
                }
            })
        })
        console.log(maxScenicScore);
    });
}

//#endregion

//#region Part 1

const isTreeVisible = (treeGrid, row, col) => {
    if (row <= 0 || col <= 0 || row >= treeGrid.length-1 || col >= treeGrid[row].length-1) {
        // it's on the border
        return true;
    }

    const height = treeGrid[row][col];
    const othersToTheLeft = treeGrid[row].slice(0, col);
    const othersToTheRight = treeGrid[row].slice(col+1, treeGrid[col].length);
    const fullColumn = getFullTreeColumn(treeGrid, col);
    const othersToTheTop = fullColumn.slice(0, row);
    const othersToTheBottom = fullColumn.slice(row+1, fullColumn.length);

    const treeIsShorter = th => th < height;
    return othersToTheLeft.every(treeIsShorter) || othersToTheRight.every(treeIsShorter) || othersToTheTop.every(treeIsShorter) || othersToTheBottom.every(treeIsShorter);
}

const part1 = (fileReader) => {
    let treeGrid = [];
    fileReader.on('line', (line) => {
        treeGrid.push(line.split('').map(height => +height));
    });
    fileReader.on('close', () => {
        let count = 0;
        treeGrid.forEach((_, row) => {
            treeGrid[row].forEach((_, col) => {
                if (isTreeVisible(treeGrid, row, col)) {
                    count++;
                }
            })
        })
        console.log(count);
    });
}

//#endregion

try {
    var fileReader = readline.createInterface({
        input: fs.createReadStream('input.txt')
    });
    part1(fileReader);
    part2(fileReader);
} catch (err) {
    console.error(err);
}