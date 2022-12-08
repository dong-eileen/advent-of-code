const fs = require('fs');
const readline = require('readline');

/**
 * Col 1:
 * A = Rock = 1 pts
 * B = Paper = 2 pts
 * C = Scissors = 3 pts
 * 
 * Col 2:
 * X = Rock
 * Y = Paper
 * Z = Scissors
 * 
 * Score for each round = Shape pts + Outcome (0 loss, 3 draw, 6 win)
 */

const ROCK = 'Rock';
const PAPER = 'Paper';
const SCISSORS = 'Scissors';

//#region Shared btwn Parts

// The strengthsTriangle is mapped [choice] -> what it's strong to
const strengthsTriangle = {
    [ROCK]: SCISSORS,
    [PAPER]: ROCK,
    [SCISSORS]: PAPER
};

const weaknessesTriangle = {
    [ROCK]: PAPER,
    [PAPER]: SCISSORS,
    [SCISSORS]: ROCK
}

const parseChoiceToPoints = (choice) => {
    return {
        [ROCK]: 1,
        [PAPER]: 2,
        [SCISSORS]: 3
    }[choice];
}

//#endregion

//#region Part 2 Exclusive; could reuse the functions from Part 1 with a lil more time and finesse that I don't have

// X = loss, Y = draw, Z = win
const parseResultLetterToPoints = (youResult) => {
    return {
        X: 0,
        Y: 3,
        Z: 6
    }[youResult];
}

const parseLetterIntoRockPaperScissorsPart2 = (letter) => {
    return {
        A: ROCK,
        B: PAPER,
        C: SCISSORS
    }[letter];
}

const calculateChoiceNeededForResult = (opponentChoice, youResult) => {
    if (youResult === 'Y') {
        // if a draw, you need to choose the same thing as your opponent
        return opponentChoice;
    } else if (youResult === 'X') {
        // if you lose, you need to choose something weak to your opponent.
        return strengthsTriangle[opponentChoice];
    } else {
        // if you win, you need to choose something strong against your opponent
        return weaknessesTriangle[opponentChoice];
    }
}

/**
 * XYZ means different things now
 * X = you need to lose
 * Y = you need to draw
 * Z = you need to win
 */
const part2 = (fileReader) => {
    let totalScore = 0;
    fileReader.on('line', (line) => {
        const opponentLetter = line[0];
        const opponentChoice = parseLetterIntoRockPaperScissorsPart2(opponentLetter);
        const youResult = line[2];
        const youChoiceNeededForResult = calculateChoiceNeededForResult(opponentChoice, youResult);
        totalScore += parseResultLetterToPoints(youResult) + parseChoiceToPoints(youChoiceNeededForResult);
    });
    fileReader.on('close', () => {
        console.log(totalScore);
    });
}

//#endregion

//#region Part 1 exclusive

// for sanity
const parseLetterIntoRockPaperScissors = (letter) => {
    switch(letter) {
        case 'A':
        case 'X':
            return ROCK;
        case 'B':
        case 'Y':
            return PAPER;
        case 'C':
        case 'Z':
            return SCISSORS;
    }
}

const parseVictoryToPoints = (opponentChoice, youChoice) => {
    const victory = youWin(opponentChoice, youChoice);
    if (victory === 1) {
        return 6;
    } else if (victory === 0) {
        return 3;
    } else {
        return 0;
    }
}

// returns 1 for a win, 0 for a draw, and -1 for a loss
const youWin = (opponentChoice, youChoice) => {
    if (opponentChoice === youChoice) {
        return 0;
    }
    if (strengthsTriangle[opponentChoice] === youChoice) {
        // if the opponent plays a move strong against yours, then you lose
        return -1;
    } else {
        // else, you win. The draw case is already handled at the beginning so it doesn't need to be taken into account
        return 1;
    }
}

// parse each line and calculate scores based on the outcomes
const part1 = (fileReader) => {
    let totalScore = 0;
    fileReader.on('line', (line) => {
        const opponentLetter = line[0];
        const opponentChoice = parseLetterIntoRockPaperScissors(opponentLetter);
        const youLetter = line[2];
        const youChoice = parseLetterIntoRockPaperScissors(youLetter);
        totalScore += parseVictoryToPoints(opponentChoice, youChoice) + parseChoiceToPoints(youChoice);
    });
    fileReader.on('close', () => {
        console.log(totalScore);
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