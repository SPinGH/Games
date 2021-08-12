import { randomInt } from '@/utils.js';
import { IsMobile } from "@/constants";

export class Tetris {

    constructor(element, canvas, onFigureChanged, onScoreChanged, width = 20, height = 20) {
        this.onFigureChanged = onFigureChanged;
        this.onScoreChanged = onScoreChanged;
        this.ctx = canvas.getContext('2d');

        this.window = {
            width: width,
            height: height
        };
        this.tile = canvas.height / this.window.height;
        this.stop = true;
        this.score = 0;
        this.grid = [];
        this.figures = [[[-1, 0], [-2, 0], [0, 0], [1, 0]],
        [[0, -1], [-1, -1], [-1, 0], [0, 0]],
        [[-1, 0], [-1, 1], [0, 0], [0, -1]],
        [[0, 0], [-1, 0], [0, 1], [-1, -1]],
        [[0, 0], [0, -1], [0, 1], [-1, -1]],
        [[0, 0], [0, -1], [0, 1], [1, -1]],
        [[0, 0], [0, -1], [0, 1], [-1, 0]]];

        this.figureIndex = 1;
        this.figure = this.figures[this.figureIndex];
        this.figureCoord = { x: Math.floor(this.window.width / 2), y: 1 };
        this.projection = { x: Math.floor(this.window.width / 2), y: 1 };
        this.nextFigure = 0;
        this.fall = 60;
        this.speed = 1;
        this.touchPosX;
        this.touchPosY;
        this.figurePosX;
        if (IsMobile) {
            element.addEventListener('touchstart', this.OnTouchStart);
            element.addEventListener('touchmove', this.OnTouchMove);
        }
        canvas.addEventListener('click', this.OnClick);
    }

    OnClick = (event) => {
        if (this.stop) { return; }
        event.preventDefault();
        let newValue = this.Rotate();
        if (this.Check(this.figureCoord.x, this.figureCoord.y, newValue)) {
            this.figure = newValue;
            this.CalcProjection();
        }
    }

    OnTouchStart = (event) => {
        this.touchPosX = event.touches[0].screenX;
        this.touchPosY = event.touches[0].screenY;
        this.figurePosX = this.figureCoord.x;
    }

    OnTouchMove = (event) => {
        event.preventDefault();
        if (this.stop) { return; }
        if (Math.abs(event.touches[0].screenX - this.touchPosX) > Math.abs(event.touches[0].screenY - this.touchPosY)) {
            let delta = Math.floor((event.touches[0].screenX - this.touchPosX) / (window.innerWidth / this.window.width * 1.5))
            if (this.Check(this.figurePosX + delta, this.figureCoord.y, this.figure)) {
                this.figureCoord.x = this.figurePosX + delta;
                this.CalcProjection();
            }
        } else if (Math.abs(event.touches[0].screenY - this.touchPosY) > 90) {
            this.figureCoord = this.projection;
            let newValue = this.figureCoord.y + 1;
            if (this.Check(this.figureCoord.x, newValue, this.figure, true)) {
                this.figureCoord.y = newValue;
                this.CalcProjection();
            }
            this.touchPosY = event.touches[0].screenY;
        }
    }

    OnKeyDown = (event) => {
        if (this.stop) { return; }
        let newValue;
        switch (event.code) {
            case 'ArrowLeft':
                event.preventDefault();
                newValue = this.figureCoord.x - 1;
                if (this.Check(newValue, this.figureCoord.y, this.figure)) {
                    this.figureCoord.x = newValue;
                    this.CalcProjection();
                }
                break;
            case 'ArrowRight':
                event.preventDefault();
                newValue = this.figureCoord.x + 1;
                if (this.Check(newValue, this.figureCoord.y, this.figure)) {
                    this.figureCoord.x = newValue;
                    this.CalcProjection();
                }
                break;
            case 'ArrowDown':
                event.preventDefault();
                newValue = this.figureCoord.y + 1;
                if (this.Check(this.figureCoord.x, newValue, this.figure, true)) {
                    this.figureCoord.y = newValue;
                    this.CalcProjection();
                }
                break;
            case 'KeyR':
                event.preventDefault();
                newValue = this.Rotate();
                if (this.Check(this.figureCoord.x, this.figureCoord.y, newValue)) {
                    this.figure = newValue;
                    this.CalcProjection();
                }
                break;
            case 'Space':
                event.preventDefault();
                this.figureCoord = this.projection;
                newValue = this.figureCoord.y + 1;
                if (this.Check(this.figureCoord.x, newValue, this.figure, true)) {
                    this.figureCoord.y = newValue;
                    this.CalcProjection();
                }
                break;
            default: break;
        }
    }

