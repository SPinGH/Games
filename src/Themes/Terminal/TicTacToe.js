import { TicTacToe as Game } from '@/Games/TicTacToe.js';
import { IsMobile } from '@/constants';
import Parameters from './Parameters.js';

export default class TicTacToe {
    constructor(terminal, canvas, ctx) {
        this.terminal = terminal;
        this.canvas = canvas;
        this.ctx = ctx;

        this.game = new Game(
            this.OnMatrixChanged,
            this.OnCrossChanged,
        );
        this.gameOffsetTop = 0;
        this.gameOffsetLeft = 0;
        this.selectedMatrixCell = null;
        this.selectedSettingsRow = null;
        this.gameSide;
        this.gameBlocked = false;
    }

    Start = () => {
        document.addEventListener('keydown', this.OnKeyDown);
        this.canvas.addEventListener('click', this.OnClick);
        if (!IsMobile) { this.selectedMatrixCell = 0; }
        this.Resize();
    }

    Leave = () => {
        document.removeEventListener('keydown', this.OnKeyDown);
        this.canvas.removeEventListener('click', this.OnClick);
    }

    OnClick = (event) => {
        if (this.gameBlocked) { return; }
        let tile = this.gameSide / 3;
        let offsetLeft = this.gameOffsetTop === Parameters.offsetTop ?
            this.gameOffsetLeft + this.gameSide + Parameters.letterHeight * 2 :
            this.gameOffsetLeft;
        if (event.clientX > this.gameOffsetLeft && event.clientX < this.gameOffsetLeft + this.gameSide &&
            event.clientY > Parameters.offsetTop && event.clientY < Parameters.offsetTop + this.gameSide) {
            if (this.game.winner !== null) {
                this.game.Reset();
                this.OnMatrixChanged();
                return;
            }
            let row = Math.floor((event.clientY - Parameters.offsetTop) / tile);
            let column = Math.floor((event.clientX - this.gameOffsetLeft) / tile);
            this.game.HandleClick(row * 3 + column);
            setTimeout(() => {
                this.gameBlocked = false;
            }, 500);
            this.gameBlocked = true;
            this.OnMatrixChanged();
        } else if (event.clientX > offsetLeft && event.clientX < offsetLeft + Parameters.letterWidth * 24 &&
            event.clientY > this.gameOffsetTop && event.clientY < this.gameOffsetTop + Parameters.letterHeight * 5) {
            let row = Math.floor((event.clientY - this.gameOffsetTop) / (Parameters.letterHeight * 5 / 3));
            if (row === 0) {
                let column = Math.floor((event.clientX - offsetLeft - Parameters.letterWidth * 14) / (Parameters.letterWidth * 4));
                if (column === 0) {
                    this.game.firstPlayer = 'X';
                    this.game.secondPlayer = 'O';
                } else if (column === 1) {
                    this.game.firstPlayer = 'O';
                    this.game.secondPlayer = 'X';
                }
            } else if (row === 1) {
                let column = Math.floor((event.clientX - offsetLeft - Parameters.letterWidth * 8) / (Parameters.letterWidth * 8));
                if (column === 0) {
                    this.game.withAI = true;
                } else if (column === 1) {
                    this.game.withAI = false;
                }
            } else if (row === 2) {
                let column = Math.floor((event.clientX - offsetLeft - Parameters.letterWidth * 11) / (Parameters.letterWidth * 5));
                if (column === 0) {
                    this.game.difficultyLevel = 0;
                } else if (column === 1) {
                    this.game.difficultyLevel = 1;
                } else if (column === 2) {
                    this.game.difficultyLevel = 2;
                }
            }
            this.game.Reset();
            this.OnSettingsChanged();
        }
    }

