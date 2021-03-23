import React from "react";

import "./style.css";

function Square(props) {
  return (
    <button
      className={"square " + (props.isWinning ? "square--highlight" : "null")}
      onClick={props.onClick}
    >
      {props.value}
    </button>
  );
}

export default Square;
