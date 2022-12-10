const fs = require('fs');
const readline = require('readline');

class MoveInstruction {
    constructor (numBoxes, fromColInd, toColInd) {
        this.numBoxes = numBoxes;
        this.fromColInd = fromColInd;
        this.toColInd = toColInd;
    }
}

// return a list of boxes; index is the col
const parseBoxLine = (line) => {
    const boxes = [];
    for (let i = 0; i < line.length; i+=4) {
        const box = line.slice(i+1, i+2);
        boxes.push(box);
    }
    return boxes;
}


// return a list [numBoxes, fromColInd, toColInd]
const parseCommand = (line) => {
    const regex = /^move (\d+) from (\d+) to (\d+)/g;
    const result = regex.exec(line);
    return new MoveInstruction(+result[1], +result[2] - 1, +result[3] - 1);
}

const executeCommand = (command, boxes, isPart2) => {
    // splice numBoxes from the end of a col list
    const boxesToMove = boxes[command.fromColInd].splice(-command.numBoxes);
    if (!isPart2) {
        boxesToMove.reverse();
    }
    // splice those boxes into the end of the target col list
    boxes[command.toColInd] = boxes[command.toColInd].concat(boxesToMove);
}

// for debugging
const printBoxes = (boxes) => {
    boxes.forEach((b, i) => console.log(`${i+1} - ${b.join('')}`));
}

const solution = (fileReader, isPart2) => {
    // using a two-dimensional array like a true heathen
    // boxes[0] represents the stack of boxes in col 1 from bottom to top. No white spaces
    let boxes = [];
    let iteration = 0;
    fileReader.on('line', (line) => {
        if (line.startsWith('move')) {
            const command = parseCommand(line);
            executeCommand(command, boxes, isPart2);
            iteration++;
        } else if (line.startsWith('[')) {
            // parse boxes
            const parsedLine = parseBoxLine(line);
            parsedLine.forEach((box, i) => {
                if (!boxes[i]) {
                    boxes.push([box]);
                } else {
                    boxes[i].unshift(box);
                }
            });
        } else if (line.startsWith(' 1')) {
            // clean up the white spaces
            boxes = boxes.map(col => col.filter(b => b !== ' '));
        }
    });
    fileReader.on('close', () => {
        console.log(boxes.map(col => col[col.length - 1]).join(''));
    });
}

//#endregion

try {
    var fileReader = readline.createInterface({
        input: fs.createReadStream('input.txt')
    });
    solution(fileReader);
    solution(fileReader, true);
} catch (err) {
    console.error(err);
}