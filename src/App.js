import { Themes } from './constants.js';
import './App.scss';

export default class App {

    constructor(element) {
        this.curTheme = null;
        this.rootElement = element;
        if (Themes.length > 0) {
            if (localStorage.currentTheme) {
                let theme = Themes.find(({ name }) => name === localStorage.currentTheme);
                if (theme) {
                    this.ChangeTheme(theme);
                    return;
                }
            }
            this.ChangeTheme(Themes[0])
        }
    }

    ChangeTheme = (theme) => {
        if (theme && 'getModule' in theme) {
            theme.getModule().then(module => {
                this.curTheme = new module.default(this.rootElement, this.ChangeTheme);
                document.title = theme.name;
                localStorage.setItem('currentTheme', theme.name);
            }).catch(error => {
                console.error(error);
            })
        }
    }
}