import { createDiv, randomInt } from '@/utils.js';
import { IsMobile } from "@/constants";
import Interpreter from './Interpreter.js';
import Parameters from './Parameters.js';
import Tetris from './Tetris.js';
import Arkanoid from './Arkanoid.js';
import TicTacToe from './TicTacToe.js';
import './Terminal.scss';

export default class Terminal {

    constructor(element, changeTheme) {
        this.rootElement = element;
        this.changeTheme = changeTheme;

        this.terminal = createDiv('terminal');
        this.canvas = document.createElement('canvas');
        this.ctx = this.canvas.getContext('2d');
        this.input = document.createElement('input', { 'type': 'text' });
        this.btn = document.createElement('button');
        this.rootElement.append(this.terminal);
        this.terminal.append(this.canvas);
        this.terminal.append(this.input);
        this.terminal.append(this.btn);

        this.buffer = [];
        this.initialBufferLenght = 0;

        this.history = [];
        this.commandsHistory = [];
        this.commandIndex = -1;

        this.prefix;
        this.glitch;

        this.gameStarted;
        this.tetris = new Tetris(this.terminal, this.canvas, this.ctx);
        this.arkanoid = new Arkanoid(this.terminal, this.canvas, this.ctx);
        this.ticTacToe = new TicTacToe(this.terminal, this.canvas, this.ctx);

        this.interpreter = new Interpreter(
            this.ClearHistory,
            this.OnOptionChanged,
            this.ChangeTheme,
            this.StartGame
        );

        this.FocusInput();
        window.addEventListener('resize', this.OnResize);

        this.OnOptionChanged();
        this.OnResize();
    }

    FocusInput = () => {
        this.input.focus();
        this.input.addEventListener('focusout', this.input.focus);
        this.input.addEventListener('input', this.OnInput);
        this.input.addEventListener('keydown', this.OnKeyDown);
    }

    UnfocusInput = () => {
        this.input.removeEventListener('focusout', this.input.focus);
        this.input.removeEventListener('input', this.OnInput);
        this.input.removeEventListener('keydown', this.OnKeyDown);
        this.btn.focus();
    }

    ChangeTheme = (theme) => {
        this.terminal.remove();
        this.UnfocusInput();
        window.removeEventListener('resize', this.OnResize);
        this.changeTheme(theme);
    }

    OnOptionChanged = () => {
        let [r, g, b] = [0, 0, 0].map((e, index) => (parseInt(Parameters.options.color.substr(index * 2 + 1, 2), 16)));
        this.terminal.style.background = `#000 radial-gradient(circle, rgba(${r},${g},${b},0.15) 0%, rgb(0,0,0) 100%)`;
        this.canvas.style.background = `linear-gradient(180deg,rgba(0, 0, 0, 0) 0%,rgba(0, 0, 0, 0)
         80%,rgba(${r},${g},${b}, 0.05) 99%,rgba(0, 0, 0, 0) 100%)no-repeat`;

        clearTimeout(this.glitch);
        this.glitch = Parameters.options.isGlitched ? setTimeout(this.Glitch, 200) : undefined;

        this.SetDirTheme();
        localStorage.setItem('terminalOptions', JSON.stringify(Parameters.options));
    }

    StartGame = (game) => {
        this.gameStarted = game;
        this.UnfocusInput();
        document.addEventListener('keydown', this.GameOnKeyDown);
        if (IsMobile) this.btn.addEventListener('click', this.LeaveGame);
        clearTimeout(this.glitch);
        this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
        this[this.gameStarted].Start();
    }

    LeaveGame = () => {
        this[this.gameStarted].Leave();
        this.gameStarted = undefined;
        this.FocusInput();
        this.glitch = Parameters.options.isGlitched ? setTimeout(this.Glitch, 200) : undefined;
        document.removeEventListener('keydown', this.GameOnKeyDown);
        if (IsMobile) this.btn.removeEventListener('click', this.LeaveGame);
        this.Redraw();
    }

    GameOnKeyDown = (event) => {
        if (event.code === 'Escape') { this.LeaveGame(); }
    }

    SetDirTheme() {
        switch (Parameters.options.ps) {
            case 0:
                this.prefix = `┌──(user㉿${navigator.platform})${Parameters.options.showPos ? `-[${Parameters.curPos}]` : ''}\n`;
                this.prefix = this.prefix.padEnd(Math.ceil(this.prefix.length / Parameters.columnCount) * Parameters.columnCount) + '└─$ ';
                break;
            case 1:
                this.prefix = `user@${navigator.platform}${Parameters.options.showPos ? `:${Parameters.curPos}` : ''}$ `;
                break;
            case 2:
                this.prefix = `${Parameters.options.showPos ? Parameters.curPos : ''}>`;
                break;
            default: break;
        }
    }

