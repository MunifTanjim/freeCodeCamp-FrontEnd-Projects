const Game = require('./Game')
const AIAction = require('./AIAction')

/*
 * Constructs an AI player with a specific level of intelligence
 * @param level [String]: the desired level of intelligence
 */
class AI {
  constructor(level) {
    //private attribute: level of intelligence the player has
    this.levelOfIntelligence = level

    //private attribute: the game the player is playing
    this.game = {}

    // private attribute: the ui the ai is using
    this.ui = {}
  }

  /*
   * private function: make the ai player take a blind move
   * that is: choose the cell to place its symbol randomly
   * @param turn [String]: the player to play, either X or O
   */
  takeABlindMove() {
    let available = this.game.currentState.emptyCells()
    let randomCell = available[Math.floor(Math.random() * available.length)]
    let action = new AIAction(randomCell)

    let nextState = action.applyTo(this.game.currentState)

    let { board, turn } = this.game.currentState

    this.ui.insertSymbol(randomCell, turn, board)

    this.game.advanceTo(nextState)
  }

  /*
     * private function: make the ai player take a novice move,
     * that is: mix between choosing the optimal and suboptimal minimax decisions
     * @param turn [String]: the player to play, either X or O
     */
  takeANoviceMove() {
    let available = this.game.currentState.emptyCells()

    //enumerate and calculate the score for each available actions to the ai player
    let availableActions = available.map(pos => {
      let action = new AIAction(pos) //create the action object

      //get next state by applying the action
      let nextState = action.applyTo(this.game.currentState)

      //calculate and set the action's minimax value
      action.minimaxVal = minimaxValue(nextState)

      return action
    })

    let { board, turn } = this.game.currentState

    //sort the enumerated actions list by score
    if (turn === 'X')
      //X maximizes --> decend sort the actions to have the maximum minimax at first
      availableActions.sort(AIAction.DESCENDING)
    else
      //O minimizes --> ascend sort the actions to have the minimum minimax at first
      availableActions.sort(AIAction.ASCENDING)

    /*
     * take the optimal action 40% of the time
     * take the 1st suboptimal action 60% of the time
     */
    let chosenAction
    if (Math.random() * 100 <= 40) {
      chosenAction = availableActions[0]
    } else {
      if (availableActions.length >= 2) {
        //if there is two or more available actions, choose the 1st suboptimal
        chosenAction = availableActions[1]
      } else {
        //choose the only available actions
        chosenAction = availableActions[0]
      }
    }
    let nextState = chosenAction.applyTo(this.game.currentState)

    this.ui.insertSymbol(chosenAction.movePosition, turn, board)

    this.game.advanceTo(nextState)
  }

  /*
   * private function: make the ai player take a master move,
   * that is: choose the optimal minimax decision
   * @param turn [String]: the player to play, either X or O
   */
  takeAMasterMove() {
    let available = this.game.currentState.emptyCells()

    //enumerate and calculate the score for each avaialable actions to the ai player
    let availableActions = available.map(pos => {
      let action = new AIAction(pos) //create the action object

      //get next state by applying the action
      let nextState = action.applyTo(this.game.currentState)

      //calculate and set the action's minmax value
      action.minimaxVal = minimaxValue(nextState)

      return action
    })

    let { board, turn } = this.game.currentState

    // sort the enumerated actions list by score
    if (turn === 'X')
      // X maximizes --> descend sort the actions to have the largest minimax at first
      availableActions.sort(AIAction.DESCENDING)
    else
      // O minimizes --> acend sort the actions to have the smallest minimax at first
      availableActions.sort(AIAction.ASCENDING)

    // take the first action as it's the optimal
    let chosenAction = availableActions[0]
    let nextState = chosenAction.applyTo(this.game.currentState)

    // this just adds an X or an O at the chosen position on the board in the UI
    this.ui.insertSymbol(chosenAction.movePosition, turn, board)

    // take the game to the next state
    this.game.advanceTo(nextState)
  }

  /*
     * public function: notify the ai player that it's its turn
     * @param turn [String]: the player to play, either X or O
     */
  notify() {
    switch (this.levelOfIntelligence) {
      //invoke the desired behavior based on the level chosen
      case 'blind':
        this.takeABlindMove()
        break
      case 'novice':
        this.takeANoviceMove()
        break
      case 'master':
        this.takeAMasterMove()
        break
    }
  }

  /*
   * public method to specify the game the ai player will play
   * @param _game [Game] : the game the ai will play
   */
  plays(_game) {
    this.game = _game
  }

  /*
   * public method to specify the ui the ai will use
   * @param _ui [UI] : the ui the ai will use
   */
  setUI(_ui) {
    this.ui = _ui
  }
}

/*
 * private recursive function that computes the minimax value of a game state
 * @param state [State] : the state to calculate its minimax value
 * @returns [Number]: the minimax value of the state
 */
function minimaxValue(state) {
  if (state.isTerminal()) {
    //a terminal game state is the base case
    return Game.score(state)
  } else {
    let stateScore // this stores the minimax value we'll compute

    if (state.turn === 'X')
      // X maximizes --> initialize to a value smaller than any possible score
      stateScore = -1000
    else
      // O minimizes --> initialize to a value larger than any possible score
      stateScore = 1000

    let availablePositions = state.emptyCells()

    // enumerate next available states using the info form available positions
    let availableNextStates = availablePositions.map(pos => {
      let action = new AIAction(pos)

      let nextState = action.applyTo(state)

      return nextState
    })

    /* calculate the minimax value for all available next states
     * and evaluate the current state's value */
    availableNextStates.forEach(nextState => {
      let nextScore = minimaxValue(nextState) //recursive call

      if (state.turn === 'X') {
        // X wants to maximize --> update stateScore iff nextScore is larger
        if (nextScore > stateScore) stateScore = nextScore
      } else {
        // O wants to minimize --> update stateScore iff nextScore is smaller
        if (nextScore < stateScore) stateScore = nextScore
      }
    })

    //backup the minimax value
    return stateScore
  }
}

module.exports = AI
