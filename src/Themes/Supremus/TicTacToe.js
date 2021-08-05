import { TicTacToe as Game } from '@/Games/TicTacToe.js';
import { createDiv, createSVGElement } from '@/utils.js';

export default class TicTacToe {
    constructor(element, toMenu) {
        this.rootElement = element;
        this.isBlocked = false;
        this.game = new Game(this.OnMatrixChanged.bind(this), this.OnCrossChanged.bind(this));

        [this.bg, this.page, this.playerO, this.playerX, this.backArrow, this.reset,
        this.matrixO, this.matrixX, this.matrix, this.crossLines, this.blocker, this.settings,
        this.setX, this.setO, this.easy, this.medium, this.hard, this.playAlone, this.playTogether] = GetTicTacToe();

        this.matrix.forEach((item, index) => { item.addEventListener('click', this.OnClick.bind(this, index)); });

        this.backArrow.addEventListener('click', toMenu);
        this.reset.addEventListener('click', this.game.Reset.bind(this.game));
        this.settings.addEventListener('click', this.OpenSettings.bind(this));
        this.blocker.addEventListener('click', this.CloseSetting.bind(this));

        this.setX.addEventListener('click', () => {
            if (this.isBlocked) return;
            this.game.firstPlayer = 'X';
            this.game.secondPlayer = 'O';
            this.ShowSetX();
        });
        this.setO.addEventListener('click', () => {
            if (this.isBlocked) return;
            this.game.firstPlayer = 'O';
            this.game.secondPlayer = 'X';
            this.ShowSetO();
        });
        this.playAlone.addEventListener('click', () => {
            if (this.isBlocked) return;
            this.game.withAI = true;
            this.ShowPlayAlone();
            this.OpenDifficulty();
        })
        this.playTogether.addEventListener('click', () => {
            if (this.isBlocked) return;
            this.game.withAI = false;
            this.ShowPlayTogether();
            this.CloseDifficulty();
        })
        this.easy.addEventListener('click', () => {
            if (this.isBlocked) return;
            this.game.difficultyLevel = 0;
            this.OpenDifficulty();
        });
        this.medium.addEventListener('click', () => {
            if (this.isBlocked) return;
            this.game.difficultyLevel = 1;
            this.OpenDifficulty();
        });
        this.hard.addEventListener('click', () => {
            if (this.isBlocked) return;
            this.game.difficultyLevel = 2;
            this.OpenDifficulty();
        });
    }

    ShowSetX() {
        this.setX.setAttribute('d', 'M761,318.8l-96.4,27.6L637,250l96.4-26.6z');
        this.setO.setAttribute('r', '25.6');
    }

    ShowSetO() {
        this.setX.setAttribute('d', 'M724.7,299.1l-38.3,11l-11-38.3l38.3-10z');
        this.setO.setAttribute('r', '53');
    }

    ShowPlayAlone() {
        this.playAlone.setAttribute('d', 'M757,455l38.2-15.8l55.5,125.1l-38.2,16.8z');
        this.playTogether.children[0].setAttribute('cx', '911.5');
        this.playTogether.children[0].setAttribute('cy', '429.6');
        this.playTogether.children[0].setAttribute('r', '23.6');
        this.playTogether.children[1].setAttribute('d', 'M906.7,481.2l42.6-15.7l-4.7-12.8l-8.1,2.6l-1.5-28.3z');
    }

    ShowPlayTogether() {
        this.playAlone.setAttribute('d', 'M777.5,476.6l16.7-6.4l24.3,54.2l-16.7,7.4z');
        this.playTogether.children[0].setAttribute('cx', '906.7');
        this.playTogether.children[0].setAttribute('cy', '420.2');
        this.playTogether.children[0].setAttribute('r', '39.4');
        this.playTogether.children[1].setAttribute('d', 'M898.7,506.4l71.3-26.2l-7.9-21.4l-13.5,4.4l-2.5-47.3z');
    }

