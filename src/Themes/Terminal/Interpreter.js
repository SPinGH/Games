import Parameters from './Parameters.js';
import { Themes } from '@/constants.js';
import Disk from './Disk.js';

const THEMES = Themes.filter(theme => theme.name !== 'Terminal');
const DISK = new Disk();

export default class Interpreter {
    constructor(clear, onOptionChanged, onThemeChanged, startGame) {
        this.minWidth = 32;
        this.Clear = clear;
        this.OnOptionChanged = onOptionChanged;
        this.OnThemeChanged = onThemeChanged;
        this.StartGame = startGame;
        Parameters.curPosObj = DISK;
        Parameters.curPos = DISK.name;
    }

    ParseAttr = (str) => {
        let attr = [];
        let start = null;
        let quote = false;
        for (let i = 0; i < str.length; i++) {
            if (str[i] === '"') {
                if (start === null) {
                    start = i;
                    quote = true;
                } else {
                    let param = str.slice(start + 1, i).trim();
                    if (param !== '') {
                        attr.push(str.slice(start + 1, i));
                    }
                    start = null;
                    quote = false;
                }
            } else if (str[i] === ' ' && !quote && start !== null) {
                attr.push(str.slice(start, i));
                start = null;
            } else if (str[i] !== ' ' && start === null) {
                start = i;
            }
        }
        if (start !== null) {
            attr.push(str.slice(start, str.length));
        }
        return attr;
    }

    cd = (attr) => {
        if (attr.includes('--help')) {
            return ['Изменяет текущий каталог', ' ', 'CD [путь]', 'CD [..]', '  ..  обозначает переход в родительский каталог.',
                'Имя текущего каталога в строке вызова преобразуется к тому же регистру символов, что и для существующих имен на диске.',
                'Так, команда CD C:\\TEMP сделает текущим каталог C:\\Temp, если он существует на диске.', ' ']
        }
        let pos = DISK.getFromPath(attr);
        if (pos) {
            Parameters.curPos = DISK.getFullPath(pos);
            Parameters.curPosObj = pos;
            this.OnOptionChanged();
            return;
        } else {
            return ['Системе не удается найти указанный путь.'];
        }
    }

    chps = (attr) => {
        if (attr.includes('--help')) {
            return ['Устанавливает стиль приветствия', ' ',
                'CHPS [attr] [-D]', ' ', 'attr Установка атрибута стиля приветствия.',
                '-D   Отображение текущей директории', ' ',
                'Стиль задаётся в виде десятичного числа. Число может иметь следующие значения:', ' ',
                ' 0 = ┌──(user㉿windows)-[/]',
                '     └─$ ',
                ' 1 = user@user㉿windows:/$ ',
                ' 2 = /> ', ' ',
                'Если аргумент не указан, команда ничего не меняет.'];
        }
        attr = this.ParseAttr(attr);

        if (attr.length > 2) {
            return ['Неверный формат команды.']
        } else if (attr.length === 0) {
            return;
        }
        Parameters.options.showPos = false;
        for (const param of attr) {
            if (param === '-D') {
                Parameters.options.showPos = true;
            } else if (!isNaN(param) && param < 3 && param >= 0) {
                Parameters.options.ps = Number(param);
            }
        }
        this.OnOptionChanged();
        return;
    }

    chtheme = (attr) => {
        if (attr.includes('--help')) {
            return ['Изменяет тему сайта', ' ', 'CHTHEME [название]', ' ',
                'Название задаётся в виде десятичного числа. Число может иметь следующие значения:', ' ',
                ...THEMES.map((theme, index) => `${index} = ${theme.name}`), ' ',
                'Если аргумент не указан, команда ничего не меняет.', ' ']
        }
        if (attr !== '' && !isNaN(attr) && attr < THEMES.length && attr >= 0) {
            this.OnThemeChanged(THEMES[attr]);
        }
    }

    cls = (attr) => {
        if (attr.includes('--help')) {
            return ['Очищает содержимое экрана', ' ', 'CLS', ' ']
        }
        this.Clear();
    }

