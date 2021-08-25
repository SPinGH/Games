import { randomInt } from '@/utils.js';
import { IsMobile } from "@/constants";

export class Arkanoid {
    constructor(element, canvas, onScoreChanged, onLifesChanged, offsetLeft = 0, offsetTop = 0) {
        this.OnScoreChanged = onScoreChanged;
        this.OnLifesChanged = onLifesChanged;
        this.ctx = canvas.getContext('2d');
        this.window = {
            width: canvas.width,
            height: canvas.height,
            offsetLeft,
            offsetTop
        };
        this.lifes = 3;
        this.score = 0;
        this.stop = true;
        this.bonuses = ['Through', 'BigBall', 'SmallBall', 'BigCarriage', 'SmallCarriage', 'Death'];
        this.bonus = {
            active: [],
            nextBonus: randomInt(300, 900),
            falling: [],
        }
        this.brick = {
            width: 0,
            height: 0,
        }
        this.bricks = undefined;
        this.brickCount = 0;
        this.carriage = {
            x: (this.window.width * 4 / 5) / 2,
            y: this.window.height - this.window.width / 40,
            width: this.window.width / 5,
            height: this.window.width / 40,
            hasBall: true,
        }
        this.ball = {
            x: this.window.width / 2,
            y: this.carriage.y - this.window.width / 40,
            speed: this.window.width / 150,
            dx: 0,
            dy: 0,
            rad: this.window.width / 40,
        }
        this.touchPosX;
        if (IsMobile) {
            element.addEventListener('touchmove', this.OnTouchMove);
        } else {
            document.addEventListener('keydown', this.OnKeyDown);
            canvas.addEventListener('mousemove', this.OnMouseMove);
        }
        canvas.addEventListener('click', this.OnClick);
    }

    OnClick = (event) => {
        if (this.stop) { return; }
        event.preventDefault();
        if (this.carriage.hasBall) {
            let coord = this.BounceFunc();
            this.ball.dx = coord.x;
            this.ball.dy = coord.y;
            this.carriage.hasBall = false;
        }
    }

    OnTouchMove = (event) => {
        event.preventDefault();
        if (this.stop) { return; }
        if (!this.touchPosX) { this.touchPosX = event.touches[0].screenX; }
        let delta = event.touches[0].screenX - this.touchPosX;
        if (this.carriage.x + delta > 0 && this.carriage.x + this.carriage.width + delta < this.window.width) {
            this.carriage.x += delta;
            if (this.carriage.hasBall) {
                this.ball.x += delta;
            }
        }
        this.touchPosX = event.touches[0].screenX;
    }

    WindowToCanvas(x) {
        let bbox = this.ctx.canvas.getBoundingClientRect();
        if (bbox.width === 0 || bbox.height === 0) { return 0; }
        return x - (bbox.left + this.window.offsetLeft) * (this.ctx.canvas.width / bbox.width);
    }

    OnMouseMove = (event) => {
        if (this.stop) { return; }
        let X = this.WindowToCanvas(event.clientX) - this.carriage.width / 2;
        let lastCarrieage = this.carriage.x;
        if (X <= 0) {
            this.carriage.x = 0;
        } else if (X + this.carriage.width >= this.window.width) {
            this.carriage.x = this.window.width - this.carriage.width;
        } else {
            this.carriage.x = X;
        }
        if (this.carriage.hasBall) {
            this.ball.x -= lastCarrieage - this.carriage.x;
        }
    }

    OnKeyDown = (event) => {
        if (this.stop) { return; }
        switch (event.code) {
            case 'Space':
                event.preventDefault();
                if (this.carriage.hasBall) {
                    this.ball.dx = 0;
                    this.ball.dy = -this.ball.speed;
                    this.carriage.hasBall = false;
                }
                break;
            case 'ArrowLeft':
                event.preventDefault();
                if (this.carriage.x > 0) {
                    this.carriage.x -= this.window.width / 40;
                    if (this.carriage.hasBall) {
                        this.ball.x -= this.window.width / 40
                    }
                }
                break;
            case 'ArrowRight':
                event.preventDefault();
                if (this.carriage.x + this.carriage.width < this.window.width) {
                    this.carriage.x += this.window.width / 40;
                    if (this.carriage.hasBall) {
                        this.ball.x += this.window.width / 40
                    }
                }
                break;
            default: break;
        }
    }

