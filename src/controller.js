export default class Controller{
    constructor(game, view) {
        this.game = game
        this.view = view
        this.IntervalId = null
        this.process = false
        document.addEventListener('keydown', this.keyDownHandler.bind(this)) // не теряем контекст

        this.view.renderStart()
    }

    update(){
        const state = this.game.getState()
        if (state.isGameOver){
            this.process = false
            this.view.renderEnd(state)
        }

        else {
            this.game.moveTetraminoDown()
            this.view.render(state)
        }
    }

    startTimer(){
        const speed = 1000 - this.game.getState().level * 100
        if (!this.IntervalId){
        this.IntervalId = setInterval(() => {
            this.update()
        }, speed > 0 ? speed : 100) // может обнулиться
    }
        else {
            clearInterval(this.IntervalId)
            this.IntervalId = setInterval(() => {
                    this.update()
                }, speed > 0 ? speed : 100)
        }
    }

    play () {
        this.process = true
        this.startTimer()
        this.view.render(this.game.getState())
    }

    reset() {
        this.game.refresh()
        this.play()
    }
    keyDownHandler(event){
        const state = this.game.getState()
        switch (event.keyCode){
            case 13: // enter
                if (state.isGameOver){
                    this.reset()
                }
                else {
                this.play()
                //this.view.render(this.game.getState())
                }
                break
            case 37: // левая стрелка
                if (this.process){
                this.game.moveTetraminoLeft()
                this.play()
                    //this.view.render(this.game.getState())
                }
                break
            case 38: // вверхняя
                if (this.process){
                this.game.rotate()
                this.play()
                    //this.view.render(this.game.getState())
                }
                break
            case 39: // правая
                if (this.process){
                this.game.moveTetraminoRight()
                this.play()
                    //this.view.render(this.game.getState())
                }
                break
            case 40: // нижняя
                if (this.process){
                this.game.moveTetraminoDown()
                this.play()
                    //this.view.render(this.game.getState())
                }
                break
        }
    }
}



