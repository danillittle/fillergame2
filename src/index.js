import './style.scss';

// заполнение матрицы значениями цветов
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
    const own = Array(20)
        .fill()
        .map(() => Array(20).fill(0)); // заполнение матрицы значением 0

    own[19][0] = 1; // User
    own[0][19] = 2; // AI

    return own;
};

// Нахождение количества доступных для захвата ячеек для каждого цвета
const easyFind = (x, y, temp, colors, grid, aiColor, userColor) => {
    // если не выходит за рамки массива
    if (x >= 0 && x < 20 && y >= 0 && y < 20) {
        // если точка ещё не пройдена
        if (temp[x][y] !== 1) {
            temp[x][y] = 1;
            // если точка не принадлежит ни компу, ни игроку
            if (grid[x][y] !== aiColor) {
                if (grid[x][y] !== userColor) {
                    colors[grid[x][y]] += 1;
                }
                return;
            } else {
                easyFind(x - 1, y, temp, colors, grid, aiColor, userColor);
                easyFind(x + 1, y, temp, colors, grid, aiColor, userColor);
                easyFind(x, y - 1, temp, colors, grid, aiColor, userColor);
                easyFind(x, y + 1, temp, colors, grid, aiColor, userColor);
            }
        }
    }
};

// делаем уникальными стартовые позиции
const makeUniqueStart = grid => {
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
        this.score = {
            user: 0,
            ai: 0,
        };
        this.grid = [];
        this.colors = ['#FF5722','#E91E63', '#9C27B0', '#3F51B5', '#607D8B', '#009688', '#FFEB3B', '#795548'];
        this.Own = [];
        this.userColor;
        this.aiColor;
    }

    start() {
        this.canvas.width = 800;
        this.canvas.height = 800;

        this.score.user = 0;
        this.score.ai = 0;

        this.grid = generateGridMatrix();
        this.Own = generateOwnMatrix();
        makeUniqueStart(this.grid);
        this.userColor = this.grid[19][0];
        this.aiColor = this.grid[0][19];
        this.draw();

        document.addEventListener('click', event => this.handlerClick(event));
    }

    draw() {
        for (let x = 0; x < 20; x += 1) {
            for (let y = 0; y < 20; y += 1) {
                const color = this.grid[x][y];
                this.ctx.fillStyle = this.colors[color];
                this.ctx.fillRect(40 * y, 40 * x, 40, 40);
            }
        }

        document.getElementById('user-score').innerHTML = this.score.user;
        document.getElementById('ai-score').innerHTML = this.score.ai;
        document.getElementById('user-color').style.backgroundColor = this.colors[this.userColor];
        document.getElementById('ai-color').style.backgroundColor = this.colors[this.aiColor];
    }

    handlerClick(event) {
        const rect = this.canvas.getBoundingClientRect();
        const coord = {
            x: Math.floor((event.clientX - rect.left) / 40),
            y: Math.floor((event.clientY - rect.top) / 40),
        };
        // если не выходит за рамки массива
        if (coord.x >= 0 && coord.x < 20 && coord.y >= 0 && coord.y < 20) {
            const chooseColor = this.grid[coord.y][coord.x];
            if (chooseColor !== this.aiColor) {
                this.userColor = chooseColor;
                this.grab(19, 0, chooseColor, 1);
                this.aiGrab();
            }
        }

        // Если захватили больше половины поля
        if (this.score.user > (20 * 20 / 2)) {
            alert('You win!\nYour score = ' + this.score.user);
            game.start(this, null);
        }

        // Если компьютер захватил больше половины поля
        if (this.score.ai > (20 * 20 / 2)) {
            alert('You lose!\nYour score = ' + this.score.user);
            game.start(this, null);
        }

        // Если по равным
        if (this.score.ai == (20 * 20 / 2) && this.score.user == (20 * 20 / 2)) {
            alert('Draw!');
            game.start(this, null);
        }
    }

    grab(x, y, color, owner) {
        // если не выходит за рамки массива
        if (x >= 0 && x < 20 && y >= 0 && y < 20) {
            // если точка уже придалежит нам но цвет не совпадает
            if (color !== this.grid[x][y] && this.Own[x][y] === owner) {
                this.grid[x][y] = color;

                this.grab(x - 1, y, color, owner);
                this.grab(x + 1, y, color, owner);
                this.grab(x, y - 1, color, owner);
                this.grab(x, y + 1, color, owner);

                this.draw();
            }

            // если цвет совпадает но не принадлежит нам
            if (this.grid[x][y] === color && this.Own[x][y] === 0) {
                this.Own[x][y] = owner; // присваиваем себе

                if (owner === 1) {
                    this.score.user += 1;
                } else {
                    this.score.ai += 1;
                }

                this.grab(x - 1, y, color, owner);
                this.grab(x + 1, y, color, owner);
                this.grab(x, y - 1, color, owner);
                this.grab(x, y + 1, color, owner);
            }
        }
    }

    // Ход компьютера
    aiGrab() {
        // Временная матрица для отметок о пройденности
        const temp = Array(20).fill().map(() => Array(20).fill(0));
        const colors = Array(8).fill(0);

        easyFind(0, 19, temp, colors, this.grid, this.aiColor, this.userColor);
        
        console.clear();
        colors.map((color, index) => {
            console.log(`%c____${colors[index]}____`, `background: ${this.colors[index]}; color: #fff;`);
        });
        
        let max = this.aiColor;
        max = colors.indexOf(Math.max(...colors));
        this.aiColor = max;
        this.grab(0, 19, this.aiColor, 2);
    }

    
}

const game = new Game();

game.start();
