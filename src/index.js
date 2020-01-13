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
            }else{
                this.setState({turn:"X"});
            }
            if (this.state.cpu == true) {
                this.cpuTurn();
            }
        }
    } 
    cpuTurn(){
        var tempgridRep = this.state.gridRep;
        var newGrid = this.CPUChooseBox()
        var i = 0;
        this.setState({gridRep: newGrid});
        for(var x = 0; x < tempgridRep.length; x++){
            if(tempgridRep[x] != newGrid[x]){
                i = x;
            }
        }
        document.getElementsByName("squares")[i].value = "O";
        this.goCheck();
        this.setState({turn: "X"});
        /*
            while(tempgridRep[i] == "X" || tempgridRep[i] == "O"){
                i++;
            }
            document.getElementsByName("squares")[i].value = "O";
            tempgridRep[i] = "O";
            this.setState({gridRep: tempgridRep});
            this.goCheck();
            this.setState({turn:"X"});
        */
    }
    evaluationHelper(segment){
        var points = 0;
        var xCount = 0;
        var oCount = 0;
        segment.forEach(function (x) { 
            if(x == "X"){
                xCount += 1;
            }else if(x == "O"){
                oCount += 1;
            }
        });
        if (oCount == 1 && xCount == 0){
            points += 1;
        }else if(oCount == 2 && xCount == 0) {
            points += 3
        }else if(oCount == 3){
            points += 19
        }
        if (xCount == 2 && oCount == 0){
            points -= 10;
        }else if(xCount == 2 && oCount == 1){
            points += 4;
        }else if(xCount == 3){
            points -= 20;
        }
        return points
    }
    evaluateState(state){
        var points = 0;
        var horizontalSegment;
        var verticalSegment;
        var diagonalSegment;
        for (var i = 0; i < state.length; i++){
            for(var j = 0 ;j<3; j++) {
                horizontalSegment = state[i][0].slice(j*3, (j*3)+ 3);
                points += this.evaluationHelper(horizontalSegment);
            }
            for(j=0; j<3; j++){
                verticalSegment = [];
                verticalSegment.push(state[i][0][j]);
                verticalSegment.push(state[i][0][j+3]);
                verticalSegment.push(state[i][0][j+6]);
                points += this.evaluationHelper(verticalSegment);
            }
            for(j = 0; j<2; j++){
                diagonalSegment = [];
                diagonalSegment.push(state[i][0][j*2]);
                diagonalSegment.push(state[i][0][4]);
                diagonalSegment.push(state[i][0][8-j*2]);
                points += this.evaluationHelper(diagonalSegment);
            }
            state[i][2] = points;
            points = 0;
        }
    }
    CPUChooseBox(){
        var tempgridRep = this.state.gridRep;
        var state1 = []; //state1 is all possible game states after 1 turn
        var max = 0;
        for (var i = 0; i < 9; i++){
            if (tempgridRep[i] != "X" && tempgridRep[i] != "O"){
                var possibleMove = tempgridRep.slice(0);
                possibleMove[i] = "O";
                state1.push([possibleMove, 0, 0]); //each possible game state, its ancestor, and  the game state's rating for circles
            }
        }
        var x;
        var y;
        var state2 = [];
        var min = 10;
        for (x = 0; x < state1.length; x++){
            for (var y = 0; y < 9; y++){
                if (state1[x][0] != undefined){
                    if (state1[x][0][y] != "X" && state1[x][0][y] != "O"){
                        var possibleMove = state1[x][0].slice(0);
                        possibleMove[y] = "X";
                        state2.push([possibleMove, x, 0]);
                    }
                }
            }
        }
        var state3 = [];
        max = 0;
        for (x = 0; x < state2.length; x++){
            for (var y = 0; y < 9; y++){
                if (state2[x][0] != undefined){
                    if (state2[x][0][y] != "X" && state2[x][0][y] != "O"){
                        var possibleMove = state2[x][0].slice(0);
                        possibleMove[y] = "O";
                        state3.push([possibleMove, x, 0]);
                    }
                }
            }
        }
        this.evaluateState(state3);
        y = 0;
        for(x = 0; x<state2.length; x++){
            if(x == state2.length-1){
                while(y < state3.length){
                    if (max < state3[y][2]) {
                        max = state3[y][2];
                        state2[x][2] = max;
                    }
                    y++;
                }
                max= 0;
            } else{
            while(state3[y][1] == x){
                if (max < state3[y][2]) {
                    max = state3[y][2];
                    state2[x][2] = max;
                }
                y++;
            }
            max= 0;
            }

        }
        y = 0;
        for(x=0; x<state1.length; x++) {
            if(x == state1.length-1){
                while(y < state2.length) {
                    if (min < state2[y][2]) {
                        min = state2[y][2];
                        state1[x][2] = min;
                    }
                    y++;
                }
                min= 10;
            } else {
            while(state2[y][1] == x) {
                if (min < state2[y][2]) {
                    min = state2[y][2];
                    state1[x][2] = min;
                }
                y++;
            }
            min= 10;
        }   
            }
        y = 0;
        var desiredState;
        max = -1;
        for(x = 0; x<state1.length; x++){
            if (state1[x][2] > max) {
                max = state1[x][2];
                desiredState = state1[x][0];
                console.log(desiredState);
            }
        }
        return desiredState;
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
