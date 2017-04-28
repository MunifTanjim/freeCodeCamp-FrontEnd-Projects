const State = require('./State')

/*
 * Constructs an action that the ai player could make
 * @param pos [Number]: the cell position the ai would make its action in
 * made that action
 */
class AIAction {
  constructor(pos) {
    // public : the position on the board that the action would put the letter on
    this.movePosition = pos

    //public : the minimax value of the state that the action leads to when applied
    this.minimaxVal = 0
  }

  /*
   * public : applies the action to a state to get the next state
   * @param state [State]: the state to apply the action to
   * @return [State]: the next state
   */
  applyTo(state) {
    let nextState = new State(state)

    //put the letter on the board
    nextState.board[this.movePosition] = state.turn

    if (state.turn === 'O') nextState.oMovesCount++

    nextState.advanceTurn()

    return nextState
  }

  /*
   * public static method that defines a rule for sorting AIAction in ascending manner
   * @param firstAction [AIAction] : the first action in a pairwise sort
   * @param secondAction [AIAction]: the second action in a pairwise sort
   * @return [Number]: -1, 1, or 0
   */
  static ASCENDING(firstAction, secondAction) {
    if (firstAction.minimaxVal < secondAction.minimaxVal)
      //indicates that firstAction goes before secondAction
      return -1
    else if (firstAction.minimaxVal > secondAction.minimaxVal)
      //indicates that secondAction goes before firstAction
      return 1
    else return 0 //indicates a tie
  }

  /*
   * public static method that defines a rule for sorting AIAction in descending manner
   * @param firstAction [AIAction] : the first action in a pairwise sort
   * @param secondAction [AIAction]: the second action in a pairwise sort
   * @return [Number]: -1, 1, or 0
   */
  static DESCENDING(firstAction, secondAction) {
    if (firstAction.minimaxVal > secondAction.minimaxVal)
      //indicates that firstAction goes before secondAction
      return -1
    else if (firstAction.minimaxVal < secondAction.minimaxVal)
      //indicates that secondAction goes before firstAction
      return 1
    else return 0 //indicates a tie
  }
}

module.exports = AIAction
