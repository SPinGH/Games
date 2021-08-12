import { createDiv, createSVGElement } from '@/utils.js';
import { Themes as AllThemes, IsMobile } from '@/constants.js';

const THEMES = AllThemes.filter(theme => theme.name !== 'Supremus');

export default class Themes {

    constructor(element, toMenu, changeTheme, clearEvents) {
        this.rootElement = element;
        this.posY = 0;
        this.deltaY;

        [this.page, this.themes, this.rightArrow] = GetThemes();
        this.container = this.page.children[0];

        this.themes.forEach((theme, index) => {
            theme.addEventListener('click', () => {
                this.page.classList.add('leaveRightBg');
                this.rightArrow.remove();

                clearEvents();
                this.rootElement.classList.add('blocked');

                setTimeout(() => {
                    this.rootElement.classList.remove('blocked');
                    this.rootElement.remove();
                    changeTheme(THEMES[index]);
                }, 3000);
            });
        });

        this.rightArrow.addEventListener('click', toMenu);

        if (IsMobile) {
            this.page.addEventListener('touchstart', this.OnTouchStart);
            this.page.addEventListener('touchmove', this.OnTouchMove);
        } else {
            this.page.addEventListener('wheel', this.OnWheel);
        }
    }

    OnTouchStart = (event) => {
        this.deltaY = event.touches[0].screenY;
    }

    OnTouchMove = (event) => {
        if (this.container.clientHeight < window.innerHeight) { return; }
        let dy = event.touches[0].screenY - this.deltaY;
        if (Math.abs(dy) > 15) {
            dy = dy > 0 ? this.container.clientHeight / 2 : -this.container.clientHeight / 2;
        }
        if (this.posY + dy > 0) {
            dy = -this.posY;
        } else if (this.posY + dy < -(this.container.clientHeight - window.innerHeight + 100)) {
            dy = -(this.container.clientHeight - window.innerHeight + 100) - this.posY;
        }
        this.posY += dy;
        this.container.style.transform = `translateY(${this.posY + "px"})`;
        this.deltaY = event.touches[0].screenY;
    }

    OnWheel = (event) => {
        if (this.container.clientHeight < window.innerHeight) { return; }
        let delta = event.deltaY > 0 ? 100 : -100;
        if (this.posY - delta <= 0 && this.posY - delta >= -(this.container.clientHeight - window.innerHeight + 100)) {
            this.posY -= delta;
            this.container.style.transform = `translateY(${this.posY + "px"})`;
        }
    }

    Show(className) {
        this.rootElement.insertAdjacentElement('beforeEnd', this.page);

        this.page.classList.add(className);

        setTimeout(() => {
            this.page.classList.remove(className);
            this.rootElement.insertAdjacentElement('afterBegin', this.rightArrow);
        }, 3000)
    }

    Leave(className) {
        this.page.classList.add(className);
        this.rightArrow.remove();

        setTimeout(() => {
            this.page.classList.remove(className);
            this.page.remove();
        }, 3000)
    }
}

function GetThemes() {
    let page = createDiv('page', `<svg width="100%" viewBox="0 0 1920 ${THEMES.length * 300 + 100}"></svg>`);
    let themes = THEMES.map((theme, index) => {
        let item = createSVGElement('g', { 'class': 'theme' }, GetItem(theme.name, index));
        page.children[0].append(item);
        return item;
    });
    return [page, themes,
        createDiv("right", `
    <svg class="right__arrow" viewBox="0 0 443.52 443.52">
        <path fill="rgba(54, 56, 171, 0.2)" d="M143.492,221.863L336.226,29.129c6.663-6.664,6.663-17.468,0-24.132c-6.665-6.662-17.468-6.662-24.132,0l-204.8,204.8c-6.662,6.664-6.662,17.468,0,24.132l204.8,204.8c6.78,6.548,17.584,6.36,24.132-0.42c6.387-6.614,6.387-17.099,0-23.712L143.492,221.863z"/>
    </svg>`)];
}

