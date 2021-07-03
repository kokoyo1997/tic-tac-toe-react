import './index.css';
import ReactDOM from 'react-dom';
import { useState } from 'react';

function Square({value,onClick}){
    return (
        <button
            className="square"
            onClick={()=>onClick()}
        >{value}</button>
    )
}

function Board({squares,handleClick}){ 
    const renderSquare=(i)=>{
        return (
            <Square 
                value={squares[i]} 
                onClick={()=>handleClick(i)}
            />
        )
    }
    return (
        <div>
            <div className="board-row">
                {renderSquare(0)}
                {renderSquare(1)}
                {renderSquare(2)}
            </div>
            <div className="board-row">
                {renderSquare(3)}
                {renderSquare(4)}
                {renderSquare(5)}
            </div>
            <div className="board-row">
                {renderSquare(6)}
                {renderSquare(7)}
                {renderSquare(8)}
            </div>
        </div>
    );
    
}

function Game(){
    const [history,setHistory]=useState([new Array(9).fill(null)]);
    const [xIsNext,setXIsNext]=useState(true);
    const [step,setStep]=useState(0);

    const handleClick=(i)=>{
        let cur_history=history.slice(0,step+1);
        let squares=cur_history[cur_history.length-1];
        if(squares[i]||calculateWinner(squares)) return;
        let new_squares=squares.slice();
        new_squares[i]=xIsNext?'X':'O';
        setHistory([...cur_history,new_squares]);
        setXIsNext(prev=>!prev);
        setStep(cur_history.length);
    };

    const jumpTo=(target)=>{
        setStep(target);
        setXIsNext(target%2===0);
    };

    let squares=history[step];
    const winner=calculateWinner(squares);
    let status;
    if(winner){
        status='Winner: '+ winner;
    }else{
        status='Next player: '+ (xIsNext?'X':'O');
    }
    return (
        <div className="game">
            <div className="game-board">
                <Board 
                    squares={squares}
                    handleClick={handleClick}
                />
            </div>
            <div className="game-info">
                <div className="status">{status}</div>
                <ol>
                    {history.map((ele,idx)=>{
                        let res=idx===0?"Go to game start":`Go to move #${idx}`;
                        return (
                            <li key={idx}>
                                <button onClick={()=>jumpTo(idx)}>{res}</button>
                            </li>
                        )
                    })}
                </ol>
            </div>
        </div>
    );
}

ReactDOM.render(
    <Game />,
    document.getElementById('root')
);

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
        if (squares[a] && squares[a] === squares[b] && squares[a] === squares[c]) {
        return squares[a];
        }
    }
    return null;
}