    color = (attr) => {
        if (attr.includes('--help')) {
            return ['Устанавливает цвет консоли', ' ',
                'COLOR [attr]', ' ', 'attr Установка атрибута цветов для вывода консоли.', ' ',
                'Цвет задаётся в виде шестнадцатеричной цифры. Каждая цифра может иметь следующие значения:', ' ',
                ' 0 = Тёмный   8 = Серый',
                ' 1 = Синий    9 = Светло-синий',
                ' 2 = Зеленый  A = Светло-зеленый',
                ' 3 = Голубой  B = Светло-голубой',
                ' 4 = Красный  C = Светло-красный',
                ' 5 = Лиловый  D = Светло-лиловый',
                ' 6 = Желтый   E = Светло-желтый',
                ' 7 = Белый    F = Ярко-белый', ' ',
                'Если аргумент не указан, команда устанавливает цвет по умолчанию (Серый).'];
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
                default: return null;
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
        return ['Данная команда не поддерживается.'];
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

    dir = (attr) => {
        if (attr.includes('--help')) {
            return ['Вывод файлов и подкаталогов', ' ', 'Вывод списка файлов и подкаталогов в указанном каталоге.', 'DIR [путь]', ' ']
        }
        let formatSize = (size) => {
            if (!size) { return '           '; }
            size = String(size);
            if (size.length > 11) {
                return '>9999999999';
            }
            return size.padStart(11);
        }

        let pos = DISK.getFromPath(attr);

        if (pos) {
            let res = [` Содержимое папки ${DISK.getFullPath(pos)}`];
            for (const child of pos.children) {
                res.push(child.date?.toLocaleString() + '    ' +
                    (child.content === undefined ? '<DIR>' : '     ') + '    ' +
                    formatSize(child.size) + ' ' + child.name);
            }
            return res;
        } else {
            return ['Системе не удается найти указанный путь.']
        }
    }

    glitch = (attr) => {
        if (attr.includes('--help')) {
            return ['Включает/выключает сбои', ' ', 'GLITCH [on/off]', ' '];
        }
        switch (attr) {
            case 'on':
                Parameters.options.isGlitched = true;
                this.OnOptionChanged();
                break;
            case 'off':
                Parameters.options.isGlitched = false;
                this.OnOptionChanged();
                break;
            case '':
                Parameters.options.isGlitched = true;
                this.OnOptionChanged();
                break;
            default: return ['Данная команда не поддерживается.'];
        }
    }

    help = (attr) => {
        if (attr.includes('--help')) {
            return ['Вывод сведений о командах', ' ',
                'HELP [<команда>]', ' ',
                '    <команда> - команда, интересующая пользователя', ' ']
        }
        if (attr.length === 0) {
            let result = ['Для получения сведений об определенной команде наберите HELP <имя команды>.'];
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
                return ['Данная команда не поддерживается.'];
            }
        }
    }

    mkdir = (attr) => {
        if (attr.includes('--help')) {
            return ['Создание каталога', ' ', 'MKDIR [диск:]путь', ' '];
        }

        let pos = DISK.createPath(attr);
        if (pos) {
            return [`Дирректория ${pos.name} создана.`];
        } else {
            return ['Неверно указан путь.'];
        }
    }

    mkfile = (attr) => {
        if (attr.includes('--help')) {
            return ['Создание файла', ' ', 'MKFILE [диск:]путь [текст]', ' '];
        }

        attr = this.ParseAttr(attr);

        if (attr.length > 2) {
            return ['Неверный формат команды.'];
        }

        let pos = DISK.createFile(...attr);
        if (pos) {
            return [`Файл ${pos.name} создан.`];
        } else {
            return ['Системе не удается найти указанный путь.'];
        }
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
            default: return ['Данная команда не поддерживается.'];
        }
    }

