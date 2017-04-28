const Canvas = require('./Canvas')
const gameSetup = require('./gameSetup')
const State = require('../minimax/State')

const detectCellCornersFor = (coord, cellCornersStore) =>
  cellCornersStore.filter(cell => {
    let withinX = coord.x > cell[0][0] && coord.x < cell[1][0]
    let withinY = coord.y > cell[0][1] && coord.y < cell[1][1]
    return withinX && withinY
  })[0]

const getCoords = (left, top, x, y) => ({
  x: x - left,
  y: y - top
})

class UI {
  constructor(document, boardSize, bindParts, aifakeDelay) {
    this.body = document.body

    /* Measurements for the Board */
    this.size = {}
    this.size.board = boardSize
    this.size.cell = this.size.board / 3
    this.size.cellPadding = this.size.cell / 10
    this.size.canvasPadding = this.size.board / 30
    this.size.canvas = this.size.board + this.size.canvasPadding * 2

    this.board = document.querySelector('#board')
    this.board.height = this.size.canvas
    this.board.width = this.size.canvas

    this.ctx = this.board.getContext('2d')
    this.canvas = new Canvas(this.size)

    this.config = new gameSetup()
    this.setupSteps = ['difficulty', 'symbols', 'finish']
    this.aifakeDelay = aifakeDelay

    this.bindParts = bindParts

    //private attribute: the game the ui is using
    this.game = {}
  }

  init() {
    this.switchConfigView('difficulty')
  }

  draw() {
    Canvas.drawBoard(this.ctx, this.size)

    this.board.addEventListener('click', handleClick.bind(this))
  }

  insertSymbol(index, symbol, boardState) {
    let corners = this.canvas.cellCornersStore[index]
    let isEmpty = boardState[index] === 'E'

    if (corners && isEmpty) {
      this.ctx.lineWidth = 2
      this.canvas.draw[symbol](this.ctx, corners, this.size)
      this.ctx.lineWidth = 1
    }
  }

  switchConfigView(step) {
    let buttons = this.body.querySelectorAll(`.${step}-setup button`)
    this.body.classList = `setup ${step}`

    let setupStepIndex = this.setupSteps.indexOf(step)

    const callback = () => {
      if (setupStepIndex < this.setupSteps.length - 1) {
        this.switchConfigView(this.setupSteps[setupStepIndex + 1])
      } else {
        this.body.classList = 'game'

        this.bindParts(() => {
          this.draw()
          this.game.start()
        })
      }
    }

    this.config.setup[step](buttons, callback)
  }

  switchViewTo(turn) {
    //helper function for async calling
    const _switch = _turn => {
      this.body.id = _turn
    }

    _switch(turn)
  }

  /*
   * public method to specify the game the ui will use
   * @param _game [Game] : the game the ui will use
   */
  setGame(_game) {
    this.game = _game
  }
}

function handleClick(e) {
  e.preventDefault()

  let { offsetLeft: left, offsetTop: top } = this.board
  let { clientX: x, clientY: y } = e

  let corners = detectCellCornersFor(
    getCoords(left, top, x, y),
    this.canvas.cellCornersStore
  )

  let index = this.canvas.cellCornersStore.indexOf(corners)

  let { currentState, status } = this.game

  let isEmpty = currentState.board[index] === 'E'

  if (
    isEmpty &&
    status === 'running' &&
    currentState.turn === this.config.option.playerSymbol
  ) {
    let nextState = new State(currentState)

    this.insertSymbol(index, currentState.turn, currentState.board)

    nextState.board[index] = currentState.turn
    nextState.advanceTurn()

    this.game.advanceTo(nextState)
  }
}

module.exports = UI
