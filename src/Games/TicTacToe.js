import { randomInt } from '@/utils.js';

export class TicTacToe {
    constructor(onMatrixChanged, onCrossChanged) {
        this.matrix = Array(9).fill(null);
        this.cross = null;

        this.onMatrixChanged = onMatrixChanged;
        this.onCrossChanged = onCrossChanged;

        this.winner = null;
        this.step = 0;
        this.firstIsNext = true;
        this.withAI = true;
        this.firstPlayer = 'X';
        this.secondPlayer = 'O';
        this.difficultyLevel = 1;
    }

    IsNext(player) {
        return (this.firstPlayer === player && this.firstIsNext) || (this.secondPlayer === player && !this.firstIsNext)
    }

    Reset() {
        this.matrix = this.matrix.fill(null);
        this.cross = null;

        this.step = 0;
        this.winner = null;
        this.firstIsNext = true;
        this.onMatrixChanged(null);
        this.onCrossChanged(null);
    }

    Check(player) {
        const lines = [
            [0, 1, 2, 0],
            [3, 4, 5, 1],
            [6, 7, 8, 2],
            [0, 3, 6, 3],
            [1, 4, 7, 4],
            [2, 5, 8, 5],
            [0, 4, 8, 6],
            [2, 4, 6, 7],
        ];
        for (let line of lines) {
            if (this.matrix[line[0]] === player && this.matrix[line[1]] === player && this.matrix[line[2]] === player) {
                return line[3];
            }
        }
        return null;
    }

    EmptyIndices(matrix) {
        let availSpots = [];
        matrix.forEach((spot, index) => {
            if (spot === null) {
                availSpots.push(index);
            }
        });
        return availSpots;
    }

    EasyPCMove() {
        let availSpots = this.EmptyIndices(this.matrix);
        let index = availSpots[randomInt(0, availSpots.length - 1)];
        this.matrix[index] = this.secondPlayer;
        this.firstIsNext = !this.firstIsNext;
        this.onMatrixChanged(index);

        let status = this.Check(this.secondPlayer)
        if (status !== null) {
            this.winner = this.secondPlayer;
            this.cross = status;
            this.onCrossChanged();
        }
    }

    Minimax(player) {
        let array = this.EmptyIndices(this.matrix);
        if (this.Check(this.firstPlayer) !== null) {
            return {
                score: -10
            };
        } else if (this.Check(this.secondPlayer) !== null) {
            return {
                score: 10
            };
        } else if (array.length === 0) {
            return {
                score: 0
            };
        }

        let moves = [];
        for (let i = 0; i < array.length; i++) {
            let move = {};
            move.index = array[i];
            this.matrix[array[i]] = player;

            if (player === this.firstPlayer) {
                let g = this.Minimax(this.secondPlayer);
                move.score = g.score;
            } else {
                let g = this.Minimax(this.firstPlayer);
                move.score = g.score;
            }
            this.matrix[array[i]] = null;
            moves.push(move);
        }

        let bestMove;
        if (player === this.secondPlayer) {
            let bestScore = -10000;
            for (let i = 0; i < moves.length; i++) {
                if (moves[i].score > bestScore) {
                    bestScore = moves[i].score;
                    bestMove = i;
                }
            }
        } else {
            let bestScore = 10000;
            for (let i = 0; i < moves.length; i++) {
                if (moves[i].score < bestScore) {
                    bestScore = moves[i].score;
                    bestMove = i;
                }
            }
        }
        return moves[bestMove];
    }

    HardPCMove() {
        let index = this.Minimax(this.secondPlayer).index;
        this.matrix[index] = this.secondPlayer;
        this.firstIsNext = !this.firstIsNext;
        this.onMatrixChanged(index);

        let status = this.Check(this.secondPlayer)
        if (status !== null) {
            this.winner = this.secondPlayer;
            this.cross = status;
            this.onCrossChanged();
        }
    }

    HandleClick(i) {
        if (this.winner || this.matrix[i]) { return; }

        this.step++;

        this.matrix[i] = this.firstIsNext ? this.firstPlayer : this.secondPlayer;
        let status = this.Check(this.firstIsNext ? this.firstPlayer : this.secondPlayer)

        this.firstIsNext = !this.firstIsNext;
        this.onMatrixChanged(i);

        if (status !== null) {
            this.winner = this.firstIsNext ? this.firstPlayer : this.secondPlayer;
            this.cross = status;
            this.onCrossChanged();
            return;
        }
        if (!this.matrix.includes(null)) {
            this.winner = 'nobody';
            return;
        }
        if (this.withAI) {
            setTimeout(() => {
                if (this.difficultyLevel === 0) {
                    this.EasyPCMove();
                } else if (this.difficultyLevel === 1) {
                    if (this.step < 2) {
                        this.EasyPCMove();
                    } else {
                        this.HardPCMove();
                    }
                } else {
                    this.HardPCMove();
                }
            }, 500);
        }
    }
}