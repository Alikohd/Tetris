import Game from './game.js'
import View from "./view.js";
import Controller from "./controller.js";

const root  = document.querySelector('#tetris')

const game = new Game()
const view = new View(root, 480, 640, 20, 10)
const controller = new Controller(game, view)

// window.game = game
// window.view = view
// window.controller = controller

