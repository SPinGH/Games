import { Arkanoid as Game } from '@/Games/Arkanoid.js';
import { randomInt } from '@/utils.js';
import { IsMobile } from '@/constants';
import Parameters from './Parameters.js';

function CreateMap(width, height) {
    let map = [];
    for (let i = 0; i < height; i++) {
        map.push([]);
        for (let j = 0; j < width; j++) {
            map[i].push(randomInt(0, 3) !== 0 ? {
                strength: randomInt(1, 3),
                style: 0
            } : null)
        }
    }
    return map;
}

export default class Arkanoid {
    constructor(terminal, canvas, ctx) {
        this.terminal = terminal;
        this.canvas = canvas;
        this.ctx = ctx;

        this.game = new Game(
            this.terminal, this.canvas,
            this.OnScoreChanged,
            this.OnLifesChanged,
        );
        this.game.BeforeDraw = this.BeforeDraw;
        this.game.DrawBrick = this.DrawBrick;
        this.game.DrawBall = this.DrawBall;
        this.game.DrawCarriage = this.DrawCarriage;
        this.game.DrawBonus = this.DrawBonus;
        this.gameOffsetTop = 0;
        this.gameOffsetLeft = 0;
    }

    Start = () => {
        document.addEventListener('keydown', this.OnKeyDown);
        this.canvas.addEventListener('click', this.OnClick);
        this.game.LoadMap(CreateMap(10, 8));
        this.Resize();
        this.game.Reset();
    }

    Leave = () => {
        this.game.Stop();
        document.removeEventListener('keydown', this.OnKeyDown);
        this.canvas.removeEventListener('click', this.OnClick);
    }

    OnClick = () => {
        if (this.game.stop) {
            this.game.LoadMap(CreateMap(10, 8));
            this.game.Reset();
        }
    }

    OnKeyDown = (event) => {
        if (event.code === 'KeyR' && this.game.stop) {
            this.game.LoadMap(CreateMap(10, 8));
            this.game.Reset();
        }
    }

    OnScoreChanged = () => {
        this.ctx.font = `${Parameters.fontSize}px monospace`;
        this.ctx.fillStyle = Parameters.options.color;
        this.ctx.shadowColor = Parameters.options.color;
        this.ctx.shadowBlur = Parameters.letterHeight;
        let score = String(this.game.score).padStart(10, '0');
        if (this.gameOffsetTop === Parameters.offsetTop) {
            let scoreOffsetLeft = this.gameOffsetLeft + this.game.window.width + Parameters.letterHeight * 2;
            this.ctx.clearRect(scoreOffsetLeft - Parameters.letterHeight, Parameters.offsetTop + Parameters.letterHeight * 3,
                Parameters.letterWidth * 10 + Parameters.letterHeight * 2, Parameters.letterHeight * 4)
            this.ctx.fillText('Счёт:', scoreOffsetLeft, Parameters.offsetTop + Parameters.letterHeight * 4 + Parameters.fontSize);
            this.ctx.fillText(score, scoreOffsetLeft, Parameters.offsetTop + Parameters.letterHeight * 5 + Parameters.fontSize);
        } else {
            let scoreOffsetLeft = window.innerWidth - this.gameOffsetLeft - score.length * Parameters.letterWidth;
            this.ctx.clearRect(scoreOffsetLeft - Parameters.letterHeight, Parameters.offsetTop - Parameters.letterHeight,
                score.length * Parameters.letterWidth + Parameters.letterHeight * 2, Parameters.letterHeight * 4);
            this.ctx.fillText(score, scoreOffsetLeft, Parameters.offsetTop + Parameters.letterHeight / 2 + Parameters.fontSize);
        }
    }

