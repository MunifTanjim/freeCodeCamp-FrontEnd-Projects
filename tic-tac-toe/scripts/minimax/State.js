/*
 * Represents a state in the game
 * @param old [State]: old state to intialize the new state
 */
class State {
  constructor(prevState) {
    /* public : the player who has the turn to player */
    this.turn = ''
    /* public : the number of moves of the AI player */
    this.oMovesCount = 0
    /* public : the result of the game in this State */
    this.result = 'still running'
    /* public : the board configuration in this state */
    this.board = []

    /* Begin Object Construction */
    if (typeof prevState !== 'undefined') {
      // if the state is constructed using a copy of another state
      let len = prevState.board.length
      this.board = new Array(len)
      for (let itr = 0; itr < len; itr++) {
        this.board[itr] = prevState.board[itr]
      }

      this.oMovesCount = prevState.oMovesCount
      this.result = prevState.result
      this.turn = prevState.turn
    }
    /* End Object Construction */
  }

  /*
   * public : advances the turn in a the state
   */
  advanceTurn() {
    this.turn = this.turn === 'X' ? 'O' : 'X'
  }

  /*
   * public function that enumerates the empty cells in state
   * @return [Array]: indices of all empty cells
   */
  emptyCells() {
    let indxs = []
    for (let itr = 0; itr < 9; itr++) {
      if (this.board[itr] === 'E') {
        indxs.push(itr)
      }
    }
    return indxs
  }

  /*
   * public  function that checks if the state is a terminal state or not
   * the state result is updated to reflect the result of the game
   * @returns [Boolean]: true if it's terminal, false otherwise
   */
  isTerminal() {
    let B = this.board

    //check rows
    for (let i = 0; i <= 6; i = i + 3) {
      if (B[i] !== 'E' && B[i] === B[i + 1] && B[i + 1] == B[i + 2]) {
        this.result = B[i] + '-won' //update the state result
        return true
      }
    }

    //check columns
    for (let i = 0; i <= 2; i++) {
      if (B[i] !== 'E' && B[i] === B[i + 3] && B[i + 3] === B[i + 6]) {
        this.result = B[i] + '-won' //update the state result
        return true
      }
    }

    //check diagonals
    for (let i = 0, j = 4; i <= 2; (i = i + 2), (j = j - 2)) {
      if (B[i] !== 'E' && B[i] == B[i + j] && B[i + j] === B[i + 2 * j]) {
        this.result = B[i] + '-won' //update the state result
        return true
      }
    }

    let available = this.emptyCells()
    if (!available.length) {
      //the game is draw
      this.result = 'draw' //update the state result
      return true
    } else {
      return false
    }
  }
}

module.exports = State
