export default class View {
    static colors = {
        '1' : 'yellow',
        '2' : 'purple',
        '3' : 'red',
        '4' : 'cyan',
        '5' : 'green',
        '6' : 'blue',
        '7' : 'orange'
    }
    constructor(root, width, height, rows, columns) {
        this.root = root
        this.width = width
        this.height = height

        this.fieldWidth = this.width * 2 / 3
        this.fieldHeight = this.height

        this.fieldBorderWidth = 4
        this.fieldX = this.fieldBorderWidth
        this.fieldY = this.fieldBorderWidth

        this.fieldInnerWidth = this.fieldWidth - this.fieldBorderWidth * 2
        this.fieldInnerHeight = this.fieldHeight - this.fieldBorderWidth * 2

        this.blockWidth = this.fieldInnerWidth / columns
        this.blockHeight = this.fieldInnerHeight / rows

        this.infoX = this.fieldWidth + 10
        this.infoY = 0

        this.canvas = document.createElement('canvas')
        this.canvas.width = this.width
        this.canvas.height = this.height
        this.context = this.canvas.getContext('2d')
        this.root.appendChild(this.canvas)
    }
    render(state){
        this.clearScreen()
        this.renderField(state)
        this.renderInfo(state)
    }

    clearScreen(){
        this.context.clearRect(0,0,this.width, this.height)
    }

    renderField({playfield}){
        for (let y = 0; y < playfield.length; y++) {
            const line = playfield[y]
            for (let x = 0; x < line.length; x++) {
                const block = line [x]
                if (block){
                    this.renderBlock(this.fieldX + (x * this.blockWidth),
                        this.fieldY + (y * this.blockHeight),
                        this.blockWidth, this.blockHeight, View.colors[block])
                   }
            }
        }

        this.context.strokeStyle = 'white'
        this.context.lineWidth = this.fieldBorderWidth
        this.context.strokeRect(0, 0, this.fieldWidth, this.fieldHeight )
    }

    renderStart(){
        updateLeaderboard()
        this.context.fillStyle = 'white'
        this.context.font = '24px "arial"'
        this.context.textAlign = 'center'
        this.context.textBaseline = 'middle'
        this.context.fillText('Press enter to start..', this.width / 2, this.height / 2)
    }

    renderEnd({score}){
        this.clearScreen()
        updateLeaderboard()
        this.context.fillStyle = 'red'
        this.context.font = '24px "arial"'
        this.context.textAlign = 'center'
        this.context.textBaseline = 'middle'
        this.context.fillText('GAME OVER', this.width / 2, this.height / 2 - 52)
        this.context.fillText(`Score: ${score}`, this.width / 2, this.height / 2)
        this.context.fillText('Press enter to restart..', this.width / 2, this.height / 2 + 52)

    }
        renderInfo({playerName, level, score, lines, nextTetramino}){
        this.context.textAlign = 'start' // по левому краю
        this.context.textBaseline = 'top' // по верхнему
        this.context.fillStyle = 'white'
        this.context.font = '14px "arial"'

        this.context.fillText(`Player: ${playerName}`, this.infoX, this.infoY)
        this.context.fillText(`Score: ${score}`, this.infoX, this.infoY + 24)
        this.context.fillText(`Lines: ${lines}`, this.infoX, this.infoY + 48)
        this.context.fillText(`Level: ${level}`, this.infoX, this.infoY + 72)
        this.context.fillText('Next:', this.infoX + 0, this.infoY + 96)

        for (let y = 0; y < nextTetramino.blocks.length; y++) {
            for (let x = 0; x < nextTetramino.blocks[y].length; x++) {
                const block = nextTetramino.blocks[y][x]
                if (block){
                    this.renderBlock(
                        this.infoX + (x * this.blockWidth * 0.5),
                        this.infoY + 100 + (y * this.blockHeight) * 0.5,
                        this.blockWidth * 0.5,
                        this.blockHeight * 0.5,
                        View.colors[block]
                    )
                }
            }
        }

    }
    renderBlock (x, y, width, height, color){
        this.context.fillStyle = color
        this.context.strokeStyle = 'black' // обводка
        this.context.lineWidth = 2 // ширина обводки

        this.context.fillRect(x, y, width, height)
        this.context.strokeRect(x, y, width, height)

    }
}

function updateLeaderboard() {
    const leaderboardTable = document.getElementById("leaderboard").getElementsByTagName('tbody')[0];
    leaderboardTable.innerHTML = ""; // очистим текущую таблицу

    // рекорды из локального хранилища
    const storedLeaderboard = JSON.parse(localStorage.getItem("tetris.leaderboard")) || [];

    //  рекорды по возрастанию
    storedLeaderboard.sort((a, b) => b.score - a.score);

    // отображение рекордов
    storedLeaderboard.forEach((record, index) => {
        const row = leaderboardTable.insertRow(index);
        const playerNameCell = row.insertCell(0);
        const playerScoreCell = row.insertCell(1);

        playerNameCell.textContent = record.playerName;
        playerScoreCell.textContent = record.score;
    });
}