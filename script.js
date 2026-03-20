const size = 8;
const game = document.getElementById('game');
const statusText = document.getElementById('status');

let playerPos = 0;
let enemyPositions = [10, 20, 30];
let gameOver = false;

function draw() {
  game.innerHTML = '';

  for (let i = 0; i < size * size; i++) {
    const tile = document.createElement('div');
    tile.classList.add('tile');

    if (i === playerPos) {
      tile.classList.add('player');
      tile.textContent = '🪖';
    } else if (enemyPositions.includes(i)) {
      tile.classList.add('enemy');
      tile.textContent = '💀';
    }

    tile.addEventListener('click', () => movePlayer(i));
    game.appendChild(tile);
  }
}

function isAdjacent(a, b) {
  const rowA = Math.floor(a / size);
  const rowB = Math.floor(b / size);
  const colA = a % size;
  const colB = b % size;

  // Same row, adjacent column
  if (rowA === rowB && Math.abs(colA - colB) === 1) return true;
  // Same column, adjacent row
  if (colA === colB && Math.abs(rowA - rowB) === 1) return true;

  return false;
}

function movePlayer(index) {
  if (gameOver) return;
  if (!isAdjacent(playerPos, index)) return;

  playerPos = index;

  if (enemyPositions.includes(index)) {
    enemyPositions = enemyPositions.filter(e => e !== index);
    statusText.textContent = '💥 Враг унищожен!';
  } else {
    statusText.textContent = '➡️ Премести се';
  }

  if (checkWin()) return;

  enemyTurn();
  draw();
}

function enemyTurn() {
  const directions = [-size, size, -1, 1];

  enemyPositions = enemyPositions.map(pos => {
    const shuffled = directions.sort(() => Math.random() - 0.5);

    for (const dir of shuffled) {
      const newPos = pos + dir;

      // Out of bounds
      if (newPos < 0 || newPos >= size * size) continue;

      // Prevent wrapping horizontally
      const oldRow = Math.floor(pos / size);
      const newRow = Math.floor(newPos / size);
      if (Math.abs(dir) === 1 && oldRow !== newRow) continue;

      // Don't move onto another enemy
      if (enemyPositions.includes(newPos)) continue;

      // Hit player
      if (newPos === playerPos) {
        gameOver = true;
        statusText.textContent = '☠️ Загуби!';
        setTimeout(() => {
          alert('Game Over');
          resetGame();
        }, 200);
        return pos;
      }

      return newPos;
    }

    return pos; // couldn't move
  });
}

function checkWin() {
  if (enemyPositions.length === 0) {
    statusText.textContent = '🏆 Победа!';
    gameOver = true;
    draw();
    setTimeout(() => {
      alert('Ти спечели!');
      resetGame();
    }, 200);
    return true;
  }
  return false;
}

function resetGame() {
  playerPos = 0;
  enemyPositions = [10, 20, 30];
  gameOver = false;
  statusText.textContent = 'Твой ред';
  draw();
}

draw();