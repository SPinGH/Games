import { createDiv } from '@/utils.js';

export default class About {

    constructor(element, toMenu) {
        this.rootElement = element;

        [this.leftArrow, this.page] = GetAbout();

        this.leftArrow.addEventListener('click', toMenu);
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
    <svg height="100%" width="100%" viewBox="0 0 1920 1080">
        <polygon class="move" style="fill:#BAA85D;" points="663.5,1000.96 393.01,868.12 122.52,735.28 446.56,417.29 770.59,99.3 717.05,550.13 "/>
        <g class="move">
            <circle style="fill:#23233A;" cx="512" cy="402" r="270"/>
            <polygon style="fill:#92A096;" points="408,270 533,280 542,768 317,688 	"/>
            <polygon style="fill:#92A096;" points="655,263 533,280 542,768 691,690 	"/>
            <polygon style="fill:#8C968E;" points="734,553 691,688 655,263 711,340 	"/>
            <polygon style="fill:#6D7770;" points="517,821 317,688 542,768 	"/>
            <polygon style="fill:#6D7770;" points="691,688 517,821 542,768 	"/>
            <polygon style="fill:#8C968E;" points="373,431 273,527 319,684 	"/>
            <ellipse style="fill:#435387;" cx="619" cy="469" rx="41" ry="23"/>
            <ellipse style="fill:#435387;" cx="452" cy="467" rx="50" ry="26"/>
            <polygon style="fill:#435387;" points="397,418 397,441 460,435 460,415 	"/>
            <polygon style="fill:#334672;" points="495,446 460,435 460,415 509,428 	"/>
            <polygon style="fill:#334672;" points="574,437 610,415 622,435 581,448 	"/>
            <polygon style="fill:#435387;" points="656,417 610,415 622,435 665,437 	"/>
            <polygon style="fill:#334672;" points="678,451 665,437 656,417 678,442 	"/>
            <polygon style="fill:#435387;" points="467,660 470,666 510,658 507,650 	"/>
            <polygon style="fill:#435387;" points="528,644 507,650 510,658 533,657 	"/>
            <polygon style="fill:#435387;" points="547,657 545,651 528,644 533,657 	"/>
            <polygon style="fill:#435387;" points="563,644 545,651 547,657 566,657 	"/>
            <polygon style="fill:#435387;" points="592,657 563,644 566,657 592,662 	"/>
            <polygon style="fill:#435387;" points="610,657 591.84,657 591.84,662 605,662 	"/>
            <polygon style="fill:#3C3C60;" points="533,280 444,200 339,243 354,270 	"/>
            <polygon style="fill:#3C3C60;" points="529.49,279.84 569,209 687,238 678,263 	"/>
            <polygon style="fill:#334672;" points="495.2,553.08 513.78,578.45 579.79,577.06 601,549.94 	"/>
            <polygon style="fill:#435387;" points="525.52,534.45 495.21,553.03 600.8,550.1 569.51,532.5 	"/>
            <polygon style="fill:#334672;" points="522.58,450.37 526.49,534.45 570.49,532.5 565.6,442.55 	"/>
            <polygon style="fill:#334672;" points="470,666 510,658 568.6,657.5 605,662 	"/>
            <polygon style="fill:#49496B;" points="407.35,272.98 354,270 327,394 373,431 	"/>
            <polygon style="fill:#49496B;" points="657,265 711,340 759,321 687,240 	"/>
            <path style="fill:#334672;" d="M660,469c0,12.7-18.36,23-41,23s-41-10.3-41-23c0-1.58,0.28-3.12,0.82-4.61L599,474h43l17.73-7.65
                C659.91,467.22,660,468.1,660,469z"/>
            <path style="fill:#334672;" d="M502,467c0,14.36-22.39,26-50,26s-50-11.64-50-26c0-2.15,0.5-4.25,1.46-6.25
                c0.01-0.01,0.01-0.01,0.01-0.01L425,473h56l18.69-13.83C501.19,461.64,502,464.27,502,467z"/>
        </g>
        <g class="move">
            <polygon style="fill:#BAA85D;" points="853.48,83.59 748,1016.41 1764,899 1606,120"/>
            <g>
                <text transform="matrix(0.998 -0.0631 0.0631 0.998 880.4403 369.7796)"><tspan x="0" y="0" style="fill:#23233A; font-family:'Arial'; font-weight:900; font-size:27.0723px;">Супрематизм — одно из самых </tspan><tspan x="0" y="32.49" style="fill:#23233A; font-family:'Arial'; font-weight:900; font-size:27.0723px;">влиятельных направлений абстрактного </tspan><tspan x="0" y="64.97" style="fill:#23233A; font-family:'Arial'; font-weight:900; font-size:27.0723px;">искусства ХХ века.Структура мироздания </tspan><tspan x="0" y="97.46" style="fill:#23233A; font-family:'Arial'; font-weight:900; font-size:27.0723px;">в супрематизме выражается </tspan><tspan x="0" y="129.95" style="fill:#23233A; font-family:'Arial'; font-weight:900; font-size:27.0723px;">в простых геометрических формах: </tspan><tspan x="0" y="162.43" style="fill:#23233A; font-family:'Arial'; font-weight:900; font-size:27.0723px;">прямой линии, прямоугольнике, круге, </tspan><tspan x="0" y="194.92" style="fill:#23233A; font-family:'Arial'; font-weight:900; font-size:27.0723px;">квадрате на светлом фоне, знаменующем </tspan><tspan x="0" y="227.41" style="fill:#23233A; font-family:'Arial'; font-weight:900; font-size:27.0723px;">бесконечность пространства. </tspan><tspan x="0" y="259.89" style="fill:#23233A; font-family:'Arial'; font-weight:900; font-size:27.0723px;">Идеи супрематизма, </tspan><tspan x="0" y="292.38" style="fill:#23233A; font-family:'Arial'; font-weight:900; font-size:27.0723px;">отсчёт которому положил знаменитый </tspan><tspan x="0" y="324.87" style="fill:#23233A; font-family:'Arial'; font-weight:900; font-size:27.0723px;">«Черный квадрат», нашли воплощение </tspan><tspan x="0" y="357.35" style="fill:#23233A; font-family:'Arial'; font-weight:900; font-size:27.0723px;">в архитектуре, сценографии, </tspan><tspan x="0" y="389.84" style="fill:#23233A; font-family:'Arial'; font-weight:900; font-size:27.0723px;">полиграфии, промышленном дизайне.</tspan><tspan x="0" y="422.33" style="fill:#23233A; font-family:'Arial'; font-weight:900; font-size:27.0723px;">Супрематизм обязан своим рождением </tspan><tspan x="0" y="454.82" style="fill:#23233A; font-family:'Arial'; font-weight:900; font-size:27.0723px;">одному - единственному человеку — </tspan><tspan x="0" y="487.3" style="fill:#23233A; font-family:'Arial'; font-weight:900; font-size:27.0723px;">Казимиру Севериновичу Малевичу (1879−1935).  </tspan><tspan x="0" y="519.79" style="fill:#23233A; font-family:'Arial'; font-weight:900; font-size:27.0723px;"> </tspan></text>
                <a href="https://artchive.ru/encyclopedia/2322~Suprematism" target="_blank">
                    <text transform="matrix(0.9933 -0.1159 0.1159 0.9933 782.1899 994.4556)" style="fill:#993D3D; font-family:'Arial'; font-weight:900; font-size:63.3579px;">artchive.ru</text>
                </a>
            </g>
        </g>
        <g class="move">
            <polygon style="fill:#993D3D;" points="796.74,238.68 969.59,170.45 962.32,61.28 1244.35,54 1255.26,276.89 956.86,296 960.5,207.75"/>
            <rect x="1038" y="92" style="fill:#0F0D03;" width="152" height="152"/>
        </g>
    </svg>`)];
}