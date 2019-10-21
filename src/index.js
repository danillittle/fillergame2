import './style.scss';

const generateGridMatrix = () => {
  const grid = [];

  for (let x = 0; x < 20; x += 1) {
    grid.push([]);
    for (let y = 0; y < 20; y += 1) {
      const color = Math.floor(Math.random() * 7);
      grid[x].push(color);
    }
  }

  return grid;
};

const generateOwnMatrix = () => {
  const own = Array(20).fill().map(() => Array(20).fill(0)); // заполнение матрицы значением 0

  own[19][0] = 1; // User
  own[0][19] = 2; // AI

  return own;
};

// делаем уникальными стартовые позиции
const makeUniqueStart = (grid) => {
  const newGrid = grid;

  // User
  newGrid[0][18] = (newGrid[0][19] + 1) % 8;
  newGrid[1][19] = (newGrid[0][19] + 2) % 8;

  // AI
  newGrid[18][0] = (newGrid[19][0] + 1) % 8;
  newGrid[19][1] = (newGrid[19][0] + 2) % 8;

  return newGrid;
};

class Game {
  constructor() {
    this.canvas = document.getElementById('game');
    this.ctx = this.canvas.getContext('2d');
    this.grid = [];
    this.colors = ['#FF5722', '#E91E63', '#9C27B0', '#3F51B5', '#607D8B', '#009688', '#FFEB3B', '#795548'];
    this.Own = [];
  }

  start() {
    this.canvas.width = 800;
    this.canvas.height = 800;

    this.grid = generateGridMatrix();
    this.Own = generateOwnMatrix();
    makeUniqueStart(this.grid);
    this.draw();

    document.addEventListener('click', (e) => {
      const rect = this.canvas.getBoundingClientRect();
      const coord = {
        x: Math.floor((e.clientX - rect.left) / 40),
        y: Math.floor((e.clientY - rect.top) / 40),
      };
      console.log(this.grid[coord.x][coord.y]);
    });
  }

  draw() {
    for (let x = 0; x < 20; x += 1) {
      for (let y = 0; y < 20; y += 1) {
        const color = this.grid[x][y];
        this.ctx.fillStyle = this.colors[color];
        this.ctx.fillRect(40 * x, 40 * y, 40, 40);
      }
    }
  }
}

const game = new Game();

game.start();
