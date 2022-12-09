const fs = require('fs');
const readline = require('readline');

// reutrns a list of NUMBERS
const parseSectionAssignmentToList = assignmentString => {
    return assignmentString.split('-').map(a => +a);
}

//#region Part 2 Exclusive

// returns if assignment 1 is entirely included in assignment 2
const isAssignmentInOther = (assignment1, assignment2) => {
    return assignment1[0] >= assignment2[0] && assignment1[0] <= assignment2[1];
}

const part2 = (fileReader) => {
    let count = 0;
    fileReader.on('line', (line) => {
        const bothElves = line.split(',');
        const elf1Assignment = parseSectionAssignmentToList(bothElves[0]);
        const elf2Assignment = parseSectionAssignmentToList(bothElves[1]);

        // check if the min of one is > than the min of the other AND that the min is < the max of other
        // the above means that there's at least one point of overlap
        if (isAssignmentInOther(elf1Assignment, elf2Assignment) || isAssignmentInOther(elf2Assignment, elf1Assignment)) {
            console.log('true')
            count++;
        }
    });
    fileReader.on('close', () => {
        console.log(count);
    });
}

//#endregion

//#region Part 1 Exclusive

// returns if assignment 1 is entirely included in assignment 2
const isAssignmentEntirelyInOther = (assignment1, assignment2) => {
    return assignment1[0] >= assignment2[0] && assignment1[1] <= assignment2[1];
}

const part1 = (fileReader) => {
    let count = 0;
    fileReader.on('line', (line) => {
        const bothElves = line.split(',');
        const elf1Assignment = parseSectionAssignmentToList(bothElves[0]);
        const elf2Assignment = parseSectionAssignmentToList(bothElves[1]);

        // check if the min of one is > than the min of the other
        // check if the max of that one is < the max of the other
        // if the above two conditions are satisfied, then increment the count
        if (isAssignmentEntirelyInOther(elf1Assignment, elf2Assignment) || isAssignmentEntirelyInOther(elf2Assignment, elf1Assignment)) {
            count++;
        }

    });
    fileReader.on('close', () => {
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