const readline = require("node:readline");

let isXTurn = true;
const board = ["1", "2", "3", "4", "5", "6", "7", "8", "9"];
const r1 = readline.createInterface({
  input: process.stdin,
  output: process.stdout,
});

start();

async function start() {
  while (true) {
    drawboard();
    const player = isXTurn ? "X" : "O";
    let input;
    const val = await new Promise((resolve) =>
      r1.question(
        `Is's ${player}'s turn.\nSelect a position or type 'q' to quit.\n`,
        resolve
      )
    );

    if (val == "q") process.exit();

    if (isNaN(val) || Number(val) < 1 || Number(val) > 9) {
      console.warn("Please enter a value between 1 and 9.");
      continue;
    } else {
      input = Number(val) - 1;
    }

    if (board[input] === "X" || board[input] === "Y") continue;
    board[input] = player;

    if (isWinner(input)) {
      drawboard();
      console.log(`${player} has won!`);
      const val = await new Promise((resolve) =>
        r1.question(
          "Type 'q' to quit.\nType any other key to play again.\n",
          resolve
        )
      );

      if (val == "q") process.exit();
      for (let i in board) board[i] = Number(i) + 1;
      continue;
    }

    isXTurn = !isXTurn;
  }
}

function isWinner(current, vec = [0, 0], count = 1) {
  const x = current % 3;
  const y = Math.floor(current / 3);
  const boardIndex = (y + vec[1]) * 3 + (x + vec[0]);
  if (boardIndex < 0 || boardIndex > 8) return false;
  if (boardIndex == current) {
    // try left up
    if (isWinner(current, [-1, -1], count)) return true;
    // try up
    if (isWinner(current, [0, -1], count)) return true;
    // try right up
    if (isWinner(current, [1, -1], count)) return true;
    // try left
    if (isWinner(current, [-1, 0], count)) return true;
    // try right
    if (isWinner(current, [1, 0], count)) return true;
    // try left down
    if (isWinner(current, [-1, 1], count)) return true;
    // try down
    if (isWinner(current, [0, 1], count)) return true;
    // try right down
    if (isWinner(current, [1, 1], count)) return true;
  } else {
    if (board[boardIndex] === board[current]) {
      const newCount = count + 1;
      if (newCount === 3) return true;
      return isWinner(boardIndex, vec, newCount);
    }
  }

  return false;
}

function drawboard() {
  console.clear();
  console.log("\n-------------");

  for (let i in board) {
    if (i > 0 && i % 3 == 0) {
      console.log(" |\n|-----------|");
    }
    const n = board[i];
    if (i % 3 != 0) process.stdout.write(" |");
    else process.stdout.write("|");
    process.stdout.write(` ${n}`);
  }

  console.log(" |\n-------------\n");
}
