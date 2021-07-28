import { Themes } from './constants.js';

export default class App {

    constructor(element) {
        this.curTheme = null;
        this.rootElement = element;
        if (Themes.length > 0) {
            this.ChangeTheme(Themes[0])
        }
    }

    ChangeTheme(theme) {
        if (theme && 'getModule' in theme) {
            theme.getModule().then(module => {
                this.curTheme = new module.default(this.rootElement, this.ChangeTheme.bind(this));
                document.title = theme.name;
            }).catch(error => {
                console.error(error);
            })
        }
    }
}