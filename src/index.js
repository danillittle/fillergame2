import './style.scss';

class Game {
  constructor() {
    this.canvas = document.getElementById('game');
    this.ctx = this.canvas.getContext('2d');
    this.grid = [];
    this.colors = ['#FF5722', '#E91E63', '#9C27B0', '#3F51B5', '#3F51B5', '#009688', '#FFEB3B', '#795548'];
  }

  start() {
    this.canvas.width = 800;
    this.canvas.height = 800;

    for (let row = 0; row < 20; row += 1) {
      this.grid.push([]);
      for (let col = 0; col < 20; col += 1) {
        const color = Math.floor(Math.random() * this.colors.length);
        this.grid[row].push(color);

        this.ctx.fillStyle = this.colors[color];
        this.ctx.fillRect(40 * row, 40 * col, 40, 40);
      }
    }

    document.addEventListener('click', (e) => {
      const rect = this.canvas.getBoundingClientRect();
      const coord = {
        x: Math.floor((e.clientX - rect.left) / 40),
        y: Math.floor((e.clientY - rect.top) / 40),
      };
      console.log(this.grid[coord.x][coord.y]);
    });
  }
}

const game = new Game();

game.start();