    ClearHistory = () => { this.history = []; }

    ExecuteCommand = () => {
        let text = this.input.value.trim();
        let end = text.indexOf(' ');
        let command = end === -1 ? text.toLowerCase() : text.substr(0, end).toLowerCase();
        let attr = end === -1 ? '' : text.substr(end + 1);

        if (command in this.interpreter && typeof this.interpreter[command] === 'function') {
            let result = this.interpreter[command](attr);
            if (!result || result.length === 0) { return; }

            let resultRowCount = result.reduce((sum, cur) => (sum + Math.ceil(cur.length / Parameters.columnCount)), 0);
            if (resultRowCount >= Parameters.rowCount - 1) {
                let historyRowCount = this.history.reduce((sum, cur) => (sum + Math.ceil(cur.length / Parameters.columnCount)), 0);
                let visibleRowCount = 0;
                let resultEndFlag = false;

                for (const item of result) {
                    let itemRowCount = Math.ceil(item.length / Parameters.columnCount);
                    if (visibleRowCount + itemRowCount <= Parameters.rowCount - historyRowCount - 2 && !resultEndFlag) {
                        visibleRowCount += itemRowCount;
                        resultEndFlag = true;
                        this.history.push(item);
                    } else {
                        this.buffer.push(item);
                    }
                }
                this.buffer.reverse();
                this.initialBufferLenght = this.buffer.length;

            } else {
                this.history.push(...result);
            }

        } else {
            this.history.push(`Команда "${command}" не найдена`);
        }
    }

    OnInput = (event) => {
        if (this.initialBufferLenght !== 0 && (event.data === 'q' || event.data === 'Q')) {
            this.buffer = [];
            this.initialBufferLenght = 0;
            this.input.value = '';
        }
        this.Redraw();
    }

    OnKeyDown = (event) => {
        if (this.initialBufferLenght !== 0) {
            switch (event.key) {
                case 'ArrowUp':
                    if (this.buffer.length < this.initialBufferLenght) this.buffer.push(this.history.pop());
                    break;
                case 'ArrowDown':
                    if (this.buffer.length > 0) this.history.push(this.buffer.pop());
                    break;
                case 'Enter':
                    if (this.buffer.length > 0) this.history.push(this.buffer.pop());
                    break;
                default: break;
            }
            this.Redraw();
            return;
        }
        switch (event.key) {
            case 'Enter':
                (this.prefix + this.input.value).split('\n').forEach(row => this.history.push(row.trim()));
                this.commandsHistory.unshift(this.input.value);
                this.ExecuteCommand();
                this.input.value = '';
                this.commandIndex = -1;
                this.Redraw();
                event.preventDefault();
                break;
            case 'ArrowUp':
                if (this.commandIndex < this.commandsHistory.length - 1) {
                    this.commandIndex++;
                    if (this.commandIndex > -1) {
                        this.input.value = this.commandsHistory[this.commandIndex];
                        this.Redraw();
                    }
                }
                event.preventDefault();
                break;
            case 'ArrowDown':
                if (this.commandIndex > -1) {
                    this.commandIndex--;
                    if (this.commandIndex > -1) {
                        this.input.value = this.commandsHistory[this.commandIndex];
                        this.Redraw();
                    }
                }
                event.preventDefault();
                break;
            case 'ArrowLeft':
                if (this.input.selectionStart !== 0) {
                    this.Redraw(this.input.selectionStart - 1);
                }
                break;
            case 'ArrowRight':
                if (this.input.selectionStart !== this.input.value.length) {
                    this.Redraw(this.input.selectionStart + 1);
                }
                break;
            case 'Tab':
                event.preventDefault();
                break;
            default: break;
        }
    }

    OnResize = () => {
        let k = (24 - 16) / (768 - 320);
        let b = 24 - 768 * k;
        Parameters.fontSize = Math.floor(window.innerWidth * k + b);
        Parameters.fontSize = Parameters.fontSize > 24 ? 24 : Parameters.fontSize;
        this.ctx.font = `${Parameters.fontSize}px monospace`;
        Parameters.letterWidth = this.ctx.measureText('M').width;
        Parameters.letterHeight = 1.15 * Parameters.fontSize;
        Parameters.columnCount = Math.floor(((window.innerWidth / 12) * 10) / Parameters.letterWidth);
        Parameters.rowCount = Math.floor(((window.innerHeight / 12) * 10) / Parameters.letterHeight);
        Parameters.offsetLeft = (window.innerWidth - Parameters.columnCount * Parameters.letterWidth) / 2;
        Parameters.offsetTop = (window.innerHeight - Parameters.rowCount * Parameters.letterHeight) / 2;
        this.canvas.width = window.innerWidth;
        this.canvas.height = window.innerHeight;
        this.SetDirTheme();
        if (this.gameStarted) { this[this.gameStarted].Resize(); }
        else { this.Redraw(); }
    }

