#! /usr/bin/env node
const yargs = require("yargs");

const usage = "\nUsage: Run simulations for the Dice Game.";
const options = yargs  
      .usage(usage)
      .options({
        "i": {
            alias:"iterations",
            describe: "Number of iterations of the game to run.",
            type: "int",
            demandOption: true 
        },
        "d": {
            alias:"dice",
            describe: "Number of dice to use.",
            type: "int",
            demandOption: true 
        },
      })
      .help(true)
      .argv;

const startTime = Date.now();

const rollDie = () => {
    return Math.floor(Math.random() * 6) + 1;
}

const rollDice = (numberOfDice) => {
    let numberOfDiceRemaining = numberOfDice;
    let containsAThree = false;
    let lowestDiceRoll = 7;

    let resultsArr = [];
    for (let i = 0; i < numberOfDice; i++) {
        const dieValue = rollDie();
        resultsArr.push(dieValue);
        if (dieValue < lowestDiceRoll) {
            lowestDiceRoll = dieValue;
        }
        if (dieValue === 3) {
            containsAThree = true;
            numberOfDiceRemaining -= 1;
        }
    }

    if (containsAThree) {
        return {
            score: 0,
            numberOfDiceRemaining
        };
    }

    while (resultsArr.includes(lowestDiceRoll)) {
        let index = resultsArr.indexOf(lowestDiceRoll);
        resultsArr.splice(index, 1);
    }

    return {
        score: lowestDiceRoll,
        numberOfDiceRemaining: resultsArr.length
    };
}

const playGame = (numberOfDice) => {
    let score = 0;
    let remainingDice = numberOfDice;
    
    while (remainingDice > 0) {
        const result = rollDice(remainingDice);
        score += result.score;
        remainingDice = result.numberOfDiceRemaining;
    }

    return score;
}

let iterations = parseInt(options.iterations);
let dice = parseInt(options.dice);
if (isNaN(iterations)) {
    console.error('Iterations must be an integer!');
}
if (isNaN(dice)) {
    console.error('Dice must be an integer!');
}
if (isNaN(iterations) || isNaN(dice)) {
    return;
}

console.log(`Number of simulations was ${options.iterations} using ${options.dice} dice.`);

let scores = {};

for (let i = 0; i < options.iterations; i++) {
    const gameScore = playGame(options.dice);
    scores[gameScore] = scores[gameScore] ? scores[gameScore] + 1 : 1;
}

for (const score in scores) {
    const numberOfOccurrences = scores[score];
    console.log(`Total ${score} occurs ${numberOfOccurrences / options.iterations} occurred ${numberOfOccurrences} times.`);
}

const duration = Date.now() - startTime;

console.log(`Total simulation took ${duration / 1000} seconds.`);
