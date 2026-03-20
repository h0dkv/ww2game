const size = 8;
const game = document.getElementById('game');
const statusText = document.getElementById('status');

let playerPos = 0;
let enemyPositions = [10, 20, 30];

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

function movePlayer(index) {
  const diff = Math.abs(index - playerPos);

  if (diff === 1 || diff === size) {
    playerPos = index;

    if (enemyPositions.includes(index)) {
      enemyPositions = enemyPositions.filter(e => e !== index);
      statusText.textContent = '💥 Враг унищожен!';
    } else {
      statusText.textContent = '➡️ Премести се';
    }

    enemyTurn();
    draw();
    checkWin();
  }
}

function enemyTurn() {
  enemyPositions = enemyPositions.map(pos => {
    const direction = Math.random() < 0.5 ? -1 : 1;
    let newPos = pos + direction;

    if (newPos < 0 || newPos >= size * size) return pos;

    if (newPos === playerPos) {
      statusText.textContent = '☠️ Загуби!';
      setTimeout(() => {
        alert('Game Over');
        resetGame();
      }, 200);
      return pos;
    }

    return newPos;
  });
}

function checkWin() {
  if (enemyPositions.length === 0) {
    statusText.textContent = '🏆 Победа!';
    setTimeout(() => {
      alert('Ти спечели!');
      resetGame();
    }, 200);
  }
}

function resetGame() {
  playerPos = 0;
  enemyPositions = [10, 20, 30];
  statusText.textContent = 'Твой ред';
  draw();
}

draw();