    OnLifesChanged = () => {
        this.ctx.font = `${Parameters.fontSize}px monospace`;
        this.ctx.fillStyle = Parameters.options.color;
        this.ctx.shadowColor = Parameters.options.color;
        this.ctx.shadowBlur = Parameters.letterHeight;
        let figureOffsetLeft;
        let figureOffsetTop;
        if (this.gameOffsetTop === Parameters.offsetTop) {
            figureOffsetLeft = this.gameOffsetLeft + this.game.window.width + Parameters.letterHeight * 2;
            figureOffsetTop = Parameters.offsetTop + Parameters.letterHeight + Parameters.fontSize;
            this.ctx.clearRect(figureOffsetLeft - Parameters.letterHeight, Parameters.offsetTop - Parameters.letterHeight,
                Parameters.letterWidth * 10 + Parameters.letterHeight * 2, Parameters.letterHeight * 4)
            this.ctx.fillText('Жизни:', figureOffsetLeft, Parameters.offsetTop + Parameters.fontSize);
        } else {
            figureOffsetLeft = this.gameOffsetLeft;
            figureOffsetTop = Parameters.offsetTop + Parameters.fontSize;
            this.ctx.clearRect(this.gameOffsetLeft - Parameters.letterHeight, Parameters.offsetTop - Parameters.letterHeight,
                Parameters.letterWidth * 8 + Parameters.letterHeight * 2, Parameters.letterHeight * 4);
        }
        this.ctx.fillText(''.padEnd(this.game.lifes, '❤'), figureOffsetLeft, figureOffsetTop);
    }

    Resize = () => {
        let height = window.innerHeight - Parameters.offsetTop * 2;
        let width = window.innerWidth - Parameters.offsetLeft * 2;
        if (height >= width) {
            height -= Parameters.letterHeight * 3;
            this.gameOffsetLeft = (window.innerWidth - width) / 2;
            this.gameOffsetTop = Parameters.offsetTop + Parameters.letterHeight * 3;
            this.game.Resize({ width, height }, this.gameOffsetLeft, this.gameOffsetTop);
        } else {
            width -= Parameters.letterWidth * 10 + Parameters.letterHeight * 2;
            if (width > height * 4 / 3) {
                width = height * 4 / 3;
            }
            this.gameOffsetLeft = (window.innerWidth - width) / 2 - Parameters.letterWidth * 5;
            this.gameOffsetTop = Parameters.offsetTop;
            this.game.Resize({ width, height }, this.gameOffsetLeft, this.gameOffsetTop);
        }
        if (IsMobile) {
            this.ctx.font = `${Parameters.fontSize}px monospace`;
            this.ctx.fillStyle = Parameters.options.color;
            this.ctx.fillText('X', window.innerWidth - Parameters.letterWidth - 16, Parameters.fontSize + 9);
        }

        this.OnScoreChanged();
        this.OnLifesChanged();
    }

    BeforeDraw = () => {
        this.ctx.shadowColor = Parameters.options.color;
        this.ctx.shadowBlur = Parameters.letterHeight * 2 / 3;
        this.ctx.clearRect(this.gameOffsetLeft - Parameters.letterHeight, this.gameOffsetTop - Parameters.letterHeight,
            this.game.window.width + Parameters.letterHeight * 2,
            this.game.window.height + Parameters.letterHeight * 2);
        this.ctx.strokeStyle = Parameters.options.color;
        this.ctx.strokeRect(this.gameOffsetLeft, this.gameOffsetTop,
            this.game.window.width, this.game.window.height);
    }

    DrawBrick = (i, j, brick) => {
        this.ctx.strokeStyle = Parameters.options.color;
        for (let k = 0; k < brick.strength; k++) {
            this.ctx.strokeRect(this.gameOffsetLeft + j * this.game.brick.width + 4 * k,
                this.gameOffsetTop + i * this.game.brick.height + 4 * k,
                this.game.brick.width - 8 * k, this.game.brick.height - 8 * k);
        }
    }

    DrawBall = () => {
        if (!this.game.bonus.active.some(({ name }) => name === 'Through'))
            this.ctx.strokeStyle = Parameters.options.color;
        else
            this.ctx.strokeStyle = Parameters.options.color + '55';
        this.ctx.beginPath();
        this.ctx.arc(this.gameOffsetLeft + this.game.ball.x, this.gameOffsetTop + this.game.ball.y,
            this.game.ball.rad, 0, Math.PI * 2);
        this.ctx.stroke();
    }

    DrawCarriage = () => {
        this.ctx.strokeStyle = Parameters.options.color;
        this.ctx.strokeRect(this.gameOffsetLeft + this.game.carriage.x, this.gameOffsetTop + this.game.carriage.y,
            this.game.carriage.width, this.game.carriage.height);
        this.ctx.strokeRect(this.gameOffsetLeft + this.game.carriage.x + 4, this.gameOffsetTop + this.game.carriage.y + 4,
            this.game.carriage.width - 8, this.game.carriage.height - 8);
    }

