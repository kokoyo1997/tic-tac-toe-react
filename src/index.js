import './index.css';
import ReactDOM from 'react-dom';
import { useState } from 'react';

function Square({value,onClick,flag}){
    
    return (
        <button
            className={flag?"square highlight":"square"}
            onClick={()=>onClick()}
        >{value}</button>
    )
}

function Board({squares,handleClick,highlight}){ 
    const renderSquare=(i)=>{
        let flag=false;
        if(highlight&&highlight.indexOf(i)>-1) flag=true;
        return (
            <Square 
                value={squares[i]} 
                onClick={()=>handleClick(i)}
                key={i}
                flag={flag}
            />
        )
    };
    return (
        <div>
            {
                Array(3).fill(null).map((row,idx)=>{
                    return (
                        <div className="board-row" key={idx}>
                            {
                                Array(3).fill(null).map((col,idx2)=>renderSquare(3*idx+idx2))
                            }
                        </div>
                    )
                })
            }
        </div>
    );
    
}

function Game(){
    const [history,setHistory]=useState([{
        squares:new Array(9).fill(null),
        location: null
    }]);
    const [xIsNext,setXIsNext]=useState(true);
    const [step,setStep]=useState(0);
    const [reverse,setReverse]=useState(false);

    const handleClick=(i)=>{
        let cur_history=history.slice(0,step+1);
        let squares=cur_history[cur_history.length-1].squares;
        if(squares[i]||calculateWinner(squares)) return;
        let new_squares=squares.slice();
        new_squares[i]=xIsNext?'X':'O';
        setHistory([...cur_history,{
            squares:new_squares,
            location: index2Loc(i)
        }]);
        setXIsNext(prev=>!prev);
        setStep(cur_history.length);
    };
    const handleReverse=()=>{
        setReverse(prev=>!prev);
    };

    const jumpTo=(target)=>{
        setStep(target);
        setXIsNext(target%2===0);
    };

    let squares=history[step].squares;
    const winner=calculateWinner(squares);
    let highlight=null;
    let status;
    if(winner){
        status='Winner: '+ winner.winner;
        highlight=winner.idxs;
    }else{
        if(step===9) status='Draw';
        else status='Next player: '+ (xIsNext?'X':'O');
    }

    let history_list=history.map((ele,idx)=>{
        let res=idx===0?"Go to game start":`Go to move #${idx} (${ele.location})`;
        let bold=idx===step?"bold":"";
        return (
            <li key={idx} className={bold}>
                <button onClick={()=>jumpTo(idx)}>{res}</button>
            </li>
        )
    });

    return (
        <div className="game">
            <div className="game-board">
                <Board 
                    squares={squares}
                    handleClick={handleClick}
                    highlight={highlight}
                />
            </div>
            <div className="game-info">
                <div className="status">{status}</div>
                <button onClick={()=>handleReverse()}>Reverse</button>
                <ul>
                    {reverse?history_list.reverse():history_list}
                </ul>
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
            return {
                winner:squares[a],
                idxs:[a,b,c]
            };
        }
    }
    return null;
}

function index2Loc(idx){
    let row=Math.floor(idx/3);
    let col=idx%3;
    return [col,row];
}