    rename = (attr) => {
        if (attr.includes('--help')) {
            return ['Переименование файла/дирректории', ' ', 'RENAME [диск:]путь название', ' '];
        }

        attr = this.ParseAttr(attr);

        if (attr.length !== 2) {
            return ['Неверный формат команды.'];
        }

        let pos = DISK.getFromPath(attr[0], null);
        if (pos) {
            let lastName = pos.name;
            DISK.renameChild(pos, attr[1]);
            Parameters.curPos = DISK.getFullPath(Parameters.curPosObj);
            this.OnOptionChanged();
            return [pos.content === undefined ? `Дирректория ${lastName} переименована в ${pos.name}.`
                : `Файл ${lastName} переименован в ${pos.name}.`];
        } else {
            return ['Системе не удается найти указанный путь.'];
        }
    }

    rmdir = (attr) => {
        if (attr.includes('--help')) {
            return ['Удаление каталога', ' ', 'RMDIR [диск:]путь [-S]', ' ',
                '   -S   Удаление дерева каталогов, т. е. не только указанного каталога,' +
                ' но и всех содержащихся в нем файлов и подкаталогов.', ''];
        }
        attr = this.ParseAttr(attr);

        let flag = false;
        let pos = Parameters.curPosObj;
        if (attr.length > 2) {
            return ['Неверный формат команды.']
        }

        for (const param of attr) {
            if (param === '-s') {
                flag = true;
            } else {
                pos = DISK.getFromPath(param);
            }
        }
        if (!pos) {
            return ['Системе не удается найти указанный путь.'];
        }
        if (pos === Parameters.curPosObj) {
            return ['Невозможно удалить дирректорию.'];
        }
        if (!flag && pos.children.length !== 0) {
            return ['Указанная дирректория не пуста.'];
        }
        DISK.removeChild(pos);
        return [`Дирректория ${pos.name} удалена.`];
    }

    rmfile = (attr) => {
        if (attr.includes('--help')) {
            return ['Удаление файла', ' ', 'RMFILE [диск:]путь', ' '];
        }
        let pos = DISK.getFromPath(attr, false);
        if (pos) {
            DISK.removeChild(pos);
            return [`Файл ${pos.name} удален.`]
        } else {
            return ['Системе не удается найти указанный путь.'];
        }
    }

    tree = (attr) => {
        if (attr.includes('--help')) {
            return ['Структура папок', ' ',
                'TREE [путь] [-F]', ' ',
                '   -F   Вывод имен файлов в каждой папке.', ' '];
        }

        attr = this.ParseAttr(attr);

        let flag = false;
        let pos = Parameters.curPosObj;
        if (attr.length > 2) {
            return ['Неверный формат команды.'];
        }

        for (const param of attr) {
            if (param === '-f') {
                flag = true;
            } else {
                pos = DISK.getFromPath(param);
            }
        }

        let draw = (dir, prefix) => {
            let res = [];
            let children = flag ? dir.children : dir.children.filter(child => child.content === undefined);
            for (let i = 0; i < children.length; i++) {
                if (i === children.length - 1) {
                    res.push(prefix + '└───' + children[i].name);
                } else {
                    res.push(prefix + '├───' + children[i].name);
                }
                if (children[i].content === undefined) {
                    res.push(...draw(children[i], (i === children.length - 1) ? prefix + '    ' : prefix + '│   '));
                }
            }
            return res;
        }

        if (pos) {
            return [DISK.getFullPath(pos), ...draw(pos, '')];
        } else {
            return ['Системе не удается найти указанный путь.'];
        }
    }

    type = (attr) => {
        if (attr.includes('--help')) {
            return ['Вывод содержимого файла', ' ',
                'TYPE [путь]имя_файла', ' '];
        }

        let pos = DISK.getFromPath(attr, false);
        if (pos && pos.content !== undefined) {
            return [pos.content];
        } else {
            return ['Системе не удается найти указанный файл.'];
        }
    }

    write = (attr) => {
        if (attr.includes('--help')) {
            return ['Запись текста в файл', ' ', 'WRITE [диск:]путь текст', ' '];
        }


        attr = this.ParseAttr(attr);

        if (attr.length !== 2) {
            return ['Неверный формат команды.'];
        }

        let pos = DISK.getFromPath(attr[0], false);
        if (pos) {
            DISK.writeFile(pos, attr[1]);
            return [`Файл ${pos.name} перезаписан.`];
        } else {
            return ['Системе не удается найти указанный путь.'];
        }
    }
}