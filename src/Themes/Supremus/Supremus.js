import { createDiv, randomInt } from '@/utils.js';
import Themes from './Themes.js';
import Menu from './Menu.js';
import About from './About.js';
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
                () => { this.ChangePage(0, 2); }),
            new Themes(
                this.supremus,
                () => { this.ChangePage(1, 0); },
                changeTheme),
            new About(
                this.supremus,
                () => { this.ChangePage(2, 0); }
            )
        ];

        this.curPage = this.pages[0];
        this.curPage.Show('arriveTopFg');

        this.InitMouseMove(this.curPage);
        this.InitShapesMove(this.curPage);
    }

    InitMouseMove(page) {
        this.curPage.page.onmousemove = null;

        setTimeout(() => {
            page.page.style.transform = '';
            page.page.onmousemove = (e) => {
                page.page.style.transform = 'rotate3d(0, 1, 0,' + (e.clientX - window.innerWidth / 2) / 60 + 'deg) ' +
                    'rotate3d(1, 0, 0,' + -(e.clientY - window.innerHeight / 2) / 30 + 'deg)';
            }
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

        this.InitMouseMove(this.pages[to]);
        this.InitShapesMove(this.pages[to]);

        this.curPage = this.pages[to];
    }
}