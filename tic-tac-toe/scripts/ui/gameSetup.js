class Configuration {
  constructor() {
    this.option = {}

    this.setup = {
      difficulty: difficultySetup.bind(this),
      symbols: symbolSetup.bind(this),
      finish: finishSetup.bind(this)
    }
  }
}

function difficultySetup(buttons, callback) {
  const setDifficulty = e => {
    e.preventDefault()

    this.option.difficulty = e.target.id

    buttons.forEach(button =>
      button.removeEventListener('click', setDifficulty)
    )

    callback()
  }

  buttons.forEach(button => button.addEventListener('click', setDifficulty))
}

function symbolSetup(buttons, callback) {
  const setSymbol = e => {
    e.preventDefault()

    let symbol = e.target.id

    this.option.playerSymbol = symbol
    this.option.aiSymbol = symbol === 'X' ? 'O' : 'X'

    buttons.forEach(button => button.removeEventListener('click', setSymbol))

    callback()
  }

  buttons.forEach(button => button.addEventListener('click', setSymbol))
}

function finishSetup(buttons, callback) {
  buttons[0].addEventListener('click', configurationComplete)

  function configurationComplete(e) {
    e.preventDefault()
    callback()
  }
}

module.exports = Configuration
