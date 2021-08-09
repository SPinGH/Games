import { Tetris as Game } from '@/Games/Tetris';
import { createDiv, createSVGElement } from '@/utils.js';

export default class Tetris {

    constructor(element, toMenu) {
        this.rootElement = element;
        [this.backArrow, this.page, this.reset, this.nextFigure, this.score, this.canvas] = GetTetris();

        this.game = new Game(
            this.canvas,
            this.OnFigureChanged.bind(this),
            this.OnScoreChanged.bind(this),
            15, 15);

        this.game.DrawTile = this.DrawTile.bind(this.game);

        let isStarted = false;
        this.reset.addEventListener('click', () => {
            if (!isStarted) {
                this.reset.children[1].setAttribute('d', 'M1619.7,330.4c-15.5-4.6-125.4-6.1-117.6,103.3l23.2-16l3.4,41.9l3.4,41.9l-38-18l-38-18l22.3-15.4  C1413,349.7,1534.3,247.8,1619.7,330.4');
            }
            isStarted = true;
            this.game.Reset();
        });
        this.backArrow.addEventListener('click', toMenu);
        this.OnFigureChanged();
        this.OnScoreChanged();
    }

    DrawTile(i, j, style) {
        switch (style) {
            case -1:
                this.ctx.fillStyle = "#ddd";
                break;
            case 0:
                this.ctx.fillStyle = "#C0A427";
                break;
            case 1:
                this.ctx.fillStyle = "#7D1717";
                break;
            case 2:
                this.ctx.fillStyle = "#000";
                break;
            case 3:
                this.ctx.fillStyle = "#000";
                break;
            case 4:
                this.ctx.fillStyle = "#2F4742";
                break;
            case 5:
                this.ctx.fillStyle = "#2F4742";
                break;
            case 6:
                this.ctx.fillStyle = "#391230";
                break;
            default:
                break;
        }
        this.ctx.fillRect(j * this.tile, i * this.tile, this.tile, this.tile);
    }

    OnResize() {
        let width, height;
        if (window.innerHeight > window.innerWidth * 9 / 16) {
            width = window.innerWidth;
            height = window.innerWidth * 9 / 16;
        } else {
            width = window.innerHeight * 16 / 9;
            height = window.innerHeight;
        }
        this.canvas.style.bottom = ((window.innerHeight - height) / 2 + 0.2936 * height) + 'px';
        this.canvas.style.left = ((window.innerWidth - width) / 2 + 0.1623 * width) + 'px';
        this.canvas.height = 0.5569 * height;
        this.canvas.width = 0.5569 * height;
        this.game.tile = this.canvas.height / this.game.window.height;
    }

    OnFigureChanged() {
        for (let i = 0; i < this.nextFigure.children.length; i++) {
            this.nextFigure.children[i].style.transform = 'scale(0) rotate(-30deg)';
        }
        this.nextFigure.children[this.game.nextFigure].style.transform = 'scale(1)';
    }

    OnScoreChanged() {
        this.score.innerHTML = '';
        let score = String(this.game.score).padStart(5, '0');
        for (let i = 0; i < score.length; i++) {
            this.score.append(createSVGElement('g', { style: `transform:translateX(${-70 * i}px);` }, NUMBERS[+score[score.length - 1 - i]]));
        }
    }

    Show(className) {
        this.rootElement.insertAdjacentElement('beforeEnd', this.page);

        this.page.classList.add(className);
        this.OnResize();

        setTimeout(() => {
            this.page.classList.remove(className);
            window.onresize = this.OnResize.bind(this);
        }, 3000)
    }

    Leave(className) {
        this.page.classList.add(className);

        window.onresize = null;
        this.game.Stop();

        setTimeout(() => {
            this.page.classList.remove(className);
            this.page.remove();
        }, 3000)
    }
}

let NUMBERS = [
    '<path fill="#2F4742" d="M1345.9,585.4c-0.6,15.7-13.7,27.9-29.4,27.4c-15.7-0.6-27.9-13.7-27.4-29.4c0.6-15.7,13.7-27.9,29.4-27.4C1334.2,556.6,1346.5,569.8,1345.9,585.4"/>',
    '<path fill="#23372C" d="M1309.8,558.9l15.4,1.0l0.0,49.7l-15.4,0.0Z"/>',
    '<path fill="#23372C" d="M1328,597.2l6.1,0.2v9.8h-32.6l16.7-16.7c-0.2,0-0.5,0-0.7,0c-9.3,0-16.9-7.6-16.9-16.9s7.6-16.9,16.9-16.9s16.9,7.6,16.9,16.9c0,3.1-0.9,6.1-2.3,8.6L1328,597.2z"/>',
    '<path fill="#23372C" d="M1335.7,592.4c0,10-8.1,18.2-18.2,18.2c-10,0-18.2-8.1-18.2-18.2c0-0.7,0-1.4,0.1-2.1L1327,577C1332.2,580.1,1335.7,585.8,1335.7,592.4"/><path fill="#23372C" d="M1306,581.1l28.0,-13.0l0.0,-8.7l-31.3,0.0l0.0,9.3l11.1,0.0Z"/>',
    '<path fill="#23372C" d="M1311.2,590.6L1311.2,590.6v-31.8h-15.9V597h28.6v12.7h15.9v-18.8h-28.6V590.6z M1323.9,584h15.9v-25.2h-15.9V584z"/>',
    '<path fill="#23372C" d="M1338.8,585.8c3.2,9.5-1.8,19.8-11.4,23.1c-9.5,3.2-19.8-1.8-23.1-11.4c-0.2-0.7-0.4-1.4-0.6-2.1l21.9-21.5C1331.6,575.3,1336.7,579.6,1338.8,585.8"/><path fill="#23372C" d="M1332.4,559l-11.0,11.1l-8.9,0.0l0.0,8.8l-11.0,11.1l0.0,-31.0Z" />',
    '<path fill="#23372C" d="M1337.1,592.7c0,10-8.1,18.1-18.1,18.1s-18.1-8.1-18.1-18.1c0-0.6,0-1.2,0.1-1.8l-0.1,0.1v-31h11.2l8.7,11.1h-8.8v5c2.2-0.9,4.5-1.4,7-1.4C1329,574.7,1337.1,582.8,1337.1,592.7"/>',
    '<path fill="#23372C" d="M1316.1,579.4l15.4,-1.0l0.0,32.3l-15.4,0.0Z"/><path fill="#23372C" d="M1299.3,560l32.2,1.0l0.0,14.4l-32.2,0.0Z"/>',
    '<path fill="#23372C" d="M1335,592c0,9.9-8.1,18-18,18s-18-8.1-18-18s8.1-18,18-18S1335,582,1335,592"/><path fill="#23372C" d="M1325,565.9c0,4.4-3.6,8-8,8s-8-3.6-8-8s3.6-8,8-8S1325,561.5,1325,565.9"/>',
    '<path fill="#23372C" d="M1297.3,578.1c0-10,8.1-18.1,18.1-18.1s18.1,8.1,18.1,18.1c0,0.6,0,1.2-0.1,1.8l0.1-0.1v31h-11.2l-8.7-11.1h8.8v-5c-2.2,0.9-4.5,1.4-7,1.4C1305.3,596.2,1297.3,588.1,1297.3,578.1"/>'
]

