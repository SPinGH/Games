import Parameters from './Parameters.js';

function File(name, parent, content = '', date = new Date()) {
    this.name = name;
    this.date = date;
    this.size = content.length;
    this.content = content;
    this.parent = parent;
    this.toJSON = () => ({
        name: this.name,
        date: this.date,
        content: this.content
    })
}

function Folder(name, parent, date = new Date()) {
    this.name = name;
    this.date = date;
    this.children = [];
    this.parent = parent;
    this.toJSON = () => ({
        name: this.name,
        date: this.date,
        children: this.children
    })
}


export default class Disk {
    constructor(name = 'C') {
        this.name = name + ':';
        this.children = [];
        this.init();
    }
    init = () => {
        if (localStorage.getItem('disk')) {
            let disk = JSON.parse(localStorage.getItem('disk'));
            let parse = (parent, node) => {
                parent.children = [];
                for (const child of node.children) {
                    if (child.content !== undefined) {
                        parent.children.push(new File(child.name, parent, node.content, node.date))
                    } else {
                        let dir = new Folder(child.name, parent, node.date);
                        parse(dir, child);
                        parent.children.push(dir);
                    }
                }
            }
            parse(this, disk);
            this.name = disk.name;
        } else {
            let docs = new Folder('Documents', this);
            let mus = new Folder('Music', this);
            let logs = new Folder('Logs', docs);
            docs.children.push(logs);
            logs.children.push(new File('log1.log', logs, '[SUCCESS] log1'));
            logs.children.push(new File('log2.log', logs, '[SUCCESS] log2'));
            logs.children.push(new File('log3.log', logs, '[SUCCESS] log3'));
            logs.children.push(new File('log4.log', logs, '[ ERROR ] Decode BASE64'));
            logs.children.push(new File('log5.log', logs, '[SUCCESS] log5'));
            mus.children.push(new File('music.txt', mus, 'YWJiYSAtIGdpbW1lIGdpbW1lIGdpbW1l'));
            this.children.push(docs);
            this.children.push(mus);
            this.children.push(new Folder('Pictures', this));
            this.children.push(new Folder('Desktop', this));
            localStorage.setItem('disk', JSON.stringify(this));
        }
    }

    getChild = (start, splitPath, isDir = true, mkdir = false, mkfile = false) => {
        let lastChild;
        let cur = start;
        if (!isDir) { lastChild = splitPath.pop(); }

        for (const name of splitPath) {
            if (name === "..") {
                if (cur.parent) { cur = cur.parent; continue; }
            } else {
                let dir = cur.children.find(child => child.name.toLowerCase() === name && child instanceof Folder);
                if (dir) { cur = dir; continue; }
                if (mkdir) {
                    let newDir = new Folder(name, cur);
                    cur.children.push(newDir);
                    cur = newDir;
                    continue;
                }
            }
            return null;
        }

        if (lastChild) {
            let child = cur.children.find(child => child.name.toLowerCase() === lastChild);
            if (mkfile) {
                if (child && child instanceof File) {
                    return null;
                }
                let newFile = new File(lastChild, cur);
                cur.children.push(newFile);
                cur = newFile;
            } else {
                cur = isDir === false && !(child instanceof File) ? null : child;
            }
        }

        return cur;
    }

    getFromPath = (path, isDir = true) => {
        let [start, PATH] = this.parsePath(path);
        if (!start) { return null; }

        return this.getChild(start, PATH, isDir);
    }

    parsePath = (path) => {
        path = path.trim().toLowerCase();
        if (/[\\/]/.test(path[0])) { path = path.substr(1); }
        if (/[\\/]/.test(path[path.length - 1])) { path = path.substr(0, path.length - 1); }

        const PATH = path.split(/[\\/]/);
        let start = null;

        if (PATH[0].includes(':')) {
            if (this.name.toLowerCase() === PATH[0]) {
                start = this;
                PATH.shift();
            } else {
                return [null, null];
            }
        } else if (PATH[0] === '') {
            start = Parameters.curPosObj;
            PATH.shift();
        } else {
            start = Parameters.curPosObj;
        }
        return [start, PATH];
    }

    createPath = (path) => {
        if (path === '') { return null; }
        let [start, PATH] = this.parsePath(path);
        if (!start) { return null; }

        let newChild = this.getChild(start, PATH, true, true);

        localStorage.setItem('disk', JSON.stringify(this));

        return newChild;
    }

    createFile = (path, content = '') => {
        if (path === '') { return null; }
        let [start, PATH] = this.parsePath(path);
        if (!start) { return null; }

        let file = this.getChild(start, PATH, false, false, true);
        if (file) {
            file.content = content;
        }
        localStorage.setItem('disk', JSON.stringify(this));
        return file;
    }

    removeChild = (child) => {
        child.parent.children = child.parent.children.filter(node => node !== child);
        localStorage.setItem('disk', JSON.stringify(this));
    }

    renameChild = (child, name) => {
        child.name = name;
        localStorage.setItem('disk', JSON.stringify(this));
    }

    writeFile = (file, text) => {
        file.content = text;
        localStorage.setItem('disk', JSON.stringify(this));
    }

    getFullPath = (cur) => {
        let path = [];
        while (cur) {
            path.unshift(cur.name);
            cur = cur.parent;
        }
        return path.join("\\");
    }

    addFolder = (parent, name) => {
        const dir = new Folder(name, parent);
        parent.children.push(dir);
        return dir;
    }
}

