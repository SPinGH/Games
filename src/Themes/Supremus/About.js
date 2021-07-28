import { createDiv } from '@/utils.js';

export default class About {

    constructor(element, toMenu) {
        this.rootElement = element;

        [this.leftArrow, this.page] = GetAbout();

        if (this.leftArrow) { this.leftArrow.addEventListener('click', toMenu); }
    }

    Show(className) {
        this.rootElement.insertAdjacentElement('beforeEnd', this.page);

        this.page.classList.add(className);

        setTimeout(() => {
            this.page.classList.remove(className);
            this.rootElement.insertAdjacentElement('afterBegin', this.leftArrow);
        }, 3000)
    }

    Leave(className) {
        this.page.classList.add(className);

        this.leftArrow.remove();

        setTimeout(() => {
            this.page.classList.remove(className);
            this.page.remove();
        }, 3000)
    }
}

function GetAbout() {
    return [createDiv('left', `
    <svg class="left__arrow" viewBox="0 0 443.52 443.52">
        <path fill="rgba(54, 56, 171, 0.2)" d="M143.492,221.863L336.226,29.129c6.663-6.664,6.663-17.468,0-24.132c-6.665-6.662-17.468-6.662-24.132,0l-204.8,204.8c-6.662,6.664-6.662,17.468,0,24.132l204.8,204.8c6.78,6.548,17.584,6.36,24.132-0.42c6.387-6.614,6.387-17.099,0-23.712L143.492,221.863z"/>
    </svg>`),
    createDiv('page', `
    <svg height="100%" width="100%" viewBox="-20 50 1250 700">
        <text font-weight="bold" font-family="Helvetica, Arial, sans-serif" font-size="48" y="270" x="120" fill="#000000">About</text>
    </svg>`)];
}