const fs = require('fs');
const readline = require('readline');

let alphabet = 'abcdefghijklmnopqrstuvwxyz';
alphabet += alphabet.toUpperCase();
alphabet = alphabet.split('');
const ALPHABET_TO_PRIORITIES = alphabet.reduce((total, curr, i) => {
    total[curr] = i + 1;
    return total;
}, {});

const getCommonItems = (list1, list2) => {
    const set2 = new Set(list2);
    const commonElements = list1.filter(l1 => set2.has(l1));
    return new Set(commonElements);
}

//#region Part 2 Exclusive

/**
 * Changed code from Part 1:
 * - Don't need to split each line in half.
 * - keep a running tally of shared items in each group (essentially set intersect three lines)
 * - calculate priority based on above
 */
const part2 = (fileReader) => {
    let sum = 0;
    let commonItemsInGroup = new Set();
    let groupInd = 0;
    fileReader.on('line', (line) => {
        // find the item types
        const commonItems =  new Set(line.split(''));
        // keep an updated list of shared items throughout the group
        if (groupInd === 0) {
            commonItemsInGroup = commonItems;
        } else {
            commonItemsInGroup = getCommonItems([...commonItemsInGroup], [...commonItems]);
        }

        if (groupInd === 2) {
            // this is the end of the group, so find the priority of the common element in the group. Reusing code from Part 1 just out of laziness
            const ruckSackPriority = [...commonItemsInGroup].reduce((total, curr) => total + ALPHABET_TO_PRIORITIES[curr], 0);
            // add to total
            sum += ruckSackPriority;
            // reset for the next group
            commonItemsInGroup = new Set();
            groupInd = 0;
        } else {
            groupInd++;
        }
    });
    fileReader.on('close', () => {
        console.log(sum);
    });
}

//#endregion

//#region Part 1 Exclusive

/**
 * Items a-z have priorities 1-26 (like the alphabet).
 * Items A-Z have priorities 27-52.
 * Find items in both half compartments of a rucksack (rucksack = line)
 * Sum the priorities of those items.
 */

const part1 = (fileReader) => {
    let sum = 0;
    fileReader.on('line', (line) => {
        // split the line in half
        const firstHalf = line.slice(0, line.length / 2);
        const lastHalf = line.slice(line.length / 2);
        // set intersection to find the item types shared both halves
        const commonItems = getCommonItems(firstHalf.split(''), lastHalf.split(''));
        // map the priorities to each item and add them to find the total for the rucksack
        const ruckSackPriority = [...commonItems].reduce((total, curr) => total + ALPHABET_TO_PRIORITIES[curr], 0);
        // add to total
        sum += ruckSackPriority;
    });
    fileReader.on('close', () => {
        console.log(sum);
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