function GetItem(text, index) {
    let deltaX = 0;
    if (text.length < 13) {
        deltaX = 360 - (58 * text.length) / 2;
    }
    let deltaY = 300 * index;
    switch (index % 6) {
        case 0:
            return `
            <g class="move">
                <path fill="#C6A720" d="M501.3,${249.3 + deltaY}l739.4,8.6l0.8,-109.7l-739.3,-32.5Z"></path>
                <text transform="matrix(0.9994 3.489801e-02 -3.489801e-02 0.9994 ${deltaX * Math.cos(0.0523599) + 514.6745} ${deltaX * Math.sin(0.0523599) + 206.7878 + deltaY})" fill="#FFFFFF" font-family="Arial" font-weight="900" font-size="84px">${text}</text>
            </g>
            <path class="move" fill="#C6A720" d="M928,${272.7 + deltaY}l307.1,0.3l-0.5,-7.2l-307.1,-1.9Z" />
            <path class="move" fill="#05050F" d="M1225,${224.7 + deltaY}l21.8,25.9l21.7,25.8l-33.3,5.9l-33.3,6.0l11.6,-31.8Z" />
            <ellipse class="move" fill="#941D1D" cx="565.8" cy="${123.6 + deltaY}" rx="25.1" ry="51.5"/>`;
        case 1:
            return `
            <path class="move" fill="#3638AB" d="M1745.4,${139.6 + deltaY}l-529.3,-17.5l-3.3,-19.9l533.2,18.0" />
            <path class="move" fill="#3638AB" d="M1687.5,${286.7 + deltaY}l-210.9,-0.9l-1.8,-7.2l212.5,1.1Z" />
            <g class="move">
                <path fill="#3638AB" d="M1742.1,${272.3 + deltaY}l-739.4,-18.1l-4.5,-122.3l747.6,20.5Z" />
                <text transform="matrix(0.9998 1.745130e-02 -1.745130e-02 0.9998 ${deltaX * Math.cos(0.0523599) + 1018.96} ${deltaX * Math.sin(0.0523599) + 219.1961 + deltaY})" fill="#FFFFFF" font-family="Arial" font-weight="900" font-size="84px">${text}</text>
            </g>
            <circle class="move" fill="#2D122A" cx="1684.6" cy="${278.4 + deltaY}" r="28.3"/>
            <path class="move" fill="#23372C" d="M1143,${180.8 + deltaY}l-106.4,4.7l0.8,-106.4l106.3,5.5Z" />`;
        case 2:
            return `
            <path class="move" fill="#941D1D" d="M222.4,${191.9 + deltaY}l33.1,0.0l3.2,-133.5l-31.0,-2.1Z" />
            <path class="move" fill="#941D1D" d="M230.1,${39.7 + deltaY}l398.5,13.7l-5.1,-8.3l-395.6,-15.3Z" />
            <g class="move">
                <path fill="#941D1D" d="M268.3,${185.4 + deltaY}l714.9,3.4l0.0,-109.7l-714.9,-27.3Z" />
                <text transform="matrix(0.9998 1.745169e-02 -1.745169e-02 0.9998 ${deltaX * Math.cos(0.0349066) - 20 + 288.96} ${deltaX * Math.sin(0.0349066) + 144.1961 + deltaY})" fill="#FFFFFF" font-family="Arial" font-weight="900" font-size="84px">${text}</text>
            </g>
            <circle class="move" fill="#C6A720" cx="327.1" cy="${55.6 + deltaY}" r="38.4"/>
            <path class="move" fill="#05050F" d="M960.3,${217.8 + deltaY}l-92.0,14.1l-9.6,-93.0l92.8,-5.9Z" />`;
        case 3:
            return `
            <path class="move" fill="#3638AB" d="M1149.4,${194.3 + deltaY}l-417.2,27.5l2.6,-9.5l411.3,-27.6Z" />
            <g class="move">
                <path fill="#3638AB" d="M1411.3,${150.7 + deltaY}l-696.3,52.8l-0.8,-122.5l686.2,-57.4Z" />
                <text transform="matrix(0.9962 -8.715685e-02 8.715685e-02 0.9962 ${deltaX * Math.cos(0.0349066) + 732.6008} ${deltaX * Math.sin(0.0349066) + 166.4802 + deltaY})" fill="#FFFFFF" font-family="Arial" font-weight="900" font-size="84px">${text}</text>
            </g>
            <ellipse class="move" fill="#23372C" cx="1342.1" cy="${18.1 + deltaY}" rx="76" ry="35.9"/>
            <path class="move" fill="#2D122A" d="M671.1,${216.2 + deltaY}l12.7,-37.7l12.6,-37.7l74.5,46.0l74.5,46.0l-87.1,-8.3Z" />`;
        case 4:
            return `
            <g class="move">
                <path fill="#C6A720" d="M304.3,${228.8 + deltaY}l710.1,19.6l4.1,-130.4l-712.1,-12.2Z" />
                <text transform="matrix(0.9998 1.745204e-02 -1.745204e-02 0.9998 ${deltaX * Math.cos(0.0349066) + 318.9606} ${deltaX * Math.sin(0.0349066) + 191.1965 + deltaY})" fill="#FFFFFF" font-family="Arial" font-weight="900" font-size="84px">${text}</text>
            </g>
            <path class="move" fill="#C6A720" d="M349.6,${255.5 + deltaY}l393.1,5.2l0.3,-7.6l-393.0,-6.9Z" />
            <path class="move" fill="#05050F" d="M434.8,${197.5 + deltaY}l-64.8,48.4l-64.8,48.3l-22.7,-57.7l-22.7,-57.7l87.5,9.4Z" />
            <ellipse class="move" fill="#941D1D" cx="914.2" cy="${90.3 + deltaY}" rx="39.2" ry="76.4"/>`;
        case 5:
            return `
            <g class="move">
                <path fill="#941D1D" d="M1438.1,${294.1 + deltaY}l-670.3,-47.6l17.4,-130.0l662.1,35.2Z" />
                <text transform="matrix(0.9976 6.975625e-02 -6.975625e-02 0.9976 ${deltaX * Math.cos(0.0349066) + 787.2977} ${deltaX * Math.sin(0.0349066) + 201.6514 + deltaY})" fill="#FFFFFF" font-family="Arial" font-weight="900" font-size="84px">${text}</text>
            </g>
            <path class="move" fill="#941D1D" d="M1434.8,${142.9 + deltaY}l-306.0,-16.8l5.4,-7.9l303.7,14.8Z" />
            <path class="move" fill="#C6A720" d="M1317.1,${177.4 + deltaY}l54.6,8.0l54.7,8.0l-20.4,-51.4l-20.5,-51.3l-34.2,43.4Z" />
            <ellipse class="move" fill="#05050F" cx="848.5" cy="${252.4 + deltaY}" rx="49.7" ry="65.8"/>`
        default: break;
    }
}