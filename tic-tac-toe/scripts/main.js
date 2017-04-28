require('../stylesheets/style')
require('../humans.txt')

const UI = require('./ui/UI')
const Game = require('./minimax/Game')
const AI = require('./minimax/AI')

function docReady(callback) {
  if (document.readyState != 'loading') callback()
  else document.addEventListener('DOMContentLoaded', callback)
}

const boardSize = 300

const config = {}

const parts = {
  ai: null,
  ui: null,
  game: null
}

const aiFakeThinkingDelay = true

docReady(() => {
  const restartButton = document.querySelector('button#restart')
  restartButton.addEventListener('click', (e) => {
    e.preventDefault()
    window.location.reload()
  })

  parts.ui = new UI(document, boardSize, bindParts, aiFakeThinkingDelay)
  parts.ui.init()
})

function bindParts(callback) {
  Object.assign(config, parts.ui.config.option)

  /* Initializations */
  parts.ai = new AI(config.difficulty)
  parts.game = new Game(parts.ai)

  /* Bindings */
  parts.ai.plays(parts.game)
  parts.ai.setUI(parts.ui)
  parts.ui.setGame(parts.game)
  parts.game.setUI(parts.ui)

  callback()
}
