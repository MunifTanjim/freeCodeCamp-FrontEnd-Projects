require('../stylesheets/style')

const docReady = (callback) => {
  if (document.readyState != 'loading')
    callback()
  else
    document.addEventListener('DOMContentLoaded', callback)
}

const secondsMultiplier = 60
let currentState = 'session'
let isRunning = false
let isPaused = true
let cycleCompleted = 0

let dataFor = {
  break: 5,
  session: 25,
  cycle: 4
}

const createMark = () => {
  let mark = document.createElement('div')
  mark.classList.add('mark')

  let sphere = document.createElement('div')
  sphere.classList.add('sphere')

  mark.appendChild(sphere)

  return mark
}

docReady(() => {
  const pomodoro = document.querySelector('.pomodoro')
  const clock = document.querySelector('.clock')
  const liquid = clock.querySelector('.liquid')
  const marksBlock = document.querySelector('.marks-block')
  const playPauseButton = document.querySelector('button.play-pause')
  const resetButton = document.querySelector('button.reset-clock')
  const controlButtons = document.querySelectorAll('.control button')
  const displayFor = {
    break: document.querySelector('.break-length span'),
    session: document.querySelector('.session-length span'),
    cycle: document.querySelector('.cycle span')
  }

  const updateMarks = (reset = false) => {
    let marks = marksBlock.querySelectorAll('.mark')
    let length = marks.length

    if (reset) {
      marks.forEach(mark => mark.removeAttribute('data-status'))
    }

    if (length === dataFor['cycle'])
      return

    if (length < dataFor['cycle']) {
      marksBlock.appendChild(createMark())
    } else if (length > dataFor['cycle']) {
      marksBlock.removeChild(marks[length - 1])
    }

    updateMarks()
  }

  const updateDataOf = (name, operation) => {
    if (operation === '-')
      (dataFor[name] > 1) && dataFor[name]--;
    else if (operation === '+')
      dataFor[name]++;
    }

  const updateDisplayOf = (name) => {
    let duration = dataFor[name].toString()

    if (duration.length < 2)
      duration = '0' + duration
    displayFor[name].innerHTML = duration
  }

  const updateAnimationDuration = (state) => {
    liquid.style.animationDuration = `${dataFor[state] * secondsMultiplier}s`
  }

  const resetPomodoro = () => {
    updateMarks(true)

    pomodoro.classList.remove(currentState)
    pomodoro.classList.remove('paused')

    currentState = 'session'
    isRunning = false
    isPaused = true
    cycleCompleted = 0
  }

  const handleClockClick = (e) => {
    e.preventDefault()

    if (isRunning) {
      pomodoro.classList.toggle('paused')
      isPaused = !isPaused
    } else {
      updateAnimationDuration(currentState)
      pomodoro.classList.add(currentState)
      isRunning = true
      isPaused = false
    }
  }

  const handleButtonClick = (e) => {
    e.preventDefault()

    let {name, op} = e.target.dataset

    if (!isPaused || (isRunning && name === 'cycle' && op === '-'))
      return

    updateDataOf(name, op)
    updateDisplayOf(name)

    if (name === 'cycle') {
      updateMarks()
    } else if (isRunning) {
      resetPomodoro()
    }
  }

  const handleStateSwap = (e) => {
    e.preventDefault()

    if (dataFor['cycle'] === cycleCompleted)
      return

    let lastState = currentState

    if (currentState === 'break') {
      currentState = 'session'
    } else if (currentState === 'session') {
      currentState = 'break'

      let marks = document.querySelectorAll('.mark')
      marks[cycleCompleted].dataset.status = 'done'
      cycleCompleted++
    }

    if (dataFor['cycle'] === cycleCompleted) {
      currentState = lastState
      setTimeout(resetPomodoro, 1000)
      return
    } else {
      updateAnimationDuration(currentState)
    }

    pomodoro.classList.remove(lastState)
    pomodoro.classList.add(currentState)
  }

  updateDisplayOf('break')
  updateDisplayOf('session')
  updateDisplayOf('cycle')
  updateMarks()

  clock.addEventListener('click', handleClockClick)

  controlButtons.forEach((button) => {
    button.addEventListener('click', handleButtonClick)
  })

  liquid.addEventListener('animationend', handleStateSwap)

  playPauseButton.addEventListener('click', handleClockClick)
  resetButton.addEventListener('click', (e) => {
    e.preventDefault()
    resetPomodoro()
  })
})
