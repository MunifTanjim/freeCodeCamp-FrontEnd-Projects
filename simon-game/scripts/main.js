import '../stylesheets/style'

import docReady from 'es6-docready'

import Game from './Game'
import UI from './UI'

const maxSteps = 20
const game = new Game(maxSteps)

docReady(() => {
  const tapButtons = document.querySelectorAll('.tap')
  const powerButton = document.querySelector('button#power')
  const strictButton = document.querySelector('button#strict')
  const counterDisplay = document.querySelector('.counter span')
  const audios = document.querySelectorAll('audio')

  const ui = new UI(
    audios,
    counterDisplay,
    powerButton,
    strictButton,
    tapButtons
  )
  game.bindUI(ui)

  tapButtons.forEach(button => {
    button.addEventListener('click', e => {
      e.preventDefault()
      if (game.state.isRunning && game.state.playerTurn) game.tap(button)
    })
  })

  powerButton.addEventListener('click', e => {
    e.preventDefault()
    if (game.state.playerTurn) game.togglePower()
  })

  strictButton.addEventListener('click', e => {
    e.preventDefault()
    if (game.state.playerTurn) game.toggleStrict()
  })
})
