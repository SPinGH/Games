import { Tetris as Game } from '@/Games/Tetris.js';
import { IsMobile } from '@/constants';
import Parameters from './Parameters.js';

export default class Tetris {
    constructor(terminal, canvas, ctx) {
        this.terminal = terminal;
        this.canvas = canvas;
        this.ctx = ctx;

        this.game = new Game(
            this.terminal, this.canvas,
            this.OnFigureChanged,
            this.OnScoreChanged,
            10, 20
        );
        this.game.DrawTile = this.DrawTile;
        this.game.BeforeDraw = this.BeforeDraw;
        this.gameOffsetTop = 0;
        this.gameOffsetLeft = 0;
    }

    Start = () => {
        document.addEventListener('keydown', this.OnKeyDown);
        this.canvas.addEventListener('click', this.OnClick);
        this.Resize();
        this.game.Reset();
    }

    Leave = () => {
        this.game.Stop();
        document.removeEventListener('keydown', this.OnKeyDown);
        this.canvas.removeEventListener('click', this.OnClick);
    }

    OnKeyDown = (event) => {
        if (event.code === 'KeyR' && this.game.stop) { this.game.Reset(); }
    }

    OnClick = () => {
        if (this.game.stop) { this.game.Reset(); }
    }

    Resize = () => {
        if (Parameters.offsetLeft + Parameters.rowCount * Parameters.letterHeight / 2 +
            Parameters.letterHeight * 2 + Parameters.letterWidth * 10 + Parameters.offsetLeft > window.innerWidth) {
            this.game.tile = (Parameters.rowCount - 4) * Parameters.letterHeight / 20;
            this.gameOffsetTop = Parameters.offsetTop + Parameters.letterHeight * 4;
            this.gameOffsetLeft = window.innerWidth / 2 - this.game.tile * 5;

        } else {
            this.game.tile = Parameters.rowCount * Parameters.letterHeight / 20;
            this.gameOffsetTop = Parameters.offsetTop;
            this.gameOffsetLeft = window.innerWidth / 2 - this.game.tile * 5 - Parameters.letterWidth * 5;
        }
        if (IsMobile) {
            this.ctx.font = `${Parameters.fontSize}px monospace`;
            this.ctx.fillStyle = Parameters.options.color;
            this.ctx.fillText('X', window.innerWidth - Parameters.letterWidth - 16, Parameters.fontSize + 9);
        }
        this.OnFigureChanged();
        this.OnScoreChanged();
    }

    OnFigureChanged = () => {
        this.ctx.font = `${Parameters.fontSize}px monospace`;
        this.ctx.fillStyle = Parameters.options.color;
        this.ctx.shadowColor = Parameters.options.color;
        this.ctx.shadowBlur = Parameters.letterHeight;

        let figureOffsetLeft;
        let figureOffsetTop;

        if (this.gameOffsetTop === Parameters.offsetTop) {
            figureOffsetLeft = this.gameOffsetLeft + this.game.tile * 10 + Parameters.letterHeight * 2;
            figureOffsetTop = Parameters.offsetTop + Parameters.letterHeight + Parameters.fontSize;
            this.ctx.clearRect(figureOffsetLeft - Parameters.letterHeight, Parameters.offsetTop - Parameters.letterHeight,
                Parameters.letterWidth * 10 + Parameters.letterHeight * 2, Parameters.letterHeight * 5)
            this.ctx.fillText('Следующие:', figureOffsetLeft, Parameters.offsetTop + Parameters.fontSize);

        } else {
            figureOffsetLeft = this.gameOffsetLeft;
            figureOffsetTop = Parameters.offsetTop + Parameters.fontSize;
            this.ctx.clearRect(this.gameOffsetLeft - Parameters.letterHeight, Parameters.offsetTop - Parameters.letterHeight,
                Parameters.letterWidth * 8 + Parameters.letterHeight * 2, Parameters.letterHeight * 4);
        }

        switch (this.game.nextFigure) {
            case 0:
                this.ctx.fillText('[][][][]', figureOffsetLeft, figureOffsetTop + Parameters.letterHeight / 2);
                break;
            case 1:
                this.ctx.fillText('  [][]', figureOffsetLeft, figureOffsetTop);
                this.ctx.fillText('  [][]', figureOffsetLeft, figureOffsetTop + Parameters.letterHeight);
                break;
            case 2:
                this.ctx.fillText('   [][]', figureOffsetLeft, figureOffsetTop);
                this.ctx.fillText(' [][]', figureOffsetLeft, figureOffsetTop + Parameters.letterHeight);
                break;
            case 3:
                this.ctx.fillText(' [][]', figureOffsetLeft, figureOffsetTop);
                this.ctx.fillText('   [][]', figureOffsetLeft, figureOffsetTop + Parameters.letterHeight);
                break;
            case 4:
                this.ctx.fillText(' []', figureOffsetLeft, figureOffsetTop);
                this.ctx.fillText(' [][][]', figureOffsetLeft, figureOffsetTop + Parameters.letterHeight);
                break;
            case 5:
                this.ctx.fillText(' [][][]', figureOffsetLeft, figureOffsetTop);
                this.ctx.fillText(' []', figureOffsetLeft, figureOffsetTop + Parameters.letterHeight);
                break;
            case 6:
                this.ctx.fillText('   []', figureOffsetLeft, figureOffsetTop);
                this.ctx.fillText(' [][][]', figureOffsetLeft, figureOffsetTop + Parameters.letterHeight);
                break;
            default: break;
        }
    }