function GetTetris() {
    let page = createDiv('page', `
    <svg height="100%" width="100%" viewBox="0 0 1920 1080">
        <path class="move" fill="#B4C4B9" d="M1006.8,1369.7c81.2-65.9,381.2-305.3,617.8-497.6c-600.4-153-523.4-664.4-304.8-777C735.7-157,247.7,877.8,1006.8,1369.7"/>
        <path fill="#3C40B7" d="M960.7,832.7l-730.8,-5.6l1.9,-66.9l752.4,0.2Z"/>
        <path class="move" fill="#3C40B7" d="M1278.2,894.2l-723.5,-8.6l-6.5,-24.4l751.7,-2.1Z" />
        <path class="move" fill="#3C40B7" d="M369.6,901.7l0.0,20.9l443.2,11.4l-13.8,-16.2Z" />
        <path class="move" fill="#3C40B7" d="M1231.6,405.8l-26.2,16.8l-149.1,-201.1l13.4,-12.6Z" />
        <path class="move" fill="#3C40B7" d="M1089.4,131.4l-20.2,16.8l102.7,138.6l13.3,-8.0Z" />
        <path class="move" fill="#3C40B7" d="M1324.7,376.8l-11.6,11.5l-110.1,-148.5l7.1,-3.2Z" />
        <path class="move" fill="#7D1717" d="M961.6,158.6l-562.7,6.6l-2.0,-7.3l565.4,-11.1Z" />
        <path class="move" fill="#7D1717" d="M804,133.9l-562.6,6.6l-2.1,-7.3l562.1,-5.0Z" />
    </svg>`);

    let backArrow = createSVGElement('g', { 'class': 'move clickable' }, '<path class="stroke" d="M672.1,962.3l579.7,3.3l-290.0,34.4Z" fill="#7D1717"/>');
    page.children[0].append(backArrow);

    let reset = createSVGElement('g', { 'class': 'move clickable' }, '<path fill="#B4C4B9" d="M1689.8,400.1c0,84.1-68.2,152.3-152.3,152.3c-84.1,0-152.3-68.2-152.3-152.3s68.2-152.3,152.3-152.3C1621.6,247.8,1689.8,316,1689.8,400.1"/><path class="stroke" fill="#7D1717" d="M1631.7,396.5l-149.5,86.3l0.0,-172.6Z"/>')
    page.children[0].append(reset);

    let nextFigure = createSVGElement('g', { 'class': 'move' }, '<path fill="#C0A427" d="M1029.6,269l262.4,-28.1l8.3,64.9l-263.4,29.1Z" /><path fill="#7D1717" d="M1093.2,217.6l148.8,-10.6l12.5,148.8l-149.8,11.5Z" /><path d="M1256.1,227.5l-4.6,66.1l-66.1,-4.6l-4.5,66.1l-132.2,-9.1l4.5,-66.1l66.1,4.5l4.6,-66.1Z" /><path d="M1078.6,215.6l3.9,66.1l66.1,-3.8l3.9,66.1l132.3,-7.7l-3.9,-66.2l-66.1,3.9l-3.9,-66.2Z" /><path fill="#2F4742" d="M1205.8,309l-115.1,-66.8l33.6,-57.8l172.6,100.3l-66.8,114.9l-57.6,-33.4Z" /><path fill="#2F4742" d="M1111.6,247.8l6.6,-66.3l132.3,13.2l-19.7,198.6l-66.5,-6.6l13.2,-132.4Z" /><path fill="#391230" d="M1189,259.7l65.6,8.9l-8.9,65.7l-197.0,-26.8l8.9,-65.7l65.7,8.9l8.9,-65.6l65.7,8.9Z" />');
    for (let i = 0; i < nextFigure.children.length; i++) {
        nextFigure.children[i].style.transform = 'scale(0) rotate(-30deg)';
    }
    page.children[0].append(nextFigure);

    let score = createSVGElement('g', { 'class': 'move' });
    page.children[0].append(score);

    let canvas = document.createElement('canvas');
    page.append(canvas);

    return [backArrow, page, reset, nextFigure, score, canvas];
}