    OnKeyDown = (event) => {
        if (event.code === 'KeyR') {
            this.selectedMatrixCell = 0;
            this.selectedSettingsRow = null;
            this.game.Reset();
            this.OnSettingsChanged();
            return;
        } else if (this.game.winner !== null && event.code === 'KeyS') {
            this.selectedSettingsRow = 0;
            this.game.Reset();
            this.OnSettingsChanged();
            return;
        }
        if (this.selectedSettingsRow !== null) {
            switch (event.code) {
                case 'ArrowLeft':
                    switch (this.selectedSettingsRow) {
                        case 0:
                            this.game.firstPlayer = this.game.firstPlayer === 'X' ? 'O' : 'X';
                            this.game.secondPlayer = this.game.secondPlayer === 'X' ? 'O' : 'X';
                            break;
                        case 1:
                            this.game.withAI = !this.game.withAI;
                            break;
                        case 2:
                            this.game.difficultyLevel = (this.game.difficultyLevel + 2) % 3
                            break;
                        default: break;
                    }
                    this.game.Reset();
                    this.OnSettingsChanged();
                    break;
                case 'ArrowRight':
                    switch (this.selectedSettingsRow) {
                        case 0:
                            this.game.firstPlayer = this.game.firstPlayer === 'X' ? 'O' : 'X';
                            this.game.secondPlayer = this.game.secondPlayer === 'X' ? 'O' : 'X';
                            break;
                        case 1:
                            this.game.withAI = !this.game.withAI;
                            break;
                        case 2:
                            this.game.difficultyLevel = (this.game.difficultyLevel + 1) % 3
                            break;
                        default: break;
                    }
                    this.game.Reset();
                    this.OnSettingsChanged();
                    break;
                case 'ArrowUp':
                    this.selectedSettingsRow = (this.selectedSettingsRow + 2) % 3;
                    this.OnSettingsChanged();
                    break;
                case 'ArrowDown':
                    this.selectedSettingsRow = (this.selectedSettingsRow + 1) % 3;
                    this.OnSettingsChanged();
                    break;
                case 'KeyS':
                    this.selectedSettingsRow = null;
                    this.selectedMatrixCell = 0;
                    this.OnMatrixChanged();
                    this.OnSettingsChanged();
                    break;
                default: break;
            }
        } else if (this.selectedMatrixCell !== null) {
            switch (event.code) {
                case 'ArrowLeft':
                    this.selectedMatrixCell = Math.floor(this.selectedMatrixCell / 3) * 3 + (this.selectedMatrixCell + 2) % 3;
                    this.OnMatrixChanged();
                    break;
                case 'ArrowRight':
                    this.selectedMatrixCell = Math.floor(this.selectedMatrixCell / 3) * 3 + (this.selectedMatrixCell + 1) % 3;
                    this.OnMatrixChanged();
                    break;
                case 'ArrowUp':
                    this.selectedMatrixCell = (this.selectedMatrixCell + 6) % 9;
                    this.OnMatrixChanged();
                    break;
                case 'ArrowDown':
                    this.selectedMatrixCell = (this.selectedMatrixCell + 3) % 9;
                    this.OnMatrixChanged();
                    break;
                case 'KeyS':
                    this.selectedMatrixCell = null;
                    this.selectedSettingsRow = 0;
                    this.OnSettingsChanged();
                    this.OnMatrixChanged();
                    break;
                case 'Space':
                    this.game.HandleClick(this.selectedMatrixCell);
                    setTimeout((selectedMatrixCell) => {
                        this.selectedMatrixCell = this.game.winner === null ? selectedMatrixCell : null;
                    }, 500, this.selectedMatrixCell);
                    this.selectedMatrixCell = null;
                    this.OnMatrixChanged();
                    break;
                default: break;
            }
        }
    }