    DrawBonus = (bonus) => {
        let height = this.game.brick.width;
        let flag = true;
        if (bonus.y <= 0) {
            height += bonus.y;
            flag = false;
        } else if (this.game.window.height - bonus.y < this.game.brick.width) {
            height = this.game.window.height - bonus.y;
            flag = false;
        }
        switch (bonus.name) {
            case 'Through':
                this.ctx.strokeStyle = Parameters.options.color;
                this.ctx.strokeRect(this.gameOffsetLeft + bonus.x, bonus.y < 0 ? this.gameOffsetTop : this.gameOffsetTop + bonus.y,
                    this.game.brick.width, height);
                this.ctx.strokeStyle = Parameters.options.color + '55';
                if (flag) {
                    this.ctx.beginPath();
                    this.ctx.arc(this.gameOffsetLeft + bonus.x + this.game.brick.width / 2,
                        this.gameOffsetTop + bonus.y + this.game.brick.width / 2,
                        this.game.brick.width / 4, 0, 2 * Math.PI);
                    this.ctx.stroke();
                }
                break;
            case 'BigBall':
                this.ctx.strokeStyle = Parameters.options.color;
                this.ctx.strokeRect(this.gameOffsetLeft + bonus.x, bonus.y < 0 ? this.gameOffsetTop : this.gameOffsetTop + bonus.y,
                    this.game.brick.width, height);
                if (flag) {
                    this.ctx.beginPath();
                    this.ctx.arc(this.gameOffsetLeft + bonus.x + this.game.brick.width / 2,
                        this.gameOffsetTop + bonus.y + this.game.brick.width / 2,
                        this.game.brick.width / 2.1, 0, 2 * Math.PI);
                    this.ctx.stroke();
                }
                break;
            case 'SmallBall':
                this.ctx.strokeStyle = Parameters.options.color;
                this.ctx.strokeRect(this.gameOffsetLeft + bonus.x, bonus.y < 0 ? this.gameOffsetTop : this.gameOffsetTop + bonus.y,
                    this.game.brick.width, height);
                if (flag) {
                    this.ctx.beginPath();
                    this.ctx.arc(this.gameOffsetLeft + bonus.x + this.game.brick.width / 2,
                        this.gameOffsetTop + bonus.y + this.game.brick.width / 2,
                        this.game.brick.width / 8, 0, 2 * Math.PI);
                    this.ctx.stroke();
                }
                break;
            case 'BigCarriage':
                this.ctx.strokeStyle = Parameters.options.color;
                this.ctx.strokeRect(this.gameOffsetLeft + bonus.x, bonus.y < 0 ? this.gameOffsetTop : this.gameOffsetTop + bonus.y,
                    this.game.brick.width, height);
                if (flag) {
                    this.ctx.strokeRect(this.gameOffsetLeft + bonus.x + this.game.brick.width / 8,
                        this.gameOffsetTop + bonus.y + this.game.brick.width * 2 / 5,
                        this.game.brick.width * 6 / 8, this.game.brick.width / 5);
                }
                break;
            case 'SmallCarriage':
                this.ctx.strokeStyle = Parameters.options.color;
                this.ctx.strokeRect(this.gameOffsetLeft + bonus.x, bonus.y < 0 ? this.gameOffsetTop : this.gameOffsetTop + bonus.y,
                    this.game.brick.width, height);
                if (flag) {
                    this.ctx.strokeRect(this.gameOffsetLeft + bonus.x + this.game.brick.width / 3,
                        this.gameOffsetTop + bonus.y + this.game.brick.width * 2 / 5,
                        this.game.brick.width / 3, this.game.brick.width / 5);
                }
                break;
            case 'Death':
                this.ctx.strokeStyle = Parameters.options.color;
                this.ctx.strokeRect(this.gameOffsetLeft + bonus.x, bonus.y < 0 ? this.gameOffsetTop : this.gameOffsetTop + bonus.y,
                    this.game.brick.width, height);
                if (flag) {
                    this.ctx.font = `${this.game.brick.width / 1.15}px monospace`;
                    this.ctx.fillStyle = Parameters.options.color;
                    this.ctx.fillText('☠', this.gameOffsetLeft + bonus.x + this.game.brick.width / 12,
                        this.gameOffsetTop + bonus.y + this.game.brick.width / 1.35 + 2);
                }
                break;
            default:
                this.ctx.strokeStyle = Parameters.options.color;
                this.ctx.strokeRect(this.gameOffsetLeft + bonus.x, bonus.y < 0 ? this.gameOffsetTop : this.gameOffsetTop + bonus.y,
                    this.game.brick.width, height);
                break;
        }
    }
}