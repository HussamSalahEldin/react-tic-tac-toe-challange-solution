// import logo from './logo.svg';
import './App.css';
import { useState } from 'react';

function Square({value, onSquareClick, winner = false}) {
  return (
    <button className={`square ${winner ? 'winner' : ''}`} onClick={onSquareClick}>
      {value}
    </button>
  );
}

export default function Game() {
  const [history, setHistory] = useState([Array(9).fill(null)]);
  const [currentMove, setCurrentMove] = useState(0);
  const isXNext = (currentMove % 2) === 0;
  const squares = history[currentMove];



  function handlePlay(currentSquares) {
    const newHistory = [...history.slice(0, currentMove + 1), currentSquares]
    setHistory(newHistory);
    setCurrentMove(newHistory.length - 1);
  }

  function jumpTo(step) {
    setCurrentMove(step);
  }

  const moves = history.map((step, move) => {
    const desc = move ? 'Go to move #' + move : 'Go to game start';
    if (move === currentMove) {
      return (
        <li key={move}>
          You are in move #{move}
        </li>
      );
    }

    return (
      <li key={move}>
        <button onClick={() => jumpTo(move)}>{desc}</button>
      </li>
    );

  });

  return (
    <div className="game">
      <div className="game-board">
        <Board isXNext={isXNext} squares={squares} onPlay={handlePlay} />
      </div>
      <div className="game-info">
        <div>{/* status */}</div>
        <ol>{moves}</ol>
      </div>
    </div>
  );
}


function Board({ isXNext, squares, onPlay }) {

  function handleClick(i) {
    let winner = calculateWinner(squares);
    if (squares[i] || winner.value)
      return;

    const newSquares = squares.slice();
    if (isXNext) {
      newSquares[i] = 'X';
    }
    else {
      newSquares[i] = 'O';
    }
    onPlay(newSquares);
  }

  let winner = calculateWinner(squares);
  let status = "";
  console.log(winner.value)
  if (winner.value) {
    status = 'Winner: ' + winner.value;
  }
  else if (winner.draw)
  {
    status = 'Draw';
  }
  else {
    status = 'Next player: ' + (isXNext ? 'X' : 'O');
  }

  return (
    <>
      <div className="status">{status}</div>
      {
        Array(3).fill(null).map(
          (_, row) => (
            <div className="board-row" key={row}>
              {
                Array(3).fill(null).map((_, col) => {
                  const index = row * 3 + col;
                  return (
                    <Square
                      key={index}
                      value={squares[index]}
                      onSquareClick={() => handleClick(index)}
                      winner={winner && winner.indexes?.includes(index)}
                    />
                  );
                })
              }
            </div>
          ))}
    </>
  );
};


function calculateWinner(squares) {
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
    if (squares[a]) {
      if (squares[a] === squares[b] && squares[a] === squares[c]) {
        return {
          value: squares[a],
          indexes: lines[i],
          draw: false
        };
      }
    }
  }
  return {
    value: null,
    indexes: null,
    draw: squares.every((square) => square !== null)
  };
}