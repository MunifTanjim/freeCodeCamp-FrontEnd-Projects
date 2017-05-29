import State from './State'

class Game {
  constructor(maxSteps) {
    this.maxSteps = maxSteps

    this.state = new State(this.maxSteps)

    this.ui = {}
  }

  bindUI(_ui) {
    this.ui = _ui
  }

  playSequence() {
    let { state, ui } = this

    let { seqs } = state

    let buttonIndex = seqs[state.currSeq][state.stepToPlay]
    this.tap(ui.tapButtons[buttonIndex])

    if (state.stepToPlay === state.currSeq) {
      setTimeout(() => {
        state.stepToPlay = 0
        state.playerTurn = true
      }, 250)
    } else {
      state.stepToPlay++
      setTimeout(() => {
        this.playSequence()
      }, 500)
    }
  }

  processPlayerTap(tappedButtonIndex) {
    let { state, ui } = this

    let targetButtonIndex = state.seqs[state.currSeq][state.stepToTap]

    if (tappedButtonIndex === targetButtonIndex) {
      let seqComplete = state.stepToTap === state.currSeq

      if (!seqComplete) state.stepToTap++
      else {
        state.playerTurn = false
        state.stepToTap = 0
        state.currSeq++

        if (state.maxSteps === state.currSeq) {
          state.won = true
          ui.update(state, () => this.togglePower())
        } else {
          ui.update(state)
          setTimeout(() => this.playSequence(), 750)
        }
      }
    } else {
      if (state.strictMode) {
        state.penalty = true
        ui.update(state, () => this.togglePower())
      } else {
        state.playerTurn = false
        state.stepToTap = 0
        ui.warn(state)

        setTimeout(() => this.playSequence(), 750)
      }
    }
  }

  togglePower() {
    let { state, ui } = this

    ui.setPowerButton(!state.isRunning)

    if (state.isRunning) {
      this.state = new State(this.maxSteps)
      ui.clearDisplay()
      ui.setStrictButton(this.state.strictMode)
    } else {
      state.isRunning = true
      state.playerTurn = false
      ui.update(state, () => {
        setTimeout(() => this.playSequence(), 750)
      })
    }
  }

  toggleStrict() {
    let { state, ui } = this
    ui.setStrictButton(!state.strictMode)
    state.strictMode = !state.strictMode
  }

  tap(button) {
    let buttonIndex = parseInt(button.dataset.index)

    this.ui.tapButton(buttonIndex)

    if (this.state.playerTurn) this.processPlayerTap(buttonIndex)
  }
}

module.exports = Game