    ShowCurrentPlayer() {
        if (this.game.IsNext('X')) {
            this.playerX.setAttribute('d', 'M1176.39 121.98l106.61 17.4-17.4 106.61-106.61-17.4z');
            this.playerO.setAttribute('r', 24);
        } else {
            this.playerX.setAttribute('d', 'M1226.39 171.98l36.61 17.4-17.4 36.61-36.61-17.4z');
            this.playerO.setAttribute('r', 54);
        }
    }

    OnClick(index) {
        if (this.isBlocked) return;
        this.game.HandleClick(index);
        this.isBlocked = true;
        setTimeout(() => {
            this.isBlocked = false;
        }, 500);
    }

    OpenDifficulty() {
        this.easy.style.transform = this.game.difficultyLevel === 0 ? 'scale(1.5) translate(-290px, -220px)' : '';
        this.medium.style.transform = this.game.difficultyLevel === 1 ? 'scale(1.5) translate(-320px, -220px)' : '';
        this.hard.style.transform = this.game.difficultyLevel === 2 ? 'scale(1.5) translate(-340px, -210px)' : '';
        this.easy.style.visibility = 'visible';
        this.medium.style.visibility = 'visible';
        this.hard.style.visibility = 'visible';
    }

    CloseDifficulty() {
        this.easy.style.transform = 'scale(0.6) translate(450px, 145px)';
        this.medium.style.transform = 'scale(0.5) translate(645px, 355px)';
        this.hard.style.transform = 'scale(0.5) translate(585px, 410px)';
        setTimeout(() => {
            this.easy.style.visibility = 'hidden';
            this.medium.style.visibility = 'hidden';
            this.hard.style.visibility = 'hidden';
        }, 1000)
    }

    OpenSettings() {
        if (this.isBlocked) { return; }
        this.isBlocked = true;
        setTimeout(() => {
            this.isBlocked = false;
        }, 1000);

        this.game.Reset();
        this.blocker.style.display = 'block';

        this.settings.children[0].setAttribute('d', 'M1166.34,776.11l-242.52,125.11l-122.65,-237.75l-226.26,-438.59l242.52,-125.11l224.48,435.14Z');
        this.settings.children[1].setAttribute('d', 'M1118,768.2l-18.4,9.6l-14.2-27.6c-0.5,0-0.9,0-1.4,0c-13.4,0-24.2-10.8-24.2-24.2c0-5.8,2-11.1,5.4-15.3l10,19.4l18.4-9.5l-9.7-18.8h0c13.4,0,24.2,10.8,24.2,24.2c0,5.3-1.7,10.2-4.6,14.2z');
        this.settings.classList.remove('clickable');

        this.playAlone.style.transform = 'scale(1)';
        setTimeout(() => this.playTogether.style.transform = 'scale(1)', 100);
        setTimeout(() => this.setX.style.transform = 'scale(1)', 200);
        setTimeout(() => this.setO.style.transform = 'scale(1)', 300);

        if (this.game.firstPlayer === 'X') { this.ShowSetX(); }
        else { this.ShowSetO(); }

        if (this.game.withAI) {
            this.ShowPlayAlone();
            setTimeout(this.OpenDifficulty.bind(this), 1000);
        } else {
            this.ShowPlayTogether();
        }

        BG.forEach(({ dMoved }, index) => {
            this.bg[index].setAttribute('d', dMoved);
        })
        this.playerO.setAttribute('cx', '1651.6');
        this.playerO.setAttribute('cy', '260.7');
        this.reset.children[0].setAttribute('d', 'M1511.9,665l-75.5-35.8l22.7-15.6c-12.7-15.6-20.2-35.5-20.2-57.2c0-50.3,40.7-91,91-91c26.3,0,50,11.2,66.6,29c-7.4-2-15.2-3-23.3-3c-50.3,0-91,40.8-91,91c0,5,0.4,9.8,1.2,14.5l21.7-14.9z');
        this.backArrow.children[0].setAttribute('d', 'M1218.9,948.2l217.5-18l217.5-18l-106.7,34.2l-106.7,34.2l-110.9-16.3z');
    }