    OnMatrixChanged = () => {
        this.ctx.shadowColor = Parameters.options.color;
        this.ctx.shadowBlur = Parameters.letterHeight / 2;
        this.ctx.fillStyle = Parameters.options.color;
        this.ctx.strokeStyle = Parameters.options.color;
        let tile = this.gameSide / 39;

        let DrawX = (row, col) => {
            let offsetLeft = col * (this.gameSide / 3) + this.gameOffsetLeft;
            let offsetTop = row * (this.gameSide / 3) + Parameters.offsetTop;
            this.ctx.beginPath();
            this.ctx.moveTo(offsetLeft + tile * 7, offsetTop + tile * 9);
            this.ctx.lineTo(offsetLeft + tile * 7, offsetTop + tile * 10);
            this.ctx.lineTo(offsetLeft + tile * 7.5, offsetTop + tile * 10);
            this.ctx.moveTo(offsetLeft + tile * 8.5, offsetTop + tile * 8);
            this.ctx.lineTo(offsetLeft + tile * 9, offsetTop + tile * 8);
            this.ctx.lineTo(offsetLeft + tile * 9, offsetTop + tile * 9);
            this.ctx.moveTo(offsetLeft + tile * 8, offsetTop + tile * 11);
            this.ctx.lineTo(offsetLeft + tile * 8, offsetTop + tile * 12);
            this.ctx.lineTo(offsetLeft + tile * 10, offsetTop + tile * 12);
            this.ctx.lineTo(offsetLeft + tile * 10, offsetTop + tile * 10);
            this.ctx.lineTo(offsetLeft + tile * 9.5, offsetTop + tile * 10);
            this.ctx.moveTo(offsetLeft + tile * 3, offsetTop + tile * 3);
            this.ctx.lineTo(offsetLeft + tile * 3, offsetTop + tile * 4);
            this.ctx.lineTo(offsetLeft + tile * 3.5, offsetTop + tile * 4);
            this.ctx.moveTo(offsetLeft + tile * 4.5, offsetTop + tile * 2);
            this.ctx.lineTo(offsetLeft + tile * 5, offsetTop + tile * 2);
            this.ctx.lineTo(offsetLeft + tile * 5, offsetTop + tile * 3);
            this.ctx.moveTo(offsetLeft + tile * 4, offsetTop + tile * 5);
            this.ctx.lineTo(offsetLeft + tile * 4, offsetTop + tile * 6);
            this.ctx.lineTo(offsetLeft + tile * 4.5, offsetTop + tile * 6);
            this.ctx.moveTo(offsetLeft + tile * 5.5, offsetTop + tile * 4);
            this.ctx.lineTo(offsetLeft + tile * 6, offsetTop + tile * 4);
            this.ctx.lineTo(offsetLeft + tile * 6, offsetTop + tile * 5);
            this.ctx.moveTo(offsetLeft + tile * 3, offsetTop + tile * 11);
            this.ctx.lineTo(offsetLeft + tile * 3, offsetTop + tile * 12);
            this.ctx.lineTo(offsetLeft + tile * 5, offsetTop + tile * 12);
            this.ctx.lineTo(offsetLeft + tile * 5, offsetTop + tile * 10);
            this.ctx.lineTo(offsetLeft + tile * 6, offsetTop + tile * 10);
            this.ctx.lineTo(offsetLeft + tile * 6, offsetTop + tile * 8);
            this.ctx.lineTo(offsetLeft + tile * 6.5, offsetTop + tile * 8);
            this.ctx.moveTo(offsetLeft + tile * 8, offsetTop + tile * 7);
            this.ctx.lineTo(offsetLeft + tile * 8, offsetTop + tile * 6);
            this.ctx.lineTo(offsetLeft + tile * 9, offsetTop + tile * 6);
            this.ctx.lineTo(offsetLeft + tile * 9, offsetTop + tile * 4);
            this.ctx.lineTo(offsetLeft + tile * 10, offsetTop + tile * 4);
            this.ctx.lineTo(offsetLeft + tile * 10, offsetTop + tile * 2);
            this.ctx.lineTo(offsetLeft + tile * 9.5, offsetTop + tile * 2);
            this.ctx.stroke();
            this.ctx.fillRect(offsetLeft + tile * 2.5, offsetTop + tile * 1, tile * 2, tile * 2);
            this.ctx.fillRect(offsetLeft + tile * 7.5, offsetTop + tile * 1, tile * 2, tile * 2);
            this.ctx.fillRect(offsetLeft + tile * 3.5, offsetTop + tile * 3, tile * 2, tile * 2);
            this.ctx.fillRect(offsetLeft + tile * 6.5, offsetTop + tile * 3, tile * 2, tile * 2);
            this.ctx.fillRect(offsetLeft + tile * 4.5, offsetTop + tile * 5, tile * 3, tile * 2);
            this.ctx.fillRect(offsetLeft + tile * 3.5, offsetTop + tile * 7, tile * 2, tile * 2);
            this.ctx.fillRect(offsetLeft + tile * 6.5, offsetTop + tile * 7, tile * 2, tile * 2);
            this.ctx.fillRect(offsetLeft + tile * 2.5, offsetTop + tile * 9, tile * 2, tile * 2);
            this.ctx.fillRect(offsetLeft + tile * 7.5, offsetTop + tile * 9, tile * 2, tile * 2);
        }

        let DrawO = (row, col) => {
            let offsetLeft = col * (this.gameSide / 3) + this.gameOffsetLeft;
            let offsetTop = row * (this.gameSide / 3) + Parameters.offsetTop;
            this.ctx.beginPath();
            this.ctx.moveTo(offsetLeft + tile * 3, offsetTop + tile * 9);
            this.ctx.lineTo(offsetLeft + tile * 3, offsetTop + tile * 10);
            this.ctx.lineTo(offsetLeft + tile * 3.5, offsetTop + tile * 10);
            this.ctx.moveTo(offsetLeft + tile * 5, offsetTop + tile * 9);
            this.ctx.lineTo(offsetLeft + tile * 5, offsetTop + tile * 4);
            this.ctx.lineTo(offsetLeft + tile * 7.5, offsetTop + tile * 4);
            this.ctx.moveTo(offsetLeft + tile * 8.5, offsetTop + tile * 2);
            this.ctx.lineTo(offsetLeft + tile * 9, offsetTop + tile * 2);
            this.ctx.lineTo(offsetLeft + tile * 9, offsetTop + tile * 3);
            this.ctx.moveTo(offsetLeft + tile * 9.5, offsetTop + tile * 4);
            this.ctx.lineTo(offsetLeft + tile * 10, offsetTop + tile * 4);
            this.ctx.lineTo(offsetLeft + tile * 10, offsetTop + tile * 10);
            this.ctx.lineTo(offsetLeft + tile * 9, offsetTop + tile * 10);
            this.ctx.lineTo(offsetLeft + tile * 9, offsetTop + tile * 12);
            this.ctx.lineTo(offsetLeft + tile * 4, offsetTop + tile * 12);
            this.ctx.lineTo(offsetLeft + tile * 4, offsetTop + tile * 11);
            this.ctx.stroke();
            this.ctx.fillRect(offsetLeft + tile * 3.5, offsetTop + tile * 1, tile * 5, tile * 2);
            this.ctx.fillRect(offsetLeft + tile * 2.5, offsetTop + tile * 3, tile * 2, tile * 6);
            this.ctx.fillRect(offsetLeft + tile * 3.5, offsetTop + tile * 9, tile * 5, tile * 2);
            this.ctx.fillRect(offsetLeft + tile * 7.5, offsetTop + tile * 3, tile * 2, tile * 6);
        }

        this.ctx.clearRect(this.gameOffsetLeft - Parameters.letterHeight, Parameters.offsetTop - Parameters.letterHeight,
            this.gameSide + Parameters.letterHeight * 2, this.gameSide + Parameters.letterHeight * 2);
        let tileSide = this.gameSide / 3;
        for (let i = 0; i < 9; i++) {
            let row = Math.floor(i / 3);
            let col = i % 3;
            this.ctx.strokeRect(this.gameOffsetLeft + tileSide * col + 2, Parameters.offsetTop + tileSide * row + 2,
                tileSide - 4, tileSide - 4);
            if (this.game.matrix[i] === 'X') DrawX(row, col);
            else if (this.game.matrix[i] === 'O') DrawO(row, col);
        }

        if (!IsMobile && this.selectedMatrixCell !== null) {
            this.ctx.fillStyle = Parameters.options.color + '33';
            this.ctx.strokeStyle = Parameters.options.color + '33';
            if (this.game.IsNext('X')) DrawX(Math.floor(this.selectedMatrixCell / 3), this.selectedMatrixCell % 3);
            else DrawO(Math.floor(this.selectedMatrixCell / 3), this.selectedMatrixCell % 3);
            this.ctx.fillStyle = Parameters.options.color;
            this.ctx.strokeStyle = Parameters.options.color;
        }
    }