    Reset() {
        this.score = 0;
        this.figureCoord = { x: Math.floor(this.window.width / 2), y: 1 };
        this.projection = { x: Math.floor(this.window.width / 2), y: 1 };
        this.nextFigure = randomInt(0, 6);
        this.figureIndex = randomInt(0, 6);
        this.figure = this.figures[this.figureIndex];
        this.onFigureChanged();
        this.onScoreChanged();

        this.grid = [];
        for (let i = 0; i < this.window.height; i++) {
            this.grid.push(Array(this.window.width).fill(null));
        }

        this.CalcProjection();

        if (this.stop) {
            if (!IsMobile) { document.addEventListener('keydown', this.OnKeyDown); }
            this.stop = false;
            this.Draw();
        }
    }

    Stop() {
        this.stop = true;
        if (!IsMobile) { document.removeEventListener('keydown', this.OnKeyDown); }
    }

    Rotate() {
        if (this.figureIndex === 1) {
            return this.figure;
        }
        let newFigure = [],
            center = this.figure[0];
        for (let i = 0; i < this.figure.length; i++) {
            let x = this.figure[i][1] - center[1],
                y = this.figure[i][0] - center[0];
            newFigure.push([center[0] - x, center[1] + y]);
        }
        return newFigure;
    }

    Freeze() {
        for (let i = 0; i < this.figure.length; i++) {
            let X = this.figureCoord.x + this.figure[i][0],
                Y = this.figureCoord.y + this.figure[i][1];
            this.grid[Y][X] = this.figureIndex;
        }

        this.figureCoord = { x: Math.floor(this.window.width / 2), y: 1 };
        this.figureIndex = this.nextFigure;
        this.nextFigure = randomInt(0, 6);
        this.figure = this.figures[this.figureIndex];
        this.CalcProjection();
        this.onFigureChanged();

        if (!this.Check(this.figureCoord.x, this.figureCoord.y, this.figure)) {
            if (!IsMobile) { document.removeEventListener('keydown', this.OnKeyDown); }
            this.stop = true;
        }

        let lines = 0;
        for (let i = 0; i < this.window.height; i++) {
            if (!this.grid[i].some(tile => tile === null)) {
                lines++;
                this.speed += 0.1;
                for (let j = i; j > 1; j--) {
                    this.grid[j] = [...this.grid[j - 1]];
                }
            }
        }

        if (lines !== 0) {
            this.score += 10 * lines * lines;
            this.onScoreChanged();
        }
    }

    CalcProjection() {
        for (let i = this.figureCoord.y; i <= this.window.height; i++) {
            if (!this.Check(this.figureCoord.x, i, this.figure)) {
                this.projection.x = this.figureCoord.x;
                this.projection.y = i - 1;
                return;
            }
        }
    }

    Check(x, y, figure, freeze) {
        for (let i = 0; i < figure.length; i++) {
            let X = x + figure[i][0],
                Y = y + figure[i][1];
            if (X < 0 || X > this.window.width - 1) {
                return false;
            }
            if (Y >= this.window.height || this.grid[Y][X] !== null) {
                if (freeze) {
                    this.Freeze();
                }
                return false;
            }
        }
        return true;
    }

    DrawTile(i, j, style) {
        if (style === -1) {
            this.ctx.fillStyle = "#ddd";
        } else {
            this.ctx.fillStyle = "#000";
        }
        this.ctx.fillRect(j * this.tile, i * this.tile, this.tile, this.tile);
    }

    Draw = () => {
        this.ctx.clearRect(0, 0, this.window.width * this.tile, this.window.height * this.tile);

        for (let i = 0; i < this.figure.length; i++) {
            this.DrawTile(this.projection.y + this.figure[i][1], this.projection.x + this.figure[i][0], -1);
        }


        for (let i = 0; i < this.figure.length; i++) {
            this.DrawTile(this.figureCoord.y + this.figure[i][1], this.figureCoord.x + this.figure[i][0], this.figureIndex);
        }

        for (let i = 0; i < this.grid.length; i++) {
            for (let j = 0; j < this.grid[i].length; j++) {
                if (this.grid[i][j] !== null) {
                    this.DrawTile(i, j, this.grid[i][j]);
                }
            }
        }

        if (!this.stop) {
            requestAnimationFrame(this.Draw);
        }

        this.fall -= this.speed;
        if (this.fall <= 0) {
            this.fall = 60;

            let newY = this.figureCoord.y + 1;
            if (this.Check(this.figureCoord.x, newY, this.figure, true)) {
                this.figureCoord.y = newY;
                this.CalcProjection();
            }
        }
    }
}