import { randomInt } from '@/utils.js';

function windowToCanvas(canvas, x, y) {
    var bbox = canvas.getBoundingClientRect();
    if (bbox.width === 0 || bbox.height === 0) {
        return { X: 0, Y: 0 }
    }
    return {
        X: x - bbox.left * (canvas.width / bbox.width),
        Y: y - bbox.top * (canvas.height / bbox.height)
    };
}

export class Arkanoid {
    constructor(canvas, OnScoreChanged, OnLifesChanged) {
        this.OnScoreChanged = OnScoreChanged;
        this.OnLifesChanged = OnLifesChanged;
        this.ctx = canvas.getContext('2d');
        this.window = {
            width: canvas.width,
            height: canvas.height
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
            speed: 3,
            dx: 0,
            dy: 0,
            rad: this.window.width / 40,
        }
        document.onkeydown = this.OnKeyDown.bind(this);
        canvas.onmousemove = (event) => {
            let loc = windowToCanvas(canvas, event.clientX, event.clientY);
            let lastCarrieage = this.carriage.x;
            loc.X -= this.carriage.width / 2;
            if (loc.X <= 0) {
                this.carriage.x = 0;
            } else if (loc.X + this.carriage.width >= canvas.width) {
                this.carriage.x = canvas.width - this.carriage.width;
            } else {
                this.carriage.x = loc.X;
            }
            if (this.carriage.hasBall) {
                this.ball.x -= lastCarrieage - this.carriage.x;
            }
        };
        canvas.onclick = (event) => {
            event.preventDefault();
            if (this.carriage.hasBall) {
                let coord = this.BounceFunc();
                this.ball.dx = coord.x;
                this.ball.dy = coord.y;
                this.carriage.hasBall = false;
            }
        }
    }

    OnKeyDown(event) {
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
        this.carriage.hasBall = true;
        this.ball.rad = this.window.width / 40;
        this.ball.x = this.window.width / 2;
        this.ball.y = this.carriage.y - this.ball.rad;
        this.ball.dx = 0;
        this.ball.dy = 0;
        this.ball.speed = 3;
        this.bonus = {
            active: [],
            nextBonus: randomInt(300, 900),
            falling: [],
        }
        this.lifes = 3;
        this.score = 0;
        this.OnLifesChanged();
        this.OnScoreChanged();
        document.onkeydown = document.onkeydown ?? this.OnKeyDown.bind(this);
        if (this.stop) {
            this.stop = false;
            this.Draw();
        }
    }

    Stop() {
        this.stop = true;
        document.onkeydown = null;
    }

    Resize(canvas) {
        this.carriage.width = this.window.width / 5;
        this.carriage.height = this.window.width / 40;
        this.carriage.x = this.carriage.x / this.window.width * canvas.width;
        this.carriage.y = canvas.height - this.carriage.height;
        this.ball.rad = this.window.width / 40;
        this.ball.x = this.carriage.hasBall ?
            this.carriage.x + this.carriage.width / 2 :
            this.ball.x / this.window.width * canvas.width;
        this.ball.y = this.carriage.hasBall ?
            this.carriage.y - this.ball.rad :
            this.ball.y / this.window.height * canvas.height;
        this.window = {
            width: canvas.width,
            height: canvas.height
        };
        this.brick.width = canvas.width / this.bricks[0].length;
        this.brick.height = 0.6 * this.brick.width;
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
            this.ball.speed = 3;
            this.carriage.hasBall = true;
        } else {
            this.stop = true;
        }
    }

    Win() {
        this.stop = true;
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
        this.ctx.fillRect(j * this.brick.width, i * this.brick.height, this.brick.width, this.brick.height);
    }

    DrawBall() {
        this.ctx.fillStyle = '#f00';
        this.ctx.beginPath();
        this.ctx.arc(this.ball.x, this.ball.y, this.ball.rad, 0, 2 * Math.PI);
        this.ctx.fill();
    }

    DrawCarriage() {
        this.ctx.fillStyle = '#000';
        this.ctx.fillRect(this.carriage.x, this.carriage.y, this.carriage.width, this.carriage.height);
    }

    DrawBonus(bonus) {
        this.ctx.fillStyle = '#ccc';
        this.ctx.fillRect(bonus.x, bonus.y, this.brick.width, this.brick.width);
    }

    Draw() {
        this.ctx.clearRect(0, 0, this.window.width, this.window.height);

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
        if (!this.stop) {
            requestAnimationFrame(this.Draw.bind(this));
        }

        this.Move();
    }
}