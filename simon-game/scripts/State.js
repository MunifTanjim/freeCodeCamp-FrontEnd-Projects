const generateSeqs = (seqs, maxSteps) => {
  for (let i = 0; i < maxSteps; i++) {
    seqs[i] = i ? [...seqs[i - 1]] : []
    seqs[i].push(Math.floor(Math.random() * 4))
  }
}

class State {
  constructor(maxSteps) {
    this.isRunning = false
    this.strictMode = false

    this.won = false
    this.penalty = false

    this.maxSteps = maxSteps

    this.playerTurn = true

    this.seqs = []
    generateSeqs(this.seqs, this.maxSteps)

    this.stepToPlay = 0
    this.currSeq = 0
    this.stepToTap = 0
  }
}

module.exports = State
