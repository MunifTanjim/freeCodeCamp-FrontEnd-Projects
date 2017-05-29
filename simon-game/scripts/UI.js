const set = (display, content) => {
  display.innerHTML = content
}

const colors = ['#0F0', '#F00', '#00F', '#FF0']

const flick = (display, index) => {
  display.classList.add('changing')
  display.style.color = colors[index]
  setTimeout(() => {
    display.classList.remove('changing')
    display.style.color = ''
  }, 200)
}

function won(callback) {
  set(this.display, '**')

  let count = 0
  let winningCelebration = setInterval(() => {
    if (count < 8) {
      count++
      this.tapButton(count % 4)
    } else {
      callback()
      clearInterval(winningCelebration)
    }
  }, 250)
}

function penalty(callback) {
  set(this.display, '!!')

  let count = 0
  let penaltyMourning = setInterval(() => {
    if (count < 2) {
      count++
      for (let i = 0; i < 4; i++)
        this.tapButton(i)
    } else {
      callback()
      clearInterval(penaltyMourning)
    }
  }, 500)
}

class UI {
  constructor(audios, display, powerButton, strictButton, tapButtons) {
    this.audios = audios
    this.display = display
    this.tapButtons = tapButtons
    this.powerButton = powerButton
    this.strictButton = strictButton
  }

  clearDisplay() {
    set(this.display, '')
  }

  setPowerButton(isRunning) {
    if (isRunning) this.powerButton.classList.add('active')
    else this.powerButton.classList.remove('active')
  }

  setStrictButton(strictMode) {
    if (strictMode) this.strictButton.classList.add('active')
    else this.strictButton.classList.remove('active')
  }

  tapButton(index) {
    let audio = this.audios[index]
    audio.currentTime = 0
    audio.play()

    let button = this.tapButtons[index]
    button.classList.add('active')
    flick(this.display, index)
    setTimeout(() => button.classList.remove('active'), 250)
  }

  warn(state) {
    set(this.display, '--')
    setTimeout(() => this.update(state), 250)
  }

  update(state, callback) {
    if (state.won) won.call(this, callback)
    else if (state.penalty) penalty.call(this, callback)
    else {
      let currSeqLen = String(state.currSeq + 1)
      if (currSeqLen.length < 2) currSeqLen = `0${currSeqLen}`
      set(this.display, currSeqLen)
      if (callback) callback()
    }
  }
}

module.exports = UI