    Redraw = (cursorPos = this.input.selectionStart) => {
        if (this.gameStarted) return;
        let inputValue = this.prefix + this.input.value;
        cursorPos += this.prefix.length;
        this.ctx.font = `${Parameters.fontSize}px monospace`;
        this.ctx.shadowColor = Parameters.options.color;
        this.ctx.shadowBlur = Parameters.letterHeight;
        this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);

        this.ctx.fillStyle = Parameters.options.color;
        let hist = [];
        for (let i = 0; i < this.history.length; i++) {
            for (let j = 0; j < Math.ceil(this.history[i].length / Parameters.columnCount); j++) {
                hist.push(this.history[i].substr(j * Parameters.columnCount, Parameters.columnCount));
            }
        }
        let inputRowCount = Math.ceil(inputValue.length / Parameters.columnCount);
        let inputPos;
        if (hist.length + inputRowCount > Parameters.rowCount) {
            inputPos = Parameters.rowCount - inputRowCount;
        } else {
            inputPos = hist.length;
        }

        for (let i = hist.length - inputPos; i < hist.length; i++) {
            this.ctx.fillText(hist[i], Parameters.offsetLeft, Parameters.offsetTop + (i - hist.length + inputPos) * Parameters.letterHeight + Parameters.fontSize);
        }

        if (this.initialBufferLenght !== 0) {
            if (this.buffer.length === 0) {
                this.ctx.fillRect(Parameters.offsetLeft, Parameters.offsetTop + inputPos * Parameters.letterHeight, Parameters.letterWidth * 5, Parameters.letterHeight)
                this.ctx.fillStyle = '#000';
                this.ctx.fillText('(END)', Parameters.offsetLeft, Parameters.offsetTop + inputPos * Parameters.letterHeight + Parameters.fontSize);
            } else {
                this.ctx.fillText(':', Parameters.offsetLeft, Parameters.offsetTop + inputPos * Parameters.letterHeight + Parameters.fontSize);
                this.ctx.fillRect(Parameters.offsetLeft + Parameters.letterWidth, Parameters.offsetTop + inputPos * Parameters.letterHeight, Parameters.letterWidth * 1, Parameters.letterHeight)
            }
        } else {
            for (let i = inputRowCount > Parameters.rowCount ? inputRowCount - Parameters.rowCount : 0; i < inputRowCount; i++) {
                let str = inputValue.substr(i * Parameters.columnCount, Parameters.columnCount);
                this.ctx.fillText(str, Parameters.offsetLeft, Parameters.offsetTop + (inputPos + i) * Parameters.letterHeight + Parameters.fontSize);
            }
            let cursorRow = cursorPos % Parameters.columnCount === 0 ? cursorPos / Parameters.columnCount + 1 : Math.ceil(cursorPos / Parameters.columnCount);
            let cursorCol = cursorPos - Parameters.columnCount * (cursorRow - 1);
            this.ctx.fillRect(Parameters.offsetLeft + cursorCol * Parameters.letterWidth,
                Parameters.offsetTop + (inputPos + cursorRow - 1) * Parameters.letterHeight + 2,
                Parameters.letterWidth, Parameters.letterHeight - 2);
            if (cursorPos !== inputValue.length) {
                this.ctx.fillStyle = '#000';
                this.ctx.fillText(inputValue[cursorPos],
                    Parameters.offsetLeft + cursorCol * Parameters.letterWidth,
                    Parameters.offsetTop + (inputPos + cursorRow - 1) * Parameters.letterHeight + Parameters.fontSize);
            }
        }
    }

    Glitch = () => {
        let data = this.ctx.getImageData(0, 0, this.canvas.width, this.canvas.height);
        let k1 = randomInt(1, 5);
        let k2 = randomInt(5, 8);
        for (let y = 0; y < data.height; y++) {
            let deltaY = y * data.width;
            let skew = Math.ceil((y % (Parameters.letterHeight * k1)) / k2)
            for (let x = 0; x < data.width; x++) {
                data.data[(deltaY + x) * 4] = data.data[(deltaY + (x + skew)) * 4];
                data.data[(deltaY + x) * 4 + 1] = data.data[(deltaY + (x + skew)) * 4 + 1];
                data.data[(deltaY + x) * 4 + 2] = data.data[(deltaY + (x + skew)) * 4 + 2];
                data.data[(deltaY + x) * 4 + 3] = data.data[(deltaY + (x + skew)) * 4 + 3];
            }
        }
        this.ctx.putImageData(data, 0, 0);
        if (!this.gameStarted) { setTimeout(this.Redraw, 100); }
        this.glitch = setTimeout(this.Glitch, randomInt(300, 5000));
    }
}
