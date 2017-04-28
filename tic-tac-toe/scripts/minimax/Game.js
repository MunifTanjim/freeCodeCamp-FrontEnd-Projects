const State = require('./State')

/*
 * Constructs a game object to be played
 * @param autoPlayer [AIPlayer] : the AI player to be play the game with
 */
class Game {
  constructor(autoPlayer) {
    //public : initialize the ai player for this game
    this.ai = autoPlayer

    // public : initialize the game current state to empty board configuration
    this.currentState = new State()

    //"E" stands for empty board cell
    this.currentState.board = ['E', 'E', 'E', 'E', 'E', 'E', 'E', 'E', 'E']

    this.currentState.turn = 'X' //X plays first

    /*
     * initialize game status to beginning
     */
    this.status = 'beginning'

    // private attribute: the ui the game is using
    this.ui = {}
  }

  /*
   * public function that advances the game to a new state
   * @param _state [State]: the new state to advance the game to
   */
  advanceTo(_state) {
    this.currentState = _state

    if (_state.isTerminal()) {
      this.status = 'ended'

      if (_state.result === 'X-won')
        if (this.ui.config.option.playerSymbol === 'X')
          //X won
          this.ui.switchViewTo('won')
        else
          //X lost
          this.ui.switchViewTo('lost')
      else if (_state.result === 'O-won')
        if (this.ui.config.option.playerSymbol === 'O')
          //X won
          this.ui.switchViewTo('won')
        else
          //X lost
          this.ui.switchViewTo('lost')
      else
        //it's a draw
        this.ui.switchViewTo('draw')
    } else {
      //the game is still running

      if (this.currentState.turn === this.ui.config.option.playerSymbol) {
        this.ui.switchViewTo('human')
      } else {
        this.ui.switchViewTo('robot')

        //notify the AI player its turn has come up
        if (this.ui.aifakeDelay) {
          let delay = Math.random() * 1000
          setTimeout(() => this.ai.notify(), delay)
        } else {
          this.ai.notify()
        }
      }
    }
  }

  /*
   * starts the game
   */
  start() {
    if (this.status == 'beginning') {
      //invoke advanceTo with the intial state
      this.advanceTo(this.currentState)
      this.status = 'running'
    }
  }

  /*
   * public static function that calculates the score of the x player in a terminal state
   * @param _state [State]: the state in which the score is calculated
   * @return [Number]: the score calculated for the human player
   */
  static score(_state) {
    if (_state.result !== 'still running') {
      if (_state.result === 'X-won') {
        // the x player won
        return 10 - _state.oMovesCount
      } else if (_state.result === 'O-won') {
        //the x player lost
        return -10 + _state.oMovesCount
      } else {
        //it's a draw
        return 0
      }
    }
  }

  /*
   * public method to specify the ui the game will use
   * @param _ui [UI] : the ui the game will use
   */
  setUI(_ui) {
    this.ui = _ui
  }
}

module.exports = Game