    Reset() {
        this.carriage.x = (this.window.width - this.window.width / 5) / 2;
        this.carriage.y = this.window.height - this.window.width / 40;
        this.carriage.width = this.window.width / 5;
        this.carriage.height = this.window.width / 40;
        this.carriage.hasBall = true;
        this.ball.rad = this.window.width / 40;
        this.ball.x = this.window.width / 2;
        this.ball.y = this.carriage.y - this.ball.rad;
        this.ball.dx = 0;
        this.ball.dy = 0;
        this.ball.speed = this.window.width / 150;
        this.bonus = {
            active: [],
            nextBonus: randomInt(300, 900),
            falling: [],
        }
        this.lifes = 3;
        this.score = 0;
        this.OnLifesChanged();
        this.OnScoreChanged();
        if (this.stop) {
            if (!IsMobile) { document.addEventListener('keydown', this.OnKeyDown); }
            this.stop = false;
            this.Draw();
        }
    }

    Stop() {
        this.stop = true;
        if (!IsMobile) { document.removeEventListener('keydown', this.OnKeyDown); }
    }

    Resize(window, offsetLeft = 0, offsetTop = 0) {
        this.carriage.width = this.window.width / 5;
        this.carriage.height = this.window.width / 40;
        this.carriage.x = this.carriage.x / this.window.width * window.width;
        this.carriage.y = window.height - this.carriage.height;
        this.ball.rad = this.window.width / 40;
        this.ball.x = this.carriage.hasBall ?
            this.carriage.x + this.carriage.width / 2 :
            this.ball.x / this.window.width * window.width;
        this.ball.y = this.carriage.hasBall ?
            this.carriage.y - this.ball.rad :
            this.ball.y / this.window.height * window.height;
        this.window = {
            width: window.width,
            height: window.height,
            offsetLeft,
            offsetTop
        };
        if (this.bricks) {
            this.brick.width = window.width / this.bricks[0].length;
            this.brick.height = 0.6 * this.brick.width;
        }
    }

    SetBonus(index) {
        switch (this.bonus.falling[index].name) {
            case 'Through':
                this.bonus.active.push({ name: 'Through', duration: randomInt(300, 900) });
                break;
            case 'BigBall':
                this.ball.rad += this.ball.rad < this.window.width / 30 ? 2 : 0;
                if (this.carriage.hasBall) {
                    this.ball.y = this.carriage.y - this.ball.rad;
                }
                break;
            case 'SmallBall':
                this.ball.rad -= this.ball.rad > 4 ? 2 : 0;
                if (this.carriage.hasBall) {
                    this.ball.y = this.carriage.y - this.ball.rad;
                }
                break;
            case 'BigCarriage':
                this.carriage.width += this.carriage.width < this.window.width / 2 ? 20 : 0;
                if (this.carriage.x + this.carriage.width > this.window.width) {
                    this.carriage.x = this.window.width - this.carriage.width;
                }
                break;
            case 'SmallCarriage':
                this.carriage.width -= this.carriage.width > this.window.width / 10 ? 20 : 0;
                break;
            case 'Death':
                this.Lose();
                break;
        }
        this.bonus.falling.splice(index, 1);
    }

    FallBonus() {
        let bonus = {
            name: this.bonuses[randomInt(0, this.bonuses.length - 1)],
            x: randomInt(0, this.window.width - this.brick.width),
            y: -this.brick.width
        };
        this.bonus.falling.push(bonus);
        this.bonus.nextBonus = randomInt(300, 900);
    }

    LoadMap(map) {
        this.bricks = map;

        this.brickCount = 0;
        for (let i = 0; i < map.length; i++) {
            for (let j = 0; j < map[i].length; j++) {
                if (map[i][j] !== null) { this.brickCount++; }
            }
        }

        this.brick.width = this.window.width / map[0].length;
        this.brick.height = 0.6 * this.brick.width;
    }

