import { createDiv, randomInt } from '@/utils.js';
import { IsMobile } from '@/constants.js'
import Themes from './Themes.js';
import Menu from './Menu.js';
import About from './About.js';
import Tetris from './Tetris.js';
import Arkanoid from './Arkanoid.js';
import TicTacToe from './TicTacToe.js';
import './Supremus.scss';

export default class Supremus {

    constructor(element, changeTheme) {
        this.rootElement = element;
        this.supremus = createDiv('supremus');
        this.rootElement.append(this.supremus);
        this.handlers = [];

        this.pages = [
            new Menu(
                this.supremus,
                () => { this.ChangePage(0, 1); },
                () => { this.ChangePage(0, 2); },
                () => { this.ChangePage(0, 3); },
                () => { this.ChangePage(0, 4); },
                () => { this.ChangePage(0, 5); }),
            new Themes(
                this.supremus,
                () => { this.ChangePage(1, 0); },
                changeTheme,
                this.ClearEvent.bind(this)),
            new About(
                this.supremus,
                () => { this.ChangePage(2, 0); }),
            new Tetris(
                this.supremus,
                () => { this.ChangePage(3, 0); }),
            new Arkanoid(
                this.supremus,
                () => { this.ChangePage(4, 0); }),
            new TicTacToe(
                this.supremus,
                () => { this.ChangePage(5, 0); })
        ];

        this.curPage = this.pages[0];
        this.curPage.Show('arriveTopFg');

        this.supremus.classList.add('blocked');
        setTimeout(() => this.supremus.classList.remove('blocked'), 3000);

        if (!IsMobile) { this.InitMouseMove(this.curPage); }
        this.InitShapesMove(this.curPage);
    }

    InitMouseMove(page) {
        setTimeout(() => {
            page.page.style.transform = '';
            page.page.onmousemove = page.page.onmousemove ?? ((e) => {
                page.page.style.transform = 'rotate3d(0, 1, 0,' + (e.clientX - window.innerWidth / 2) / 60 + 'deg) ' +
                    'rotate3d(1, 0, 0,' + -(e.clientY - window.innerHeight / 2) / 30 + 'deg)';
            });
        }, 3000);
    }

    InitShapesMove(page) {
        this.handlers.forEach(index => {
            clearTimeout(index);
        });
        this.handlers = [];

        setTimeout(() => {
            page.page.querySelectorAll('.move').forEach((shape, index) => {
                const move = (obj, index) => {
                    obj.style.transform = "translate(" + randomInt(-10, 10) + "px, " + randomInt(-10, 10) + "px)";
                    this.handlers[index] = setTimeout(move, 3000, obj, index);
                }

                this.handlers.push(setTimeout(move, randomInt(0, 3000), shape, index));
            })
        }, 3000);
    }

    GetClasses(from, to) {
        switch (from) {
            case 0:
                switch (to) {
                    case 1: return ['leaveRightFg', 'arriveLeftBg'];
                    case 2: return ['leaveLeftFg', 'arriveRightBg'];
                    default: return ['leaveTopFg', 'arriveTopBg'];
                }
            case 1: return ['leaveLeftBg', 'arriveRightFg'];
            case 2: return ['leaveRightBg', 'arriveLeftFg'];
            default: return ['leaveTopBg', 'arriveTopFg'];
        }
    }

    ChangePage(from, to) {
        let [fromClass, toClass] = this.GetClasses(from, to);
        this.pages[from].Leave(fromClass);
        this.pages[to].Show(toClass);

        if (!IsMobile) { this.InitMouseMove(this.pages[to]); }
        this.InitShapesMove(this.pages[to]);

        this.curPage = this.pages[to];

        this.supremus.classList.add('blocked');
        setTimeout(() => this.supremus.classList.remove('blocked'), 3000);
    }

    ClearEvent() {
        this.handlers.forEach(index => {
            clearTimeout(index);
        });
    }
}