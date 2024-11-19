const crypto = require("crypto");
const readline = require("readline");

function validateDiceConfig(diceConfig) {
  const dice = diceConfig.split(",").map(Number);
  if (dice.length !== 6) {
    throw new Error("Each dice set must contain exactly 6 numbers.");
  }
  if (dice.some((value) => value <= 0 || !Number.isInteger(value))) {
    throw new Error("All numbers in the dice set must be positive integers.");
  }
  return dice;
}
function generateHMAC(key, message) {
  const hmac = crypto.createHmac("sha256", key);
  hmac.update(message.toString());
  return hmac.digest("hex");
}

function rollDice(dice, key) {
  const randomValue = Math.floor(Math.random() * 6);
  const hmacValue = generateHMAC(key, randomValue);
  console.log(`HMAC: ${hmacValue}`);
  return dice[randomValue];
}
function calculateProbabilities(dice) {
  const probabilities = {};
  dice.forEach((value) => {
    probabilities[value] = (probabilities[value] || 0) + 1;
  });
  Object.keys(probabilities).forEach((key) => {
    probabilities[key] = (probabilities[key] / dice.length).toFixed(2);
  });
  return probabilities;
}
function playGame(diceConfigurations) {
  const secretKey = crypto.randomBytes(32);
  const computerChoice = Math.floor(Math.random() * diceConfigurations.length);
  console.log(`Computer's choice (0 to ${diceConfigurations.length - 1}): ${computerChoice}`);

  console.log("\nDice sets and their probabilities:");
  diceConfigurations.forEach((dice, idx) => {
    console.log(`Set ${idx}: ${dice}`);
    console.log("Probabilities:", calculateProbabilities(dice));
  });

  const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout,
  });

  rl.question("\nEnter your choice (select a number): ", (userChoice) => {
    userChoice = parseInt(userChoice);

    if (userChoice < 0 || userChoice >= diceConfigurations.length) {
      console.log("Invalid choice. Exiting...");
      rl.close();
      process.exit(1);
    }

    const userDice = diceConfigurations[userChoice];
    const computerDice = diceConfigurations[computerChoice];

    console.log(`\nYour chosen set: ${userDice}`);
    console.log(`Computer's chosen set: ${computerDice}`);

    const userRoll = rollDice(userDice, secretKey);
    console.log(`Your roll: ${userRoll}`);

    const computerRoll = rollDice(computerDice, secretKey);
    console.log(`Computer's roll: ${computerRoll}`);

    if (userRoll > computerRoll) {
      console.log("\nYOU WIN!");
    } else if (userRoll < computerRoll) {
      console.log("\nYOU LOSE!");
    } else {
      console.log("\nIt's a DRAW!");
    }

    rl.close();
  });
}

function main() {
  const diceConfigurations = process.argv.slice(2);
  if (diceConfigurations.length < 3) {
    console.log("Error: Please provide at least three dice configurations.");
    process.exit(1);
  }
  try {
    const validatedDiceConfigs = diceConfigurations.map((config) =>
      validateDiceConfig(config)
    );
    playGame(validatedDiceConfigs);
  } catch (error) {
    console.log("Error:", error.message);
    process.exit(1);
  }
}
function validateDiceConfig(diceConfig) {
  const dice = diceConfig.split(",").map(Number);

  if (dice.length !== 6) {
    throw new Error("Each dice set must contain exactly 6 numbers.");
  }

  if (dice.some(value => value <= 0 || !Number.isInteger(value))) {
    throw new Error("All numbers in the dice set must be positive integers.");
  }

  return dice;
}

main();
