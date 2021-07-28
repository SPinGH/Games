export function createDiv(className, html = '') {
    let div = document.createElement('div');
    div.className = className;
    div.innerHTML = html;
    return div;
}

export function randomInt(min, max) {
    return Math.floor(min + Math.random() * (max + 1 - min));
}