    BounceFunc() {
        return {
            x: -this.ball.speed * Math.sin((this.carriage.x + this.carriage.width / 2 - this.ball.x) / (this.carriage.width * 0.8)),
            y: -this.ball.speed * Math.cos((this.carriage.x + this.carriage.width / 2 - this.ball.x) / (this.carriage.width * 0.8))
        }
    }

    DetectCollision(left, right, top, bottom) {
        let deltaX = this.ball.dx > 0 ? (this.ball.x + this.ball.dx + this.ball.rad) - left :
            right - (this.ball.x + this.ball.dx - this.ball.rad);
        let deltaY = this.ball.dy > 0 ? (this.ball.y + this.ball.dy + this.ball.rad) - top :
            bottom - (this.ball.y + this.ball.dy - this.ball.rad);
        if (!this.bonus.active.some(({ name }) => name === 'Through')) {
            if (deltaX > deltaY)
                return { dx: this.ball.dx, dy: -this.ball.dy };
            else if (deltaY > deltaX)
                return { dx: -this.ball.dx, dy: this.ball.dy };
            else if (Math.abs(deltaX - deltaY) < 2)
                return { dx: -this.ball.dx, dy: -this.ball.dy };
        }
        return { dx: this.ball.dx, dy: this.ball.dy }
    }

    Move() {
        if (!this.carriage.hasBall) {
            this.bonus.nextBonus--;
        }
        if (this.bonus.nextBonus === 0) {
            this.FallBonus();
        }
        for (let i = 0; i < this.bonus.active.length; i++) {
            this.bonus.active[i].duration--;
            if (this.bonus.active[i].duration === 0) {
                this.bonus.active.splice(i, 1);
            }
        }
        for (let i = 0; i < this.bonus.falling.length; i++) {
            this.bonus.falling[i].y += 0.5 * this.ball.speed;
            if (this.bonus.falling[i].y > this.window.height) {
                this.bonus.falling.splice(i, 1);
                continue;
            }
            if (this.bonus.falling[i].y + this.brick.width > this.carriage.y) {
                if (this.bonus.falling[i].x + this.brick.width >= this.carriage.x &&
                    this.bonus.falling[i].x <= this.carriage.x + this.carriage.width) {
                    this.SetBonus(i);
                    this.score += 25;
                    this.OnScoreChanged();
                }
            }
        }

        let nextCoordX = this.ball.x + this.ball.dx;
        let nextCoordY = this.ball.y + this.ball.dy;

        if (nextCoordX - this.ball.rad < 0) {
            this.ball.x = this.ball.rad;
            this.ball.dx = -this.ball.dx;
            return;
        }
        else if (nextCoordX + this.ball.rad > this.window.width) {
            this.ball.x = this.window.width - this.ball.rad;
            this.ball.dx = -this.ball.dx;
            return;
        }
        if (nextCoordY - this.ball.rad < 0) {
            this.ball.y = this.ball.rad;
            this.ball.dy = -this.ball.dy;
            return;
        }
        if (nextCoordY + this.ball.rad > this.window.height) {
            this.Lose();
            return;
        }

        for (let i = 0; i < this.bricks.length; i++) {
            for (let j = 0; j < this.bricks[i].length; j++) {
                if (this.bricks[i][j] === null) {
                    continue;
                }
                if (
                    ((this.ball.y + this.ball.dy + this.ball.rad) < (i * this.brick.height)) ||
                    ((this.ball.y + this.ball.dy - this.ball.rad) > ((i + 1) * this.brick.height)) ||
                    ((this.ball.x + this.ball.dx + this.ball.rad) < (j * this.brick.width)) ||
                    ((this.ball.x + this.ball.dx - this.ball.rad) > ((j + 1) * this.brick.width))
                ) { continue; }
                let newDelta = this.DetectCollision(j * this.brick.width, (j + 1) * this.brick.width,
                    i * this.brick.height, (i + 1) * this.brick.height);
                this.ball.dx = newDelta.dx;
                this.ball.dy = newDelta.dy;
                this.score += 50;
                this.OnScoreChanged()
                if (this.ball.speed < this.brick.height >> 1) {
                    this.ball.speed *= 1.01;
                }
                if (this.bricks[i][j].strength !== 1) {
                    this.bricks[i][j].strength -= 1;
                } else {
                    this.bricks[i][j] = null;
                    this.brickCount--;
                    if (this.brickCount === 0) {
                        this.Win();
                    }
                }
                return;
            }
        }

        if (this.ball.y + this.ball.rad + this.ball.dy > this.carriage.y) {
            if (this.ball.y - this.ball.rad + this.ball.dy < this.carriage.y + this.carriage.height &&
                this.ball.x + this.ball.rad + this.ball.dx >= this.carriage.x &&
                this.ball.x - this.ball.rad + this.ball.dx <= this.carriage.x + this.carriage.width) {
                let coord = this.BounceFunc();
                this.ball.dx = coord.x;
                this.ball.y = this.carriage.y - this.ball.rad;
                this.ball.dy = coord.y;
                return;
            }
        }

        this.ball.x = nextCoordX;
        this.ball.y = nextCoordY;
    }

