import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';
import * as serviceWorker from './serviceWorker';

function Square(props) {
  return (
    <button className="square" onClick={props.onClick}>
      {props.value}
    </button>
  );
}

class Board extends React.Component {
  renderSquare(i) {
    return (
      <Square
        value={this.props.squares[i]}
        onClick={() => this.props.onClick(i)}
      />
    );
  }

  render() {
    return (
      <div>
        <div className="board-row">
          {this.renderSquare(0)}
          {this.renderSquare(1)}
          {this.renderSquare(2)}
        </div>
        <div className="board-row">
          {this.renderSquare(3)}
          {this.renderSquare(4)}
          {this.renderSquare(5)}
        </div>
        <div className="board-row">
          {this.renderSquare(6)}
          {this.renderSquare(7)}
          {this.renderSquare(8)}
        </div>
      </div>
    );
  }
}

class Game extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      history: [
        {
          squares: Array(9).fill(null)
        }
      ],
      stepNumber: 0,
      xIsNext: true
    };
  }
  /** CPU functions */

  /**
   * determines cpu's next move
   * @param squares current grid state
   */
  cpuMove(squares) {
    var result = squares;
    let pMvs = this.possibleMoves(squares, false);
    let max = -100000;
    let index = 0;
    for (var i = 0; i < pMvs.length; i++) {
      let rating = this.rateState(pMvs[i], true);
      if (rating > max) {
        max = rating;
        index = i;
      }
    }
    var countX = 0;
    var countO = 0;
    for (var i = 0; i<9; i++){
      if (squares[i] == "X"){
        countX += 1;
      }
      if (squares[i] == "O"){
        countO +=1;
      }
    }
    var topLeft = false;
    var topRight = false;
    var bottomLeft = false;
    var bottomRight = false;
    if (squares[0] == "X") {
      topLeft = true;
    } 
    if (squares[2] == "X"){
      topRight = true;
    }
    if (squares[6] == "X"){
      bottomLeft = true;
    }
    if (squares[8] == "X"){
      bottomRight = true;
    }
    if (topLeft && bottomRight && countX == 2){
      result[1] = "O";
    }else if (topRight && bottomLeft && countX == 2){
      result[1] = "O";
    }else{
      result = pMvs[index];
    }
    return result;
  }
  /**
   * rates how good state is for O
   * @param {*} state gamestate to be rated
   */
  rateState(state, xturn) {
    if (calculateWinner(state) == 'O') { //win awards points
      return 10;
    } else if (calculateWinner(state) == 'X') { //lose awards negative points
      return -100;
    } else if (calculateWinner(state) == null && !this.gridFull(state)) { //if nobody wins, create new array of possible states following current state
      let nextMoves = this.possibleMoves(state, xturn);
      let rating = 0
      for (var i = 0; i < nextMoves.length; i++) {
        rating += this.rateState(nextMoves[i], !xturn)/10.0
      }
      return rating;
    }
    else {
      return 0;
    }
  }
  gridFull(state) {
    let full = true;
    for (var i = 0; i < 9; i++) {
      if (state[i] == "" || state[i] == null) {
        full = false;
      }
    }
    return full;
  }
  possibleMoves(squares, xturn) {
    let states = new Array();
    for (var i = 0; i < 9; i++) { //iterating thru all possible grid positions
      if (squares[i] == "" || squares[i] == null) { //create possible grid of newstate where possible
        let temp = squares.slice();
        if (xturn) {
          temp[i] = 'X';
        } else {
          temp[i] = 'O';
        }
        states.push(temp);
      }
    }
    return states;
  }

/** Game Functions */

  handleClick(i) {
    const history = this.state.history.slice(0, this.state.stepNumber + 1);
    const current = history[history.length - 1];
    var squares = current.squares.slice();
    if (this.state.xIsNext) {
      squares[i] = 'X';
    } else {
      squares[i] = 'O';
    }
    this.setState(
    {
      history: history.concat([
        {
          squares: squares
        }
      ]),
      stepNumber: history.length,
      xIsNext: !this.state.xIsNext,
    },
    () => {
      const history = this.state.history.slice(0, this.state.stepNumber + 1);
      const current = history[history.length - 1];
      var squares = current.squares.slice();
      squares = this.cpuMove(squares);
      this.setState(
        {
          history: history.concat([
            {
              squares: squares
            }
          ]),
          stepNumber: history.length,
          xIsNext: !this.state.xIsNext,
        })
    })
  }

  jumpTo(step) {
    this.setState({
      stepNumber: step,
      xIsNext: (step % 2) === 0
    });
  }

  render() {
    const history = this.state.history;
    const current = history[this.state.stepNumber];
    console.log(current.squares)
    const winner = calculateWinner(current.squares);

    const moves = history.map((step, move) => {
      const desc = move ?
        'Go to move #' + move :
        'Go to game start';
      return (
        <li key={move}>
          <button onClick={() => this.jumpTo(move)}>{desc}</button>
        </li>
      );
    });

    let status;
    if (winner) {
      status = "Winner: " + winner;
    } else {
      status = "Next player: " + (this.state.xIsNext ? "X" : "O");
    }

    return (
      <div className="game">
        <div className="game-board">
          <Board
            squares={current.squares}
            onClick={i => this.handleClick(i)}
          />
        </div>
        <div className="game-info">
          <div>{status}</div>
          <ol>{moves}</ol>
        </div>
      </div>
    );
  }
}

// ========================================

ReactDOM.render(<Game />, document.getElementById("root"));

function calculateWinner(squares) {
  const lines = [
    [0, 1, 2],
    [3, 4, 5],
    [6, 7, 8],
    [0, 3, 6],
    [1, 4, 7],
    [2, 5, 8],
    [0, 4, 8],
    [2, 4, 6]
  ];
  for (let i = 0; i < lines.length; i++) {
    const [a, b, c] = lines[i];
    if (squares[a] && squares[a] === squares[b] && squares[a] === squares[c]) {
      return squares[a];
    }
  }
  return null;
}



