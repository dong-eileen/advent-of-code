const fs = require('fs');
const readline = require('readline');

const executeCommands = (commands, grid, headCoords) => {
    const headX = headCoords[0];
    const headY = headCoords[1];
    for (let i = 0; i < commands.length; i++) {
        const direction = commands[1];
        const numTiles = commands[2];
        if ()
    }
}

// generates the grid based on the input commands. Returns where the head would be within that grid.
const generateGrid = (commands) => {
    // use the number of directions to determine the limits of the grid
    let numTilesToLeft = 0;
    let numTilesToRight = 0;
    let numTilesToUp = 0;
    let numTilesToDown = 0;
    let x = 0;
    let y = 0;
    commands.forEach(([direction, numTimes]) => {
        switch(direction) {
            case 'L':
                x -= numTimes;
                if (x < 0) {
                    numTilesToLeft = Math.max(Math.abs(x), numTilesToLeft);
                }
                break;
            case 'R':
                x += numTimes;
                if (x > 0) {
                    numTilesToRight = Math.max(x, numTilesToRight);
                }
                break;
            case 'U':
                y += numTimes;
                if (y > 0) {
                    numTilesToUp = Math.max(y, numTilesToUp);
                }
                break;
            case 'D':
                y -= numTimes;
                if (y < 0) {
                    numTilesToDown = Math.max(Math.abs(y), numTilesToDown);
                }
                break;
            default:
                throw Error('This should not happen.');
        }
    });
    const totalX = numTilesToLeft + numTilesToRight + 1;
    const totalY = numTilesToDown + numTilesToUp + 1;
    const grid = Array(totalY).fill().map(s => Array(totalX).fill(false)); // false = the node hasn't been visited
    return [numTilesToLeft, numTilesToUp, grid]; // first two values are the head's coords
}

const printGrid = (grid) => {
    grid.forEach(row => {
        const printSt = row.map(col => {
            return col ? 'V' : '.'
        }).join('');
        console.log(printSt);
    });
}

const part1 = (fileReader) => {
    const commands = [];
    fileReader.on('line', (line) => {
        const regex = /^(\w) (\d+)$/;
        const regexMatch = regex.exec(line);
        commands.push([regexMatch[1], +regexMatch[2]]);
    });
    fileReader.on('close', () => {
        const [headX, headY, grid] = generateGrid(commands);
        grid[headY][headX] = true;
        if ()
    });
}

try {
    var fileReader = readline.createInterface({
        input: fs.createReadStream('test-input.txt')
    });
    part1(fileReader);
} catch (err) {
    console.error(err);
}