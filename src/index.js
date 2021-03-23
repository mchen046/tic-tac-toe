import React from "react";
import ReactDOM from "react-dom";

import Button from "react-bootstrap/Button";
import Square from "./Square";
import Board from "./Board";
import "bootstrap/dist/css/bootstrap.css";

import "./style.css";

/*
Add a toggle button that lets you sort the moves in either ascending or descending order.
*/

/*
game begins at move 0.
@ move 0, choose to play as X or O first
@ move 1, begin placements

if xFirst:
  i = 1, place X
  i = 2, place O
  i = 3, place X

if !xFirst:
  i = 1, place O
  i = 2, place X
  i = 3, place O
*/
class Game extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      // stores grid states. initially stores an empty grid of null values
      history: [
        {
          squares: Array(9).fill(null),
          modifiedCellIdx: -1,
        },
      ],
      winningSquares: [],
      winner: null,
      xFirst: true,
      move: 0,
    };
  }

  /*
  jump to move i
  if jumping to move 2, you must splice history to contain only 0...1 inclusively
  */
  jumpTo(i) {
    this.setState({
      history:
        i == 0
          ? this.state.history.slice(0, 1)
          : this.state.history.slice(0, i),
      move: i,
      winningSquares: [],
      winner: null,
    });
  }

  boardIsFull(squares) {
    for (let i = 0; i < 9; i++) if (squares[i] == null) return false;
    return true;
  }

  calcWinner(squares) {
    const lines = [
      [0, 1, 2],
      [3, 4, 5],
      [6, 7, 8],
      [0, 3, 6],
      [1, 4, 7],
      [2, 5, 8],
      [0, 4, 8],
      [2, 4, 6],
    ];
    for (let i = 0; i < lines.length; i++) {
      const [a, b, c] = lines[i];
      const p = squares[a];
      if (p && squares[b] == p && squares[c] == p) {
        // add square to winningSquares
        this.setState({
          winningSquares: lines[i],
          winner: p,
        });
      }
    }
  }

  getPlayer(i) {
    let player;
    if (this.state.xFirst) {
      if (i % 2 == 0) player = "O";
      else player = "X";
    } else {
      if (i % 2 == 0) player = "X";
      else player = "O";
    }
    return player;
  }

  handleClick(i) {
    const history = this.state.history.slice();
    const curr = history[this.state.history.length - 1];
    const squares = curr.squares.slice();

    if (squares[i]) return;

    squares[i] = this.getPlayer(this.state.move);

    this.calcWinner(squares);

    if (this.state.winner) return;

    this.setState({
      history: history.concat([
        {
          squares: squares,
          modifiedCellIdx: i,
        },
      ]),
      move: this.state.move + 1,
    });
  }

  createMsg(i) {
    return "move #" + i + " | " + this.getPlayer(i) + "'s turn";
  }

  // provide option to start as X or O
  choosePlayer(player) {
    this.setState({
      xFirst: player == "X" ? true : false,
      move: 1,
    });
  }

  render() {
    const curr = this.state.history[this.state.history.length - 1];

    let status;
    let options;
    // provide option to start as X or O
    if (this.state.move == 0) {
      status = "Who do you want to play as?";
      options = (
        <>
          <button
            type="button"
            className="btn btn-danger btn-lg mr-1 mt-1"
            onClick={() => {
              this.choosePlayer("X");
            }}
          >
            {"X"}
          </button>
          <button
            type="button"
            className="btn btn-primary btn-lg mr-1 mt-1"
            onClick={() => {
              this.choosePlayer("O");
            }}
          >
            {"O"}
          </button>
        </>
      );
    } else {
      // create time travel or restart game options
      const curr = this.state.history[this.state.history.length - 1];

      // set status
      if (this.state.winner)
        status = "Congratulations " + this.state.winner + "! You win!";
      else if (this.boardIsFull(curr.squares))
        status = "Cat's game! Please restart the game or go back to a move.";
      else status = this.createMsg(this.state.move);

      /*
      @i: ith move, e.g. ith ele in history
        key of list button is the index of the list button
      */
      options = this.state.history.map((move, i) => {
        const row = Math.floor(move.modifiedCellIdx / 3);
        const col = move.modifiedCellIdx % 3;
        const desc = i
          ? "Jump back to " +
            this.createMsg(i) +
            " @ (" +
            row +
            ", " +
            col +
            ")"
          : "Restart game";
        return (
          <li key={i}>
            <button
              type="button"
              class="btn btn-secondary mt-1"
              onClick={() => this.jumpTo(i)}
            >
              {desc}
            </button>
          </li>
        );
      });
    }

    return (
      <div className="game">
        {this.state.move > 0 && (
          <div className="game-board">
            <Board
              squares={curr.squares}
              winningSquares={this.state.winningSquares}
              onClick={(i) => this.handleClick(i)}
            />
          </div>
        )}
        <div className="game-info">
          <div>{status}</div>
          <ul>{options}</ul>
        </div>
      </div>
    );
  }
}

// ========================================

ReactDOM.render(<Game />, document.getElementById("root"));
