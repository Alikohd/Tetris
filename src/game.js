import {rows, columns, points, linesForLevel, maxSymbolsInName, maxRecords} from "./game_constants.js";

export default class Game {
    constructor() {
    this.refresh()
    }

    get level() {
        return Math.floor(this.lines / linesForLevel)
    }
    moveTetraminoLeft(){
        this.activeTetramino.x -= 1
        if (this.hasCollision()){
            this.activeTetramino.x += 1
        }
    }

    moveTetraminoRight(){
        this.activeTetramino.x += 1
        if (this.hasCollision()){
            this.activeTetramino.x -= 1
        }
    }

    moveTetraminoDown(){
        if (this.gameOver)
            return

        this.activeTetramino.y += 1
        if (this.hasCollision()){
            this.activeTetramino.y -= 1
            this.fixTetramino()
            const clearedLines = this.clearLines()
            this.updateScore(clearedLines)
            this.refreshActiveTetramino()
        }

        if (this.hasCollision()){ // стакан переполнен
            this.gameOver = true
            this.saveRecord()
        }
    }

    saveRecord(){
        // сохраняем рекорд
        const newRecord = { playerName: this.playerName.slice(0,maxSymbolsInName), score: this.score };
        const existingRecords = JSON.parse(localStorage.getItem("tetris.leaderboard")) || [];
        existingRecords.push(newRecord);

        // от большего к меньшему
        existingRecords.sort((a, b) => b.score - a.score);

        if (existingRecords.length > maxRecords) {
            existingRecords.splice(maxRecords);
        }

        // сохраняем локально
        localStorage.setItem("tetris.leaderboard", JSON.stringify(existingRecords));
    }
    hasCollision() {
        const { activeTetramino, playfield } = this;
        const { blocks, x, y } = activeTetramino;

        for (let row = 0; row < blocks.length; row++) {
            for (let col = 0; col < blocks[row].length; col++) {
                if (blocks[row][col]) {
                    const playfieldY = y + row;
                    const playfieldX = x + col;

                    if (
                        playfieldY < 0 ||
                        playfieldY >= playfield.length ||
                        playfieldX < 0 ||
                        playfieldX >= playfield[0].length ||
                        playfield[playfieldY][playfieldX]   // пересечение
                    )
                    {
                        return true;
                    }
                }
            }
        }

        return false;
    }

    fixTetramino() {
        const { activeTetramino, playfield } = this;
        const { blocks, x, y } = activeTetramino;

        for (let row = 0; row < blocks.length; row++) {
            for (let col = 0; col < blocks[row].length; col++) {
                if (blocks[row][col]) {
                    playfield[y + row][x + col] = blocks[row][col];
                }
            }
        }
    }

    refresh (){
        this.playerName = localStorage.getItem("tetris.username");
        this.score = 0
        this.lines = 0
        this.gameOver = false
        this.playfield = this.createField()
        this.activeTetramino = this.createTetramino()
        this.nextTetramino = this.createTetramino()
    }


    rotate(){
        const blocks = this.activeTetramino.blocks
        const length = blocks.length

        const temp = []
        for (let i = 0; i < length; i++) {
            temp[i] = new Array(length).fill(0)
        }

        for (let y = 0; y < length; y++) {
            for (let x = 0; x < length; x++) {
                temp[x][y] = blocks[length - 1 - y][x]
            }
        }
        this.activeTetramino.blocks = temp
        if (this.hasCollision()){
            this.activeTetramino.blocks = blocks
        }
    }

    getState(){
        const playfield = this.createField()
        const blocks = this.activeTetramino.blocks

        for (let y = 0; y < this.playfield.length; y++) {
            playfield[y] = []

            for (let x = 0; x < this.playfield[y].length; x++) {
                playfield[y][x] = this.playfield[y][x]
            }
        }

        for (let y = 0; y < blocks.length ; y++) {
            for (let x = 0; x < blocks[y].length ; x++) {
                if (blocks[y][x]){
                    playfield[this.activeTetramino.y + y][this.activeTetramino.x + x] = blocks[y][x]
                }
            }
        }

        return {
            playerName: this.playerName,
            score: this.score,
            level: this.level,
            lines: this.lines,
            nextTetramino: this.nextTetramino,
            playfield,
            isGameOver: this.gameOver
        }
    }

    createField(){
        const playfield = []
        for (let y = 0; y < rows; y++) {
            playfield[y] = []
            for (let x = 0; x < columns; x++) {
                playfield[y][x] = 0
            }
        }
        return playfield
    }

    createTetramino(){
        const index = Math.floor(Math.random() * 7) //  7 тетрамино
        const type = 'IJLOSTZ'[index]

        const piece = {}
        switch (type){
            case 'I':
                piece.blocks = [
                    [0,0,0,0],
                    [1,1,1,1],
                    [0,0,0,0],
                    [0,0,0,0]
                ]
                break

            case 'J':
                piece.blocks = [
                    [0,0,0],
                    [2,2,2],
                    [0,0,2]
                ]
                break

            case 'L':
                piece.blocks = [
                    [0,0,0],
                    [3,3,3],
                    [3,0,0]
                ]
                break

            case 'O':
                piece.blocks = [
                    [0,0,0,0],
                    [0,4,4,0],
                    [0,4,4,0],
                    [0,0,0,0]
                ]
                break

            case 'S':
                piece.blocks = [
                    [0,0,0],
                    [0,5,5],
                    [5,5,0]
                ]
                break

            case 'T':
                piece.blocks = [
                    [0,0,0],
                    [6,6,6],
                    [0,6,0]
                ]
                break

            case 'Z':
                piece.blocks = [
                    [0,0,0],
                    [7,7,0],
                    [0,7,7]
                ]
                break

            default:
                throw new Error ('неизвестная фигура')

        }

        // piece.x = Math.floor((10 - piece.blocks[0].length) / 2)
        piece.x = Math.floor(Math.random() * (6 - 2 + 1)) + 2;
        piece.y = -1

        return piece
    }

    refreshActiveTetramino(){
        this.activeTetramino = this.nextTetramino
        this.nextTetramino = this.createTetramino()
    }

    clearLines() {
        const linesToRemove = [];

        for (let y = rows - 1; y >= 0; y--) {
            let isLineFull = true;

            for (let x = 0; x < columns; x++) {
                if (!this.playfield[y][x]) {
                    isLineFull = false;
                    break;
                }
            }

            if (isLineFull) {
                linesToRemove.unshift(y); // удаляем в обратном порядке!!
                                            // чтобы текущее удаление не влияло на последующее
            }
        }

        if (linesToRemove.length > 0) {
            for (const lineIndex of linesToRemove) {
                this.playfield.splice(lineIndex, 1);
                this.playfield.unshift(new Array(columns).fill(0));
            }
        }

        return linesToRemove.length;
    }


    updateScore(clearedLines){
        if (clearedLines > 0){
            // начисление очков со множителем
            this.score += points[clearedLines] * (this.level + 1) // начальный уровень нулевой
            this.lines += clearedLines
        }
    }
}
