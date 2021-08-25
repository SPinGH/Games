import { Themes } from '@/constants.js';
import Parameters from './Parameters.js';

const THEMES = Themes.filter(theme => theme.name !== 'Terminal');

export default class Interpreter {
    constructor(clear, onOptionChanged, onThemeChanged, startGame) {
        this.minWidth = 32;
        this.Clear = clear;
        this.OnOptionChanged = onOptionChanged;
        this.OnThemeChanged = onThemeChanged;
        this.StartGame = startGame;
    }

    cls = (attr) => {
        if (attr.includes('--help')) {
            return ['Очищает содержимое экрана', ' ', 'CLS', ' ']
        }
        this.Clear();
    }

    play = (attr) => {
        if (attr.includes('--help')) {
            return ['Запускает игру', ' ',
                'PLAY [game]', ' ',
                'Игра задаётся в виде десятичного числа. Число может иметь следующие значения:', ' ',
                ' 0 = Тетрис',
                ' 1 = Арканоид',
                ' 2 = Крестики-нолики'];
        }
        switch (attr) {
            case '0': this.StartGame('tetris'); return;
            case '1': this.StartGame('arkanoid'); return;
            case '2': this.StartGame('ticTacToe'); return;
            default: return ['Данная команда не поддерживается'];
        }
    }

    chps = (attr) => {
        if (attr.includes('--help')) {
            return ['Устанавливает стиль приветствия', ' ',
                'CHPS [attr] [-D]', ' ', 'attr Установка атрибута стиля приветствия',
                '-D   Отображение текущей директории', ' ',
                'Стиль задаётся в виде десятичного числа. Число может иметь следующие значения:', ' ',
                ' 0 = ┌──(user㉿windows)-[/]',
                '     └─$ ',
                ' 1 = user@user㉿windows:/$ ',
                ' 2 = /> ', ' ',
                'Если аргумент не указан, команда ничего не меняет'];
        }
        attr = attr.split(' ');
        if (attr.length === 0) {
            Parameters.options.ps = 0;
            this.OnOptionChanged();
            return;
        } else if (attr.length === 1 && !isNaN(attr[0])) {
            Parameters.options.ps = Number(attr[0]);
            this.OnOptionChanged();
            return;
        } else if (attr.length === 2 && !isNaN(attr[0]) && attr[1] === '-D') {
            Parameters.options.ps = Number(attr[0]);
            Parameters.options.showPos = true;
            this.OnOptionChanged();
            return;
        }
        return ['Данная команда не поддерживается'];
    }

    chtheme = (attr) => {
        if (attr.includes('--help')) {
            return ['Изменяет тему сайта', ' ', 'CHTHEME [название]', ' ',
                'Название задаётся в виде десятичного числа. Число может иметь следующие значения:', ' ',
                ...THEMES.map((theme, index) => `${index} = ${theme.name}`), ' ',
                'Если аргумент не указан, команда ничего не меняет', ' ']
        }
        if (attr !== '' && !isNaN(attr)) {
            this.OnThemeChanged(THEMES[attr]);
        }
    }

    glitch = (attr) => {
        if (attr.includes('--help')) {
            return ['Включает/выключает сбои', ' ', 'GLITCH [true/false]', ' ']
        }
        switch (attr) {
            case 'true':
                Parameters.options.isGlitched = true;
                this.OnOptionChanged();
                break;
            case 'false':
                Parameters.options.isGlitched = false;
                this.OnOptionChanged();
                break;
            case '':
                Parameters.options.isGlitched = true;
                this.OnOptionChanged();
                break;
            default: return ['Данная команда не поддерживается'];
        }
    }

    help = (attr) => {
        if (attr.includes('--help')) {
            return ['Вывод сведений о командах', ' ',
                'HELP [<команда>]', ' ',
                '    <команда> - команда, интересующая пользователя', ' ']
        }
        if (attr.length === 0) {
            let result = ['Для получения сведений об определенной команде наберите HELP <имя команды>'];
            for (const key in this) {
                if (typeof this[key] === 'function' && key[0].toLowerCase() === key[0]) {
                    result.push(key.padEnd(12) + this[key]('--help')[0]);
                }
            }
            return result;
        } else {
            if (typeof this[attr] === 'function' && attr[0].toLowerCase() === attr[0]) {
                return this[attr]('--help');
            } else {
                return ['Данная команда не поддерживается']
            }
        }
    }

