import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';
import * as serviceWorker from './serviceWorker';

class Table extends React.Component {
    constructor(){
        super();
        this.state = {
            turn: "X",
            gridRep: [0,1,2,3,4,5,6,7,8],
            cpu: false
        }
    }
    goCheck(){
        var y3 = this.state.gridRep[0] == this.state.gridRep[1] && this.state.gridRep[1] == this.state.gridRep[2];
        var y2 = this.state.gridRep[3] == this.state.gridRep[4] && this.state.gridRep[4] == this.state.gridRep[5];
        var y1 = this.state.gridRep[6] == this.state.gridRep[7] && this.state.gridRep[7] == this.state.gridRep[8];
        var x3 = this.state.gridRep[0] == this.state.gridRep[3] && this.state.gridRep[3] == this.state.gridRep[6];
        var x2 = this.state.gridRep[1] == this.state.gridRep[4] && this.state.gridRep[4] == this.state.gridRep[7];
        var x1 = this.state.gridRep[2] == this.state.gridRep[5] && this.state.gridRep[5] == this.state.gridRep[8];
        var leftdiagonal = this.state.gridRep[2] == this.state.gridRep[4] && this.state.gridRep[4] == this.state.gridRep[6];
        var rightdiagonal = this.state.gridRep[0] == this.state.gridRep[4] && this.state.gridRep[4] == this.state.gridRep[8];
        if (y3||y2||y1||x3||x2||x1||leftdiagonal||rightdiagonal) {
            alert(this.state.turn + " Wins!");
            var i = 0;
            for(i= 0; i < document.getElementsByName("squares").length; i++){
                document.getElementsByName("squares")[i].value = "";
            }
            this.setState({gridRep: [0,1,2,3,4,5,6,7,8]});
            this.setState({cpu: false});
            this.setState({turn: "X"});
            console.log("win");
        }

    }
    startWtihCPU = () => {
        var i = 0;
        for(i= 0; i < document.getElementsByName("squares").length; i++){
            document.getElementsByName("squares")[i].value = "";
        }
        this.setState({gridRep: [0,1,2,3,4,5,6,7,8]});
        this.setState({cpu: true});
        this.setState({turn: "X"});
    }
    selectBox(gridNum){
        var tempgridRep = this.state.gridRep;
        if(tempgridRep[gridNum] != "X" && tempgridRep[gridNum] != "O"){
            document.getElementsByName("squares")[gridNum].value = this.state.turn;
            tempgridRep[gridNum] = this.state.turn;
            this.setState({gridRep: tempgridRep});
            this.goCheck();
            if (this.state.turn == "X") {
                this.setState({turn:"O"});
                console.log(this.state.turn);
            }else{
                this.setState({turn:"X"})
                console.log(this.state.turn);
            }
            if (this.state.cpu == true) {
                this.cpuTurn();
                console.log("t")
            }
        }
    } 
    cpuTurn(){
        var tempgridRep = this.state.gridRep;
        var i = 0;
            while(tempgridRep[i] == "X" || tempgridRep[i] == "O"){
                i++;
            }
            document.getElementsByName("squares")[i].value = "O";
            tempgridRep[i] = "O";
            this.setState({gridRep: tempgridRep});
            this.goCheck();
            this.setState({turn:"X"})
    }
    render() {
        return( 
            <>
            <h1>TicTacToe</h1>
            <table id = "table">
                <tbody>
                <tr>
                    <td><input type = "button" name = "squares" type = "button"  onClick = {this.selectBox.bind(this, 0)}></input></td>
                    <td><input type = "button" name = "squares" type = "button" onClick = {this.selectBox.bind(this, 1)}></input></td>
                    <td><input type = "button" name = "squares" type = "button" onClick = {this.selectBox.bind(this, 2)}></input></td>
                </tr>
                <tr>
                    <td><input type = "button" name = "squares" type = "button" onClick = {this.selectBox.bind(this, 3)}></input></td>
                    <td><input type = "button" name = "squares" type = "button" onClick = {this.selectBox.bind(this, 4)}></input></td>
                    <td><input type = "button" name = "squares" type = "button" onClick = {this.selectBox.bind(this, 5)}></input></td>
                </tr>
                <tr>
                    <td><input type = "button" name = "squares" type = "button" onClick = {this.selectBox.bind(this, 6)}></input></td>
                    <td><input type = "button" name = "squares" type = "button" onClick = {this.selectBox.bind(this, 7)}></input></td>
                    <td><input type = "button" name = "squares" type = "button" onClick = {this.selectBox.bind(this, 8)}></input></td>
                </tr>
                </tbody>
            </table>
            <input type = "button" id = "cpu" value = "Start new game with CPU player (It will play as circles)" onClick = {this.startWtihCPU}></input>
            </>
        );
    }
}
ReactDOM.render(<Table />, document.getElementById('root'));

// If you want your app to work offline and load faster, you can change
// unregister() to register() below. Note this comes with some pitfalls.
// Learn more about service workers: https://bit.ly/CRA-PWA
serviceWorker.unregister();