    OnScoreChanged = () => {
        this.ctx.font = `${Parameters.fontSize}px monospace`;
        this.ctx.fillStyle = Parameters.options.color;
        this.ctx.shadowColor = Parameters.options.color;
        this.ctx.shadowBlur = Parameters.letterHeight;

        let score = String(this.game.score).padStart(10, '0');

        if (this.gameOffsetTop === Parameters.offsetTop) {
            let scoreOffsetLeft = this.gameOffsetLeft + this.game.tile * 10 + Parameters.letterHeight * 2;
            this.ctx.clearRect(scoreOffsetLeft - Parameters.letterHeight, Parameters.offsetTop + Parameters.letterHeight * 4,
                Parameters.letterWidth * 10 + Parameters.letterHeight * 2, Parameters.letterHeight * 4)
            this.ctx.fillText('Счёт:', scoreOffsetLeft, Parameters.offsetTop + Parameters.letterHeight * 5 + Parameters.fontSize);
            this.ctx.fillText(score, scoreOffsetLeft, Parameters.offsetTop + Parameters.letterHeight * 6 + Parameters.fontSize);

        } else {
            let scoreOffsetLeft = window.innerWidth - this.gameOffsetLeft - score.length * Parameters.letterWidth
            this.ctx.clearRect(scoreOffsetLeft - Parameters.letterHeight, Parameters.offsetTop - Parameters.letterHeight,
                score.length * Parameters.letterWidth + Parameters.letterHeight * 2, Parameters.letterHeight * 4);
            this.ctx.fillText(score, scoreOffsetLeft, Parameters.offsetTop + Parameters.letterHeight / 2 + Parameters.fontSize);
        }
    }

    BeforeDraw = () => {
        this.ctx.shadowColor = Parameters.options.color;
        this.ctx.shadowBlur = Parameters.letterHeight * 2 / 3;
        this.ctx.strokeStyle = Parameters.options.color;

        this.ctx.clearRect(this.gameOffsetLeft - Parameters.letterHeight, this.gameOffsetTop - Parameters.letterHeight,
            this.game.window.width * this.game.tile + Parameters.letterHeight * 2,
            this.game.window.height * this.game.tile + Parameters.letterHeight * 2);
        this.ctx.strokeRect(this.gameOffsetLeft, this.gameOffsetTop,
            this.game.window.width * this.game.tile, this.game.window.height * this.game.tile);
    }

    DrawTile = (i, j, style) => {
        this.ctx.font = `${this.game.tile / 1.15}px monospace`;
        if (style === -1) { this.ctx.fillStyle = Parameters.options.color + '55'; }
        else { this.ctx.fillStyle = Parameters.options.color; }

        this.ctx.fillText('[]', this.gameOffsetLeft + j * this.game.tile,
            this.gameOffsetTop + i * this.game.tile + this.game.tile / 1.35);
    }
}