    CloseSetting() {
        if (this.isBlocked) { return; }
        this.isBlocked = true;
        setTimeout(() => {
            this.isBlocked = false;
        }, 1000);
        this.blocker.style.display = 'none';

        this.settings.children[0].setAttribute('d', 'M1754.7,490.6l-18.5,9.5l-10.0,-19.3l-16.5,-32.1l18.4,-9.5l16.9,32.6Z');
        this.settings.children[1].setAttribute('d', 'M1779,538.2l-18.4,9.6l-14.2-27.6c-0.5,0-0.9,0-1.4,0c-13.4,0-24.2-10.8-24.2-24.2c0-5.8,2-11.1,5.4-15.3l10,19.4l18.4-9.5l-9.7-18.8h0c13.4,0,24.2,10.8,24.2,24.2c0,5.3-1.7,10.2-4.6,14.2z');
        this.settings.classList.add('clickable');

        this.setX.style.transform = 'scale(0)';
        setTimeout(() => this.setO.style.transform = 'scale(0)', 100);
        setTimeout(() => this.playAlone.style.transform = 'scale(0)', 200);
        setTimeout(() => this.playTogether.style.transform = 'scale(0)', 300);
        setTimeout(() => this.easy.style.transform = 'scale(0)', 400);
        setTimeout(() => this.medium.style.transform = 'scale(0)', 500);
        setTimeout(() => this.hard.style.transform = 'scale(0)', 600);
        setTimeout(() => {
            this.easy.style.transform = 'scale(0.6) translate(450px, 145px)';
            this.medium.style.transform = 'scale(0.5) translate(645px, 355px)';
            this.hard.style.transform = 'scale(0.5) translate(585px, 410px)';
            this.easy.style.visibility = 'hidden';
            this.medium.style.visibility = 'hidden';
            this.hard.style.visibility = 'hidden';
        }, 1000);

        BG.forEach(({ d }, index) => {
            this.bg[index].setAttribute('d', d);
        })
        this.playerO.setAttribute('cx', '1447.58');
        this.playerO.setAttribute('cy', '285.4');
        this.reset.children[0].setAttribute('d', 'M1344,721.9l-75.5-35.8l22.7-15.6c-12.7-15.6-20.2-35.5-20.2-57.2c0-50.3,40.7-91,91-91c26.3,0,50,11.2,66.6,29c-7.4-2-15.2-3-23.3-3c-50.3,0-91,40.8-91,91c0,5,0.4,9.8,1.2,14.5l21.7-14.9Z');
        this.backArrow.children[0].setAttribute('d', 'M821.96 926.63l218.27 1.26 218.27 1.25-109.28 24.7-109.28 24.69-109-26z');
        this.ShowCurrentPlayer();
    }

    OnMatrixChanged(index) {
        this.ShowCurrentPlayer();

        if (index !== null) {
            if (this.game.matrix[index] === 'X') {
                this.matrixX[index].style.transform = 'scale(1)';
            } else {
                this.matrixO[index].style.transform = 'scale(1)';
            }
        } else {
            this.isBlocked = true;
            this.matrixX.forEach((item, index) => setTimeout(() => item.style.transform = 'scale(0)', 100 * index));
            this.matrixO.forEach((item, index) => setTimeout(() => item.style.transform = 'scale(0)', 100 * index));
            setTimeout(() => this.isBlocked = false, 1000);
        }

    }

    OnCrossChanged() {
        if (this.game.cross !== null) {
            this.crossLines[this.game.cross].style.transform = 'translateX(0)';
        } else {
            this.crossLines.forEach(item => item.style.transform = 'translateX(-100%)');
        }

    }

    Show(className) {
        this.rootElement.insertAdjacentElement('beforeEnd', this.page);

        this.page.classList.add(className);

        setTimeout(() => {
            this.page.classList.remove(className);
        }, 3000)
    }

    Leave(className) {
        this.page.classList.add(className);

        setTimeout(() => {
            this.page.classList.remove(className);
            this.page.remove();
        }, 3000)
    }
}