    Lose() {
        this.lifes -= 1;
        this.OnLifesChanged();
        if (this.lifes !== 0) {
            this.ball.y = this.carriage.y - this.ball.rad;
            this.ball.x = this.carriage.x + this.carriage.width / 2;
            this.ball.dx = 0;
            this.ball.dy = 0;
            this.ball.speed = this.window.width / 150;
            this.carriage.hasBall = true;
        } else {
            this.stop = true;
            if (!IsMobile) { document.removeEventListener('keydown', this.OnKeyDown); }
        }
    }

    Win() {
        this.stop = true;
        if (!IsMobile) { document.removeEventListener('keydown', this.OnKeyDown); }
    }

    DrawBrick(i, j, brick) {
        switch (brick.style) {
            case 0:
                this.ctx.fillStyle = '#000';
                break;
            case 1:
                this.ctx.fillStyle = '#cc0000';
                break;
            case 2:
                this.ctx.fillStyle = '#00cc00';
                break;
            case 3:
                this.ctx.fillStyle = '#0000cc';
                break;
        }
        this.ctx.fillRect(this.window.offsetLeft + j * this.brick.width, this.window.offsetTop + i * this.brick.height,
            this.brick.width, this.brick.height);
    }

    DrawBall() {
        this.ctx.fillStyle = '#f00';
        this.ctx.beginPath();
        this.ctx.arc(this.window.offsetLeft + this.ball.x, this.window.offsetTop + this.ball.y, this.ball.rad, 0, 2 * Math.PI);
        this.ctx.fill();
    }

    DrawCarriage() {
        this.ctx.fillStyle = '#000';
        this.ctx.fillRect(this.window.offsetLeft + this.carriage.x, this.window.offsetTop + this.carriage.y,
            this.carriage.width, this.carriage.height);
    }

    DrawBonus(bonus) {
        let height = this.brick.width;
        if (bonus.y <= 0) {
            height += bonus.y;
        } else if (this.window.height - bonus.y < this.brick.width) {
            height = this.window.height - bonus.y;
        }
        this.ctx.fillStyle = '#ccc';
        this.ctx.fillRect(this.window.offsetLeft + bonus.x, bonus.y < 0 ? this.window.offsetTop : this.window.offsetTop + bonus.y,
            this.brick.width, height);
    }

    BeforeDraw() {
        this.ctx.clearRect(this.window.offsetLeft, this.window.offsetTop, this.window.width, this.window.height);
    }

    Draw = () => {
        if (this.stop) { return; }
        this.BeforeDraw();

        this.DrawBall();
        this.DrawCarriage();

        for (let i = 0; i < this.bricks.length; i++) {
            for (let j = 0; j < this.bricks[i].length; j++) {
                if (this.bricks[i][j] !== null) {
                    this.DrawBrick(i, j, this.bricks[i][j]);
                }
            }
        }

        for (let i = 0; i < this.bonus.falling.length; i++) {
            this.DrawBonus(this.bonus.falling[i]);
        }

        this.Move();
        requestAnimationFrame(this.Draw);
    }
}