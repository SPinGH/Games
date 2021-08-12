import { Arkanoid as Game } from '@/Games/Arkanoid';
import { createDiv, createSVGElement, randomInt } from '@/utils.js';

function CreateMap(width, height) {
    let map = [];
    for (let i = 0; i < height; i++) {
        map.push([]);
        for (let j = 0; j < width; j++) {
            map[i].push(randomInt(0, 3) !== 0 ? {
                strength: randomInt(1, 2),
                style: randomInt(0, 3)
            } : null)
        }
    }
    return map;
}

export default class Arkanoid {

    constructor(element, toMenu) {
        this.rootElement = element;
        [this.backArrow, this.page, this.reset, this.score, this.lifes, this.canvas] = GetTetris();
        this.game = new Game(
            this.page,
            this.canvas,
            this.OnScoreChanged,
            this.OnLifesChanged
        );

        this.game.DrawBrick = this.DrawBrick.bind(this.game);
        this.game.DrawBall = this.DrawBall.bind(this.game);
        this.game.DrawCarriage = this.DrawCarriage.bind(this.game);
        this.game.DrawBonus = this.DrawBonus.bind(this.game);
        this.game.LoadMap(CreateMap(10, 10));

        let isStarted = false;
        this.reset.addEventListener('click', () => {
            if (!isStarted) {
                this.reset.children[0].setAttribute('d', 'M1740.9,362.9c-53-15.6-83.9,36.1-76.2,66.9l15.1-10.4l4.4,54.3l-49.2-23.4l14.4-10C1606.3,386.8,1679.8,305.5,1740.9,362.9z');
            }
            isStarted = true;
            this.game.LoadMap(CreateMap(10, 10));
            this.game.Reset();
        });
        this.backArrow.addEventListener('click', toMenu);
        this.OnScoreChanged();
        this.OnLifesChanged();
    }

    DrawBrick(i, j, brick) {
        switch (brick.style) {
            case 0:
                this.ctx.fillStyle = '#BAA85D';
                break;
            case 1:
                this.ctx.fillStyle = '#9B0D0C';
                break;
            case 2:
                this.ctx.fillStyle = '#424242';
                break;
            case 3:
                this.ctx.fillStyle = '#435387';
                break;
            case 4:
                this.ctx.fillStyle = '#B4C4B9';
                break;
            case 5:
                this.ctx.fillStyle = '#2D122A';
                break;
        }
        this.ctx.fillRect(j * this.brick.width, i * this.brick.height, this.brick.width, this.brick.height);
        if (brick.strength > 1) {
            this.ctx.fillStyle = '#00000022';
            this.ctx.fillRect(j * this.brick.width, i * this.brick.height, this.brick.width, this.brick.height)
        }
    }

    DrawBall() {
        if (!this.bonus.active.some(({ name }) => name === 'Through'))
            this.ctx.fillStyle = '#000';
        else
            this.ctx.fillStyle = '#435387';
        this.ctx.beginPath();
        this.ctx.arc(this.ball.x, this.ball.y, this.ball.rad, 0, 2 * Math.PI);
        this.ctx.fill();
    }

    DrawCarriage() {
        this.ctx.fillStyle = '#BAA85D';
        this.ctx.fillRect(this.carriage.x, this.carriage.y, this.carriage.width, this.carriage.height);
    }

    DrawBonus(bonus) {
        switch (bonus.name) {
            case 'Through':
                this.ctx.fillStyle = '#ccc';
                this.ctx.fillRect(bonus.x, bonus.y, this.brick.width, this.brick.width);
                this.ctx.fillStyle = '#435387';
                this.ctx.beginPath();
                this.ctx.arc(bonus.x + this.brick.width / 2, bonus.y + this.brick.width / 2, this.brick.width / 4, 0, 2 * Math.PI);
                this.ctx.fill();
                break;
            case 'BigBall':
                this.ctx.fillStyle = '#ccc';
                this.ctx.fillRect(bonus.x, bonus.y, this.brick.width, this.brick.width);
                this.ctx.fillStyle = '#000';
                this.ctx.beginPath();
                this.ctx.arc(bonus.x + this.brick.width / 2, bonus.y + this.brick.width / 2, this.brick.width / 2.1, 0, 2 * Math.PI);
                this.ctx.fill();
                break;
            case 'SmallBall':
                this.ctx.fillStyle = '#ccc';
                this.ctx.fillRect(bonus.x, bonus.y, this.brick.width, this.brick.width);
                this.ctx.fillStyle = '#000';
                this.ctx.beginPath();
                this.ctx.arc(bonus.x + this.brick.width / 2, bonus.y + this.brick.width / 2, this.brick.width / 8, 0, 2 * Math.PI);
                this.ctx.fill();
                break;
            case 'BigCarriage':
                this.ctx.fillStyle = '#ccc';
                this.ctx.fillRect(bonus.x, bonus.y, this.brick.width, this.brick.width);
                this.ctx.fillStyle = '#BAA85D';
                this.ctx.fillRect(bonus.x + this.brick.width / 8, bonus.y + this.brick.width * 2 / 5, this.brick.width * 6 / 8, this.brick.width / 5);
                break;
            case 'SmallCarriage':
                this.ctx.fillStyle = '#ccc';
                this.ctx.fillRect(bonus.x, bonus.y, this.brick.width, this.brick.width);
                this.ctx.fillStyle = '#BAA85D';
                this.ctx.fillRect(bonus.x + this.brick.width / 3, bonus.y + this.brick.width * 2 / 5, this.brick.width / 3, this.brick.width / 5);
                break;
            case 'Death':
                this.ctx.fillStyle = '#9B0D0C';
                this.ctx.fillRect(bonus.x, bonus.y, this.brick.width, this.brick.width);
                this.ctx.fillStyle = '#000';
                this.ctx.fillRect(bonus.x + this.brick.width / 3, bonus.y + this.brick.width / 3, this.brick.width / 3, this.brick.width / 3);
                break;
            default:
                this.ctx.fillStyle = '#ccc';
                this.ctx.fillRect(bonus.x, bonus.y, this.brick.width, this.brick.width);
                break;
        }
    }