let BG = [
    { d: 'M138.76,638.07l243.35 20.86-.87 10.24-243.36-20.86z', fill: '#9b0d0c', dMoved: 'M40.9,638.8L276.8,659l-0.8,9.9L40.1,648.7z' },
    { d: 'M187.53,618.12l30.55,2.59l-0.68,7.92l-30.55,-2.62z', fill: '#9b0d0c', dMoved: 'M128.8,608.8l29.6,2.5l-0.7,7.7l-29.6-2.5z' },
    { d: 'M716.53 696.1l30.55 2.61-.68 7.92-30.54-2.62z', fill: '#9b0d0c', dMoved: 'M362.2,643.7l29.6,2.5l-0.7,7.7l-29.6-2.5z' },
    { d: 'M914.11 718.42h30.66v13.94h-30.66z', fill: '#baa85d', dMoved: 'M614.11,788.42h30.66v13.94h-30.66z' },
    { d: 'M252.27 667.16l282.88 24.25-1.17 13.58-282.87-24.28z', fill: '#9b0d0c', dMoved: 'M163.7,698.4l274.1,23.5l-1.1,13.2l-274.1-23.5z' },
    { d: 'M605.58,747.22l432.1,0l0,12.49l-432.1,0z', fill: '#435387', dMoved: 'M297.5,877.8l416.7-41l1.2,12l-416.7,41z' },
    { d: 'M791.37 879.71l797 1.63-8.17-35-788.83 9.76z', fill: '#435387', dMoved: 'M1092.7,919.9l794.2-66.3l-11.1-34.2l-785.1,77z' },
    { d: 'M1551.37,801.36l-646.68,0l-5.29-15l646,2z', fill: '#435387', dMoved: 'M1887,771.4l-642.4,74.1l-7-14.3l642-72z' },
    { d: 'M326.85 634.42l282.83 24.29-.78 9-282.83-24.24z', fill: '#9b0d0c', dMoved: 'M20.8,524.8l274.9-8.3l0.3,8.8l-274.9,8.3z' },
    { d: 'M473.48 662.71l407.08 34.9-.68 7.92-407.08-34.82z', fill: '#9b0d0c', dMoved: 'M150,588l394.5,33.8l-0.7,7.7l-394.5-33.7z' },
    { d: 'M879.82 494.19l462.69-125.31 2.62 9.68-462.69 125.31z', fill: '#435387', dMoved: 'M1308.5,368.9l473.2-76.3l1.6,9.9l-473.2,76.3z' },
    { d: 'M1053.68 383.88l-527 145.2-4.75-8.08 530.55-141.83z', fill: '#435387', dMoved: 'M1756.7,174.5l-531.2,129l-4.5-8.2l534.7-125.5z' },
    { d: 'M729.55 553.35l110.68-30.13 3.73 13.71-110.68 30.13z', fill: '#b4c4b9', dMoved: 'M553,651.2l113.9,13.3l-1.7,14.1l-113.9-13.3z' },
    { d: 'M1084.6 396.46l439.13-119.56 1.54 5.68-439.12 119.55z', fill: '#435387', dMoved: 'M1138.6,380.3l439.1-119.6l1.5,5.7L1140.2,386z' },
    { d: 'M1325.68 158.6l5.54 21.26-214.41 56.72-5.54-21.27z', fill: '#b4c4b9', dMoved: 'M1325.7,158.6l5.5,21.3l-214.4,56.7l-5.5-21.3z' },
    { d: 'M1499.75 439.34l8.62 18.82-388.41 179.83-8.61-18.83z', fill: '#435387', dMoved: 'M1755.8,348.4l3.1,20.5l-422.8,66.7l-3.1-20.5z' },
    { d: 'M1281.86 706.59l-7.94-10.47 142.21-107.83 7.94 10.47z', fill: '#baa85d', dMoved: 'M1421.7,692.4l-7.9-10.5L1556,574.1l7.9,10.5z' },
    { d: 'M1730.22 421.71l2.37-1.23 46.76 90.63-2.38 1.23z', fill: '#baa85d', dMoved: 'M1730.2,421.7l2.4-1.2l46.8,90.6l-2.4,1.2z' },
    { d: 'M1738.06 527.45l3-1.57 21.25 41.18-3 1.56z', fill: '#435387', dMoved: 'M1738.1,527.5l3-1.6l21.3,41.2l-3,1.6z' },
    { d: 'M1687.94 427.71l3-1.57 39.52 76.61-3 1.56z', fill: '#baa85d', dMoved: 'M1687.9,427.7l3-1.6l39.5,76.6l-3,1.6z' },
    { d: 'M108.91 292.95l791.77 42.88-1.85 34-791.8-42.88z', fill: '#baa85d', dMoved: 'M35.9,288.2l399-68.9l3,17.1l-399,69z' },
    { d: 'M345.55 794.64l-29.33-3.65-29.33-3.64 57.61-392.73 44.12-300.91 6.79 1.84-21.58 302.71z', fill: '#2d2d2d', dMoved: 'M335.5,801.2l-28.4-3.5l-28.4-3.5l55.8-380.6L377.2,122l6.6,1.8l-20.9,293.3z' },
    { d: 'M685.25 134.57l151.95 31.74-150.52 720.4-151.91-31.8z', fill: '#2d2d2d', dMoved: 'M437.3,475.7l107.1,22.4L438.3,1006l-107.1-22.4z' },
];

