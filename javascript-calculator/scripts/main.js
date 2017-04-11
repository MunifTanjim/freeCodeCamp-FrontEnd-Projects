require('../stylesheets/style')

function docReady(callback) {
  if (document.readyState != 'loading')
    callback()
  else
    document.addEventListener('DOMContentLoaded', callback)
}

const isDigit = (entry) => entry.match(/[0-9]/)
const isFunct = (entry) => entry.match(/[+\-*/]/)
const isDot = (entry) => entry.match(/\./)
const isEqual = (entry) => entry.match(/=/)
const isClear = (entry) => entry.match(/c/)

const getType = (entry) => {
  if (isDigit(entry))
    return 'digit'
  else if (isFunct(entry))
    return 'funct'
  else if (isDot(entry))
    return 'dot'
  else if (isEqual(entry))
    return 'equal'
  else if (isClear(entry))
    return 'clear'
}

let maxCurrLength = 12
let maxLogLength = 24

let currExp = ''
let expLog = ''
let lastEntry = '0'
let hasDot = false
let showingAnswer = false

docReady(() => {
  const currDisplay = document.querySelector('.current')
  const logDisplay = document.querySelector('.log')
  const keypadButtons = document.querySelectorAll('.keypad button')
  const functButtons = document.querySelectorAll('.functions button')
  const buttons = [
    ...keypadButtons,
    ...functButtons
  ]

  const updateDisplay = () => {
    currDisplay.innerHTML = currExp
    logDisplay.innerHTML = expLog
  }

  const resetDisplay = () => {
    currDisplay.innerHTML = '0'
    logDisplay.innerHTML = '0'
  }

  const showError = () => {
    currDisplay.innerHTML = '0'
    logDisplay.innerHTML = 'ERR: Digit Limit Crossed'
  }

  const clearMemory = () => {
    currExp = ''
    expLog = ''
    lastEntry = '0'
    hasDot = false
    resetDisplay()
  }

  const addEntry = (entry, newSegment = false) => {
    if (currExp.length < maxCurrLength && expLog.length < maxLogLength) {
      if (newSegment)
        currExp = entry
      else
        currExp += entry
      expLog += entry
      lastEntry = entry
      updateDisplay()
    } else {
      currExp = ''
      expLog = ''
      lastEntry = '0'
      showError()
    }
  }

  const evaluateExpression = () => {
    let ans = eval(expLog).toFixed(6)
    ans = Number(ans).toString()
    currExp = ans
    expLog += '=' + ans
    showingAnswer = true
    lastEntry = ans[ans.length - 1]
    if (currExp.length <= maxCurrLength && expLog.length <= maxLogLength)
      updateDisplay()
    else
      showError()
  }

  const handleButtonClick = (e) => {
    e.preventDefault()

    let {value: entry} = e.target
    let entryType = getType(entry)

    switch (entryType) {
      case 'digit':
        if (isFunct(lastEntry) || showingAnswer) {
          if (showingAnswer) {
            showingAnswer = false
            expLog = ''
          }
          addEntry(entry, true)
          hasDot = false
        } else {
          addEntry(entry)
        }
        break;
      case 'funct':
        if (currExp === '' && entry.match(/[*/]/))
          return

        if (isDigit(lastEntry)) {
          if (showingAnswer) {
            showingAnswer = false
            expLog = expLog.substring(expLog.indexOf('=') + 1)
          }
          addEntry(entry, true)
        }
        break;
      case 'dot':
        if (!hasDot && !showingAnswer && isDigit(lastEntry) || isFunct(lastEntry)) {
          addEntry(entry)
          hasDot = true
        }
        break;
      case 'equal':
        if (!showingAnswer && isDigit(lastEntry))
          evaluateExpression()
        break;
      case 'clear':
        clearMemory()
        break;
    }
  }

  resetDisplay()

  keypadButtons.forEach((button) => {
    button.addEventListener('click', (e) => e.target.classList.add('tap-dark'))
    button.addEventListener('animationend', (e) => {
      e.target.classList.remove('tap-dark')
    })
  })

  functButtons.forEach((button) => {
    button.addEventListener('click', (e) => e.target.classList.add('tap-light'))
    button.addEventListener('animationend', (e) => {
      e.target.classList.remove('tap-light')
    })
  })

  buttons.forEach(button => {
    button.addEventListener('click', handleButtonClick)
  })
})