    OnResize = () => {
        let width, height;
        if (window.innerHeight > window.innerWidth * 9 / 16) {
            width = window.innerWidth;
            height = window.innerWidth * 9 / 16;
        } else {
            width = window.innerHeight * 16 / 9;
            height = window.innerHeight;
        }
        this.canvas.style.bottom = ((window.innerHeight - height) / 2 + 0.2936 * height) + 'px';
        this.canvas.style.left = ((window.innerWidth - width) / 2 + 0.1035 * width) + 'px';
        this.canvas.height = 0.5873 * height;
        this.canvas.width = 0.3899 * width;
        this.game.Resize(this.canvas);
    }

    OnScoreChanged = () => {
        this.score.innerHTML = '';
        let score = String(this.game.score).padStart(5, '0');
        for (let i = 0; i < score.length; i++) {
            this.score.append(createSVGElement('g', { style: `transform:translateX(${-70 * i}px);` }, NUMBERS[+score[score.length - 1 - i]]));
        }
    }

    OnLifesChanged = () => {
        this.lifes.innerHTML = '';
        for (let i = 0; i < this.game.lifes; i++) {
            this.lifes.append(createSVGElement('path', { d: `M${1029.2 + i * 90},164.9l62.9,-3.0l5.1,62.9l-63.9,4.0Z`, fill: '#9B0D0C' }));
        }
    }

    Show(className) {
        this.rootElement.insertAdjacentElement('beforeEnd', this.page);

        this.page.classList.add(className);
        this.OnResize();

        setTimeout(() => {
            this.page.classList.remove(className);
            window.addEventListener('resize', this.OnResize);
        }, 3000)
    }

    Leave(className) {
        this.page.classList.add(className);

        window.removeEventListener('resize', this.OnResize);
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
        <path class="move" fill="#B4C4B9" d="M1342.66,911.81c-78.34,281.59-198.54,342.72-397.11,321.97  c-198.57-20.75-342.72-198.54-321.97-397.11c42.09-402.81,1065.4-647.89,1065.4-647.89S1466.36,467.18,1342.66,911.81z"/>
        <path class="move" fill="#2D122A" d="M1551.01,874.57l-638.03,8.01l-25.02,-10.96l662.95,-8.68Z"/>
        <path class="move" fill="#2D122A" d="M1194,845.39l-719.88,10.61l-28.12,-17.68l739.0,-10.32Z"/>
        <path class="move" fill="#2D122A" d="M1719,790l-1516.0,22.0l-5.0,-36.0l1508.0,-7.0Z" />
        <path fill="#2D122A" d="M960,730l-12.0,-7.0l0.0,-598.0l22.0,-18.0Z"/>
        <path fill="#2D122A" d="M199,760l-36.0,-6.89l17.0,-299.11l19.0,0.0Z"/>
        <path fill="#2D122A" d="M199,443l-19.0,0.0l-11.0,-331.0l30.0,0.0Z"/>
        <path class="move" fill="#BAA85D" d="M940.89,120.53l-598.71,0.71l-23.08,-18.07l622.1,-1.02Z"/>
        <path class="move" fill="#BAA85D" d="M768.2,84.3l-598.62,5.01l-23.38,-8.3l622.0,-5.36Z"/>
        <path class="move" fill="#BAA85D" d="M1118.3,90.8l3.5,-0.7l77.7,162.8l-3.5,1.7Z"/>
        <path class="move" fill="#435387" d="M1106.3,129.6l7.1,-4.4l51.7,108.9l-7.2,3.4Z"/>
        <path class="move" fill="#424242" d="M1657,277.2l9.8,-2.9l70.9,125.6l-9.8,3.9Z"/>
        <path class="move" fill="#BAA85D" d="M1643.8,312l4.6,-0.9l102.5,189.5l-4.7,1.9Z"/>
    </svg>`);

    let backArrow = createSVGElement('g', { 'class': 'move clickable' }, '<path class="stroke" d="M661.67,915.49l790.38,-25.14l-393.35,70.36Z" fill="#7D1717"/>');
    page.children[0].append(backArrow);

    let reset = createSVGElement('g', { 'class': 'move clickable' }, '<path class="stroke" fill="#435387" d="M1764.2,412.8l-126.6,61.1l10.5,-140.1Z"/>')
    page.children[0].append(reset);

    let score = createSVGElement('g', { 'class': 'move' });
    page.children[0].append(score);

    let lifes = createSVGElement('g', { 'class': 'move' });
    page.children[0].append(lifes);

    let canvas = document.createElement('canvas');
    page.append(canvas);

    return [backArrow, page, reset, score, lifes, canvas];
}