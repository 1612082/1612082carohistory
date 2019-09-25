import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';
import 'bootstrap/dist/css/bootstrap.min.css';
//import { Button } from 'reactstrap';
//import { Table } from 'reactstrap'; 
//import App from './App';
import * as serviceWorker from './serviceWorker';

//ReactDOM.render(<App />, document.getElementById('root'));

// If you want your app to work offline and load faster, you can change
// unregister() to register() below. Note this comes with some pitfalls.
// Learn more about service workers: https://bit.ly/CRA-PWA
serviceWorker.unregister();
const SizeBoard = 20;
let isLose = false; 
let winArray =[];
var flag=false;
function Square(props) {
    const className = 'square' + (props.highlight ? ' highlight' : '');
    return (
      
      <button  className={className} onClick={props.onClick}>
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
          highlight={winArray && winArray.includes(i)}
        />
      );
    }
  
    render() {
        let gameBoard = [];
        for (let i = 0; i < SizeBoard; i++) {
            let row = [];
            for (let j = 0; j < SizeBoard; j++) {
                row.push(this.renderSquare(i * SizeBoard + j));
            }
            gameBoard.push(<div className="board-row">{row}</div>)
        }
    
      return (
        <div>{gameBoard}</div>
      );
    }
  }
  
  class Game extends React.Component {
    constructor(props) {
      super(props);
      this.state = {
        history: [
          {
            squares: Array(SizeBoard * SizeBoard).fill(null)
          }
        ],
        stepNumber: 0,
        xIsNext: true,
        isAscending: true,
        location: null,
      };
     
    }
  
    handleClick(i) {
      const history = this.state.history.slice(0, this.state.stepNumber + 1);
      const current = history[history.length - 1];
      const squares = current.squares.slice();
      if (isLose === true || squares[i]) {
        return;
      }
      squares[i] = this.state.xIsNext ? "X" : "O";
      let value = i;
      this.setState({
        history: history.concat([
          {
            squares: squares,
            latestMoveSquare: i
          }
        ]),
        stepNumber: history.length,
        xIsNext: !this.state.xIsNext,
        location: value,
      });
    }
  
    jumpTo(step) {
        this.setState({
        stepNumber: step,
        xIsNext: (step % 2) === 0
        });
    }
    handleSortToggle() {
        this.setState({
          isAscending: !this.state.isAscending
        });
      }
    render() {
      const history = this.state.history;
      const current = history[this.state.stepNumber];
      const locat = this.state.location;
      const winner = calculateWinner(current.squares,locat);
      const stepNumber = this.state.stepNumber;

      const isAscending = this.state.isAscending;
      const moves = history.map((step, move) => {
        const latestMoveSquare = step.latestMoveSquare;
        const col = 1 + latestMoveSquare % SizeBoard;
        const row = 1 + Math.floor(latestMoveSquare / SizeBoard);
        const desc = move ?
          `Go to move #${move} ( ${row}, ${col})` :
          'Go to begin game';
        return (
          <li key={move}>
            <button className={move === stepNumber ? 'move-list-item-selected' : ''}
            onClick={() => this.jumpTo(move)}>{desc}</button>
          </li>
        );
      });
      
      if (!isAscending) {
        moves.reverse();
      }
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
            <button onClick={() => this.handleSortToggle()}>
          {isAscending ? 'descending' : 'ascending'}
        </button>
            <ol>{moves}</ol>
          </div>
        </div>
      );
    }
  }
  
  // ========================================
  
  ReactDOM.render(<Game />, document.getElementById("root"));
  function clearArr(){
    while (winArray.length) {
      winArray.pop();
    }
  }
  function checkHorizontally(squares, cell)
{
    if(flag===true) return;
    var count = 1;
    var rowId = Math.floor(cell / SizeBoard);
    var colId = cell - rowId * SizeBoard;
    var curSqr = squares[cell];
    var temp = colId-1; 
    winArray[0]=cell;

    while (temp >= 0 && squares[rowId*SizeBoard+temp]===curSqr){
      
      winArray.push(rowId*SizeBoard+temp);
        count = count + 1;
        temp = temp - 1;
        
    }
    temp = colId+1;
    while (temp  <= 19 && squares[rowId*SizeBoard+temp]===curSqr){
      
      winArray.push(rowId*SizeBoard+temp);
        count = count + 1;
        temp = temp + 1;
        
    }
    if (count === 5){
      flag=true;
      return curSqr;
    }
    else {
      clearArr();
      return;
    }
}
function checkVertically(squares, cell)
{
  if(flag===true) return;
    var count = 1;
    var rowId = Math.floor(cell / SizeBoard);
    var colId = cell - rowId * SizeBoard;
    var curSqr = squares[cell];
    var temp = rowId-1; 
    winArray.push(cell);
    while (temp >= 0 && squares[temp*SizeBoard+colId]===curSqr){
      winArray.push(temp*SizeBoard+colId);
        count = count + 1;
        temp = temp - 1;
        
    }
    temp = rowId+1;
    while (temp  <= 19 && squares[temp*SizeBoard+colId]===curSqr){
      winArray.push(temp*SizeBoard+colId);
        count = count + 1;
        temp = temp + 1;
        
    }
    if (count === 5){
      flag=true;
      return curSqr;
    }
    else {
      clearArr();
      return;
    }
}
function checkDuongCheo1(squares, cell)
{
  if(flag===true) return;
    var count = 1;
    var rowId = Math.floor(cell / SizeBoard);
    var colId = cell - rowId * SizeBoard;
    var curSqr = squares[cell];
    var tempCol = colId - 1; 
    var tempRow = rowId + 1;
    winArray.push(cell);
    while (tempCol >= 0 && tempRow <= 19 && squares[tempRow*SizeBoard+tempCol]===curSqr){
      winArray.push(tempRow*SizeBoard+tempCol);
        count = count + 1;
        tempCol = tempCol - 1;
        tempRow = tempRow + 1;
        
    }
    tempCol = colId + 1; 
    tempRow = rowId - 1;
    while (tempCol <= 19 && tempRow >= 0 && squares[tempRow*SizeBoard+tempCol]===curSqr){
      winArray.push(tempRow*SizeBoard+tempCol);
        count = count + 1;
        tempCol = tempCol + 1;
        tempRow = tempRow - 1;
        
    }
    if (count === 5){
      flag=true;

        return curSqr;
    }
    else {
      clearArr();
      return;
    }
}
function checkDuongCheo2(squares, cell){
  if(flag===true) return;
    var count = 1;
    var rowId = Math.floor(cell / SizeBoard);
    var colId = cell - rowId * SizeBoard;
    var curSqr = squares[cell];
    var tempCol = colId + 1; 
    var tempRow = rowId + 1;
    winArray.push(cell);
    while (tempCol <= 19 && tempRow <= 19 && squares[tempRow*SizeBoard+tempCol]===curSqr){
      winArray.push(tempRow*SizeBoard+tempCol);
        count = count + 1;
        tempCol = tempCol + 1;
        tempRow = tempRow + 1;
       
    }
    tempCol = colId - 1; 
    tempRow = rowId - 1;
    while (tempCol >= 0 && tempRow >= 0 && squares[tempRow*SizeBoard+tempCol]===curSqr){
      winArray.push(tempRow*SizeBoard+tempCol);
        count = count + 1;
        tempCol = tempCol - 1;
        tempRow = tempRow - 1;
        
    }
    if (count === 5){
      flag=true;

        return curSqr;
    }
    else {
      clearArr();
      return;
    }
}
function calculateWinner(squares, cell) {
  var horizontally = checkHorizontally(squares,cell);
  var vertically = checkVertically(squares,cell);
  var duongcheo1 = checkDuongCheo1(squares,cell);
  var duongcheo2 = checkDuongCheo2(squares,cell);
  if (horizontally)
  {
    isLose = true;
    return horizontally;
        
  }
  else if (vertically)
  {
    isLose = true;
    return vertically;
  }
  else if (duongcheo1)
  {
    isLose = true;
    return duongcheo1;
  }
  else if (duongcheo2)
  {

    isLose = true;
    return duongcheo2;
  }

  isLose = false;
  flag=false;
  return null;
}
  