    color = (attr) => {
        if (attr.includes('--help')) {
            return ['Устанавливает цвет консоли', ' ',
                'COLOR [attr]', ' ', 'attr Установка атрибута цветов для вывода консоли', ' ',
                'Цвет задаётся в виде шестнадцатеричной цифры. Каждая цифра может иметь следующие значения:', ' ',
                ' 0 = Тёмный   8 = Серый',
                ' 1 = Синий    9 = Светло-синий',
                ' 2 = Зеленый  A = Светло-зеленый',
                ' 3 = Голубой  B = Светло-голубой',
                ' 4 = Красный  C = Светло-красный',
                ' 5 = Лиловый  D = Светло-лиловый',
                ' 6 = Желтый   E = Светло-желтый',
                ' 7 = Белый    F = Ярко-белый', ' ',
                'Если аргумент не указан, команда устанавливает цвет по умолчанию (Серый)'];
        }
        let getColor = (code) => {
            switch (code) {
                case '0': return '#222222'; case '8': return '#767676';
                case '1': return '#0040ff'; case '9': return '#7fa8ff';
                case '2': return '#1eff00'; case 'a': return '#86ff7f';
                case '3': return '#42adff'; case 'b': return '#7fffff';
                case '4': return '#ff1428'; case 'c': return '#ff7f8a';
                case '5': return '#e626ff'; case 'd': return '#ff7ff0';
                case '6': return '#ffcc00'; case 'e': return '#fff27f';
                case '7': return '#CCCCCC'; case 'f': return '#ffffff';
                default: return undefined;
            }
        }
        if (attr === '') {
            Parameters.options.color = '#cccccc';
            this.OnOptionChanged();
            return;
        } else {
            let color = getColor(attr);
            if (color) {
                Parameters.options.color = color;
                this.OnOptionChanged();
                return;
            }
        }
        return ['Данная команда не поддерживается']
    }

    cowsay = (attr) => {
        if (attr.includes('--help')) {
            return ['Выводит сообщение', ' ',
                'Выводит изображение говорящей коровы, нарисованной в ASCII-символах,' +
                ' с <облачком> фразы в котором написан какой-нибудь заданный текст']
        }
        let innerWidth = this.minWidth - 4;
        let text = [];
        if (attr.length > innerWidth) {
            let rows = [];
            let count = 0;
            let buf = [];
            for (const word of attr.split(' ')) {
                if (word.length >= innerWidth) {
                    buf.push(word.substr(0, innerWidth - count));
                    rows.push(buf.join(' '));
                    buf = [];
                    for (let i = 0; i < Math.ceil((word.length - count) / innerWidth); i++) {
                        let part = word.substr((innerWidth - count) + i * innerWidth, innerWidth);
                        if (part.length === innerWidth) {
                            rows.push(part);
                        } else {
                            buf.push(part);
                        }
                    }
                    count = buf.length > 0 ? buf[0].length + 1 : 0;
                    continue;
                }
                if (count + word.length >= innerWidth) {
                    rows.push(buf.join(' ').padEnd(innerWidth));
                    count = 0;
                    buf = [];
                }
                buf.push(word);
                count += word.length + 1;
            }
            if (buf) {
                rows.push(buf.join(' ').padEnd(innerWidth));
            }
            for (let i = 0; i < rows.length; i++) {
                if (i === 0) {
                    text.push(`/ ${rows[i]} \\`);
                } else if (i === rows.length - 1) {
                    text.push(`\\ ${rows[i]} /`);
                } else {
                    text.push(`| ${rows[i]} |`);
                }
            }
        } else {
            text.push(`< ${attr.padStart(innerWidth - (innerWidth - attr.length) / 2).padEnd(innerWidth)} >`);
        }
        return [''.padStart(this.minWidth, '_'),
        ...text,
        ''.padStart(this.minWidth, '-'),
            '    \\',
            '     \\',
            '       ^__^',
            '       (oo)\\_______',
            '       (__)\\       )\\/\\',
            '           ||----w |',
            '           ||     ||']
    }
}