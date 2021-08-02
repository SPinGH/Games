export function createDiv(className, html = '') {
    let div = document.createElement('div');
    div.className = className;
    div.innerHTML = html;
    return div;
}

export function createSVGElement(element, options = {}, innerHTML = '') {
    let el = document.createElementNS('http://www.w3.org/2000/svg', element);
    for (const key in options) {
        el.setAttribute(key, options[key]);
    }
    el.innerHTML = innerHTML;
    return el;
}

export function randomInt(min, max) {
    return Math.floor(min + Math.random() * (max + 1 - min));
}