    OnSettingsChanged = () => {
        this.ctx.font = `${Parameters.fontSize}px monospace`;
        this.ctx.shadowColor = Parameters.options.color;
        this.ctx.shadowBlur = Parameters.letterHeight / 2;
        this.ctx.fillStyle = Parameters.options.color;

        let offsetLeft = this.gameOffsetTop === Parameters.offsetTop ?
            this.gameOffsetLeft + this.gameSide + Parameters.letterHeight * 2 :
            this.gameOffsetLeft;

        this.ctx.clearRect(offsetLeft - Parameters.letterHeight, this.gameOffsetTop - Parameters.letterHeight,
            Parameters.letterWidth * 24 + Parameters.letterHeight * 2, Parameters.letterHeight * 7 + 4);

        this.ctx.fillText(`${this.selectedSettingsRow === 0 ? '>' : ' '}Первый ходит:  X   O`,
            offsetLeft, this.gameOffsetTop + Parameters.fontSize);
        if (this.game.firstPlayer === 'X') {
            this.ctx.fillRect(offsetLeft + Parameters.letterWidth * 15 - 4, this.gameOffsetTop,
                Parameters.letterWidth * 3 + 8, Parameters.letterHeight + 4);
            this.ctx.fillStyle = '#000';
            this.ctx.fillText('X', offsetLeft + Parameters.letterWidth * 16, this.gameOffsetTop + Parameters.fontSize);
        } else {
            this.ctx.fillRect(offsetLeft + Parameters.letterWidth * 19 - 4, this.gameOffsetTop,
                Parameters.letterWidth * 3 + 8, Parameters.letterHeight + 4);
            this.ctx.fillStyle = '#000';
            this.ctx.fillText('O', offsetLeft + Parameters.letterWidth * 20, this.gameOffsetTop + Parameters.fontSize);
        }
        this.ctx.fillStyle = Parameters.options.color;

        this.ctx.fillText(`${this.selectedSettingsRow === 1 ? '>' : ' '}Играть: Одному Вдвоём`,
            offsetLeft, this.gameOffsetTop + Parameters.fontSize + Parameters.letterHeight * 2);
        if (this.game.withAI) {
            this.ctx.fillRect(offsetLeft + Parameters.letterWidth * 9 - 4, this.gameOffsetTop + Parameters.letterHeight * 2,
                Parameters.letterWidth * 6 + 8, Parameters.letterHeight + 4);
            this.ctx.fillStyle = '#000';
            this.ctx.fillText('Одному', offsetLeft + Parameters.letterWidth * 9,
                this.gameOffsetTop + Parameters.fontSize + Parameters.letterHeight * 2);
        } else {
            this.ctx.fillRect(offsetLeft + Parameters.letterWidth * 16 - 4, this.gameOffsetTop + Parameters.letterHeight * 2,
                Parameters.letterWidth * 6 + 8, Parameters.letterHeight + 4);
            this.ctx.fillStyle = '#000';
            this.ctx.fillText('Вдвоём', offsetLeft + Parameters.letterWidth * 16,
                this.gameOffsetTop + Parameters.fontSize + Parameters.letterHeight * 2);
        }
        this.ctx.fillStyle = Parameters.options.color;

        this.ctx.fillText(`${this.selectedSettingsRow === 2 ? '>' : ' '}Сложность:  X   XX  XXX`,
            offsetLeft, this.gameOffsetTop + Parameters.fontSize + Parameters.letterHeight * 4);
        if (this.game.difficultyLevel === 0) {
            this.ctx.fillRect(offsetLeft + Parameters.letterWidth * 12, this.gameOffsetTop + Parameters.letterHeight * 4,
                Parameters.letterWidth * 3, Parameters.letterHeight + 4);
            this.ctx.fillStyle = '#000';
            this.ctx.fillText('X', offsetLeft + Parameters.letterWidth * 13,
                this.gameOffsetTop + Parameters.fontSize + Parameters.letterHeight * 4);
        } else if (this.game.difficultyLevel === 1) {
            this.ctx.fillRect(offsetLeft + Parameters.letterWidth * 16, this.gameOffsetTop + Parameters.letterHeight * 4,
                Parameters.letterWidth * 4, Parameters.letterHeight + 4);
            this.ctx.fillStyle = '#000';
            this.ctx.fillText('XX', offsetLeft + Parameters.letterWidth * 17,
                this.gameOffsetTop + Parameters.fontSize + Parameters.letterHeight * 4);
        } else {
            this.ctx.fillRect(offsetLeft + Parameters.letterWidth * 21 - 4, this.gameOffsetTop + Parameters.letterHeight * 4,
                Parameters.letterWidth * 3 + 8, Parameters.letterHeight + 4);
            this.ctx.fillStyle = '#000';
            this.ctx.fillText('XXX', offsetLeft + Parameters.letterWidth * 21,
                this.gameOffsetTop + Parameters.fontSize + Parameters.letterHeight * 4);
        }
        this.ctx.fillStyle = Parameters.options.color;
    }