function GetTicTacToe() {
    let page = createDiv('page', `<svg class="menu" height="100%" width="100%" viewBox="0 0 1920 1080"></svg>`);

    let bg = BG.map(({ d, fill }) => {
        let item = createSVGElement('path', { 'class': 'move', d, fill });
        page.children[0].append(item);
        return item;
    });

    let playerO = createSVGElement('circle', { 'class': 'move', 'cx': '1447.58', 'cy': '285.4', 'r': '24', 'fill': '#9b0d0c' });
    let playerX = createSVGElement('path', { 'class': 'move', d: 'M1176.39 121.98l106.61 17.4-17.4 106.61-106.61-17.4z', 'fill': '9b0d0c' });
    page.children[0].append(playerO);
    page.children[0].append(playerX);

    let backArrow = createSVGElement('g', { 'class': 'move clickable' }, '<path class="stroke" d="M821.96 926.63l218.27 1.26 218.27 1.25-109.28 24.7-109.28 24.69-109-26z" fill="#9b0d0c" />');
    let reset = createSVGElement('g', { 'class': 'move clickable' }, '<path class="stroke" fill="#2D122A" d="M1344,721.9l-75.5-35.8l22.7-15.6c-12.7-15.6-20.2-35.5-20.2-57.2c0-50.3,40.7-91,91-91c26.3,0,50,11.2,66.6,29c-7.4-2-15.2-3-23.3-3c-50.3,0-91,40.8-91,91c0,5,0.4,9.8,1.2,14.5l21.7-14.9Z"/>');
    page.children[0].append(backArrow);
    page.children[0].append(reset);

    let matrixO = [
        { cx: 283.88, cy: 199.23, r: 59, fill: "#9b0d0c" },
        { cx: 525.88, cy: 199.23, r: 43, fill: "#2d122a" },
        { cx: 879.88, cy: 291.23, r: 18, fill: "#435387" },
        { cx: 251.38, cy: 460.73, r: 44.5, fill: "#435387" },
        { cx: 500.38, cy: 494.73, r: 80.5, fill: "#9b0d0c" },
        { cx: 848.32, cy: 520.23, r: 37.5, fill: "#9b0d0c" },
        { cx: 242.88, cy: 721.23, r: 18, fill: "#2d122a" },
        { cx: 473.38, cy: 758.73, r: 31.5, fill: "#baa85d" },
        { cx: 780.38, cy: 766.73, r: 32.5, fill: "#2d122a" },
    ].map(options => {
        let item = createSVGElement('circle', options);
        item.style.transform = 'scale(0)';
        page.children[0].append(item);
        return item;
    });

    let matrixX = [
        { d: "M204.95 127.12l128.53 11.59-11.57 128.5-128.53-11.56z", fill: "#9b0d0c" },
        { d: "M483.77 146.62l107.63 9.23-9.23 107.62-107.63-9.23z", fill: "#2d122a" },
        { d: "M850.31 263.85l34.89 15.29-15.3 34.9-34.89-15.33z", fill: "#435387" },
        { d: "M190.77 387.63l107.63 9.22-13.54 157.86-107.63-9.22z", fill: "#435387" },
        { d: "M421.15 404.71l158.64 25.9-25.89 158.68-158.64-25.9z", fill: "#9b0d0c" },
        { d: "M817.78 470.6l45.31 3.89-9.23 107.62-45.3-3.88z", fill: "#9b0d0c" },
        { d: "M217.55 699.87l48.82 10-10 48.82-48.79-9.98z", fill: "#2d122a" },
        { d: "M400.79 718.62l107.63 9.23-5.42 63.17-107.62-9.23z", fill: "#baa85d" },
        { d: "M746.01 736.3l50.06-3.24 3.25 50.06-50.06 3.25z", fill: "#2d122a" }
    ].map(options => {
        let item = createSVGElement('path', options);
        item.style.transform = 'scale(0)';
        page.children[0].append(item);
        return item;
    });

    let matrix = [
        { d: "M357.44 306.42 395.41 43.25 118.87 28.75 84.03 291.23", fill: "#ffffff00" },
        { d: "M380.56 307.62 646.36 322.01 699.27 70.26 399.79 43.35 395.68 95.54 380.56 307.62z", fill: "#ffffff00" },
        { d: "M802.9 330.54 960.34 339.52 991.13 110.55 852.43 93.43 802.9 330.54z", fill: "#ffffff00" },
        { d: "M306.68 652.47 352.47 340.27 38.87 323.2 12.41 626.95 306.68 652.47z", fill: "#ffffff00" },
        { d: "M356.8 636.99 576.36 655.81 639.04 355.79 377.87 341.64 356.8 636.99z", fill: "#ffffff00" },
        { d: "M955.27 704.37 728.93 684.66 795.44 364.34 984.79 374.87 955.27 704.37z", fill: "#ffffff00" },
        { d: "M305.19 662.66 59 641.65 49.96 784.62 283.78 808.88 305.19 662.66z", fill: "#ffffff00" },
        { d: "M356.15 646.06 574.49 664.77 529 883.46 340.81 857.13 356.15 646.06z", fill: "#ffffff00" },
        { d: "M727.02 692.43 981.45 714.23 944.51 905.84 680.36 911.52", fill: "#ffffff00" }
    ].map(options => {
        let item = createSVGElement('path', { 'class': 'clickable', ...options });
        page.children[0].append(item);
        return item;
    });

    let crossLines = [
        { x1: 54.38, y1: 168.38, x2: 996.17, y2: 227.16 },
        { x1: 10.59, y1: 480.87, x2: 973.28, y2: 539.89 },
        { x1: 49.96, y1: 695.49, x2: 933.79, y2: 768.05 },
        { x1: 280.99, y1: 10.88, x2: 198.74, y2: 893.87 },
        { x1: 563.4, y1: 43.25, x2: 486.19, y2: 1004.65 },
        { x1: 919.03, y1: 93.43, x2: 746.71, y2: 963.32 },
        { x1: 129.64, y1: 90.14, x2: 852.55, y2: 832.81 },
        { x1: 960.34, y1: 199.56, x2: 115.43, y2: 799.81 }
    ].map(options => {
        let item = createSVGElement('line', { 'stroke': "#9b0d0c", 'stroke-width': "20px", 'stroke-linecap': "square", ...options });
        item.style.transform = 'translateX(-100%)';
        page.children[0].append(item);
        return item;
    });

    let blocker = createSVGElement('path', { 'class': 'clickable', 'd': 'M0,0l1920,0l0,1080l-1920,0Z', 'fill': '#ffffff00' });
    blocker.style.display = 'none';
    page.children[0].append(blocker);

    let settings = createSVGElement('g', { 'class': 'move clickable' }, '<path fill="#B4C4B9" d="M1754.7,490.6l-18.5,9.5l-10.0,-19.3l-16.5,-32.1l18.4,-9.5l16.9,32.6Z" /><path class="stroke" fill="#2D122A" d="M1779,538.2l-18.4,9.6l-14.2-27.6c-0.5,0-0.9,0-1.4,0c-13.4,0-24.2-10.8-24.2-24.2c0-5.8,2-11.1,5.4-15.3l10,19.4l18.4-9.5l-9.7-18.8h0c13.4,0,24.2,10.8,24.2,24.2c0,5.3-1.7,10.2-4.6,14.2z"/>');
    page.children[0].append(settings);

    let setX = createSVGElement('path', { 'class': 'clickable', d: 'M761,318.8l-96.4,27.6L637,250l96.4-26.6z', fill: '#2D122A' });
    let setO = createSVGElement('circle', { 'class': 'clickable', cx: '814.5', cy: '234.4', r: '25.6', fill: '#2D122A' });

    setX.style.transform = 'scale(0)';
    setO.style.transform = 'scale(0)';

    let easy = createSVGElement('path', { 'class': 'clickable', 'stroke-width': '5px', d: 'M858,656l15.6,-4.5l14.7,51.5l-15.6,4.5z', fill: '#23372C' });
    let medium = createSVGElement('g', { 'class': 'clickable', 'stroke-width': '5px' }, '<circle fill="#BAA85D" cx="946.56" cy="638.51" r="19.67"/><path fill="#BAA85D" d="M942.59,681.58l35.59,-13.08l-3.93,-10.7l-6.75,2.19l-2.4,-27.08Z"/>');
    let hard = createSVGElement('g', { 'class': 'clickable', 'stroke-width': '5px' }, '<path fill="#941D1D" d="M1038.63,610.43c4.75,8.55,1.67,19.32-6.88,24.07c-8.55,4.75-19.32,1.67-24.07-6.88c-0.34-0.61-0.64-1.24-0.9-1.87l17.2-24.42C1029.9,601.62,1035.54,604.86,1038.63,610.43z"/><path fill="#941D1D" d="M1008.01,614.84l17.78,-24.28l-4.11,-7.4l-26.65,14.81l4.4,7.91l9.45,-5.25Z"/>');

    easy.style.transform = 'scale(0.6) translate(450px, 145px)';
    medium.style.transform = 'scale(0.5) translate(645px, 355px)';
    hard.style.transform = 'scale(0.5) translate(585px, 410px)';
    easy.style.visibility = 'hidden';
    medium.style.visibility = 'hidden';
    hard.style.visibility = 'hidden';

    let playAlone = createSVGElement('path', { 'class': 'clickable', d: 'M757,455l38.2,-16.8l55.5,126.1l-38.2,16.8z', fill: '#2D122A' });
    let playTogether = createSVGElement('g', { 'class': 'clickable', }, '<circle fill="#2D122A" cx="911.49" cy="429.56" r="23.57"/><path fill="#2D122A" d="M906.74,481.17l42.64,-15.68l-4.71,-12.81l-8.09,2.61l-2.88,-32.43Z"/>');

    playAlone.style.transform = 'scale(0)';
    playTogether.style.transform = 'scale(0)';

    page.children[0].append(setX);
    page.children[0].append(setO);

    page.children[0].append(easy);
    page.children[0].append(medium);
    page.children[0].append(hard);

    page.children[0].append(playAlone);
    page.children[0].append(playTogether);

    return [bg, page, playerO, playerX, backArrow, reset,
        matrixO, matrixX, matrix, crossLines, blocker, settings,
        setX, setO, easy, medium, hard, playAlone, playTogether];
}