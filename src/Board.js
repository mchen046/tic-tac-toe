import React from "react";

import Square from "./Square";

import "./style.css";

class Board extends React.Component {
  renderSquare(i) {
    return (
      <Square
        value={this.props.squares[i]}
        isWinning={this.props.winningSquares.includes(i)}
        onClick={() => this.props.onClick(i)}
      />
    );
  }

  render() {
    const boardSz = 3;
    const board = [];
    for (let i = 0; i < boardSz; i++) {
      const row = [];
      for (let j = 0; j < boardSz; j++)
        row.push(this.renderSquare(i * boardSz + j));
      board.push(<div className="board-row">{row}</div>);
    }
    return <div>{board}</div>;
  }
}

export default Board;