    OnCrossChanged = () => {
        if (this.game.cross === null) { return; }
        this.selectedSettingsRow = null;
        this.selectedMatrixCell = null;
        const lines = [
            [0, 1, 2],
            [3, 4, 5],
            [6, 7, 8],
            [0, 3, 6],
            [1, 4, 7],
            [2, 5, 8],
            [0, 4, 8],
            [2, 4, 6],
        ];
        for (let i = 0; i < this.game.matrix.length; i++) {
            if (!lines[this.game.cross].includes(i)) {
                this.game.matrix[i] = null;
            }
        }
        this.OnMatrixChanged();
    }

    Resize = () => {
        let height = window.innerHeight - Parameters.offsetTop * 2;
        let width = window.innerWidth - Parameters.offsetLeft * 2;
        if (width < height * 4 / 3) {
            height -= Parameters.letterHeight * 8;
            if (height < width) width = height;
            else height = width;
            this.gameOffsetLeft = (window.innerWidth - width) / 2;
            this.gameOffsetTop = Parameters.offsetTop + height + Parameters.letterHeight * 2;
        } else {
            width -= Parameters.letterWidth * 24 + Parameters.letterHeight * 2;
            if (width > height) width = height;
            else height = width;
            this.gameOffsetLeft = (window.innerWidth - width) / 2 - Parameters.letterWidth * 12;
            this.gameOffsetTop = Parameters.offsetTop;
        }
        this.gameSide = width;
        if (IsMobile) {
            this.ctx.font = `${Parameters.fontSize}px monospace`;
            this.ctx.fillStyle = Parameters.options.color;
            this.ctx.fillText('X', window.innerWidth - Parameters.letterWidth - 16, Parameters.fontSize + 9);
        }

        this.OnMatrixChanged();
        this.OnCrossChanged();
        this.OnSettingsChanged();
    }
}