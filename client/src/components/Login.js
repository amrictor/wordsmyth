import React, { Component } from 'react';
import { CardBody, Collapse, Form } from 'reactstrap'
import { Button } from 'reactstrap'
import { Container, Input } from 'reactstrap'

import { FaSlidersH } from 'react-icons/fa';
import { withStyles } from '@material-ui/core/styles';
// import Slider from '@material-ui/lab/Slider';


class Login extends Component {
  constructor(props){
    super(props);
    this.state = {
      settings : false,
      value: 2
    };
    this.displayPlayers = this.displayPlayers.bind(this);
    this.join = this.join.bind(this);
    this.leave = this.leave.bind(this);
    this.start = this.start.bind(this);
    this.change = this.change.bind(this);
  }

  contains(a, obj) {
    var i = a.length;
    while (i--) {
       if (a[i].valueOf() === obj.valueOf()) {
           return true;
       }
    }
    return false;
  }
  join(){
    this.props.updateGameBasedOnResponse('username', document.getElementById("username").value)
    if(this.props.player.username.length===0) {
      alert("Please choose a username.");
      return;
    }
    console.log("Joining game as "+ this.props.player.username);
    let request = {
      'type': 'request',
      'action': 'join',
      'name': this.props.player.username,
    };
    this.props.connection.send(JSON.stringify(request));
    this.props.toggleInGame();
  }

  leave(){
    console.log(this.props.player.username + " is leaving the game.");
    let request = {
      'type': 'request',
      'action': 'leave',
      'name': this.props.player.username,
      'index': this.props.player.index
    };
    this.props.updateGameBasedOnResponse('index', -1);
    this.props.connection.send(JSON.stringify(request));
    this.props.setCookie("", "", -1);
    this.props.toggleInGame();
  }

  start(){
    console.log("The game is starting.");
    let request = {
      'type': 'request',
      'action': 'start',
      'rounds': 3,
      'name': this.props.player.username,
      'index': this.props.player.index
    };
    this.props.connection.send(JSON.stringify(request));
  }

  displayPlayers(){
    let data = [];
    if(this.props.game.numPlayers>0)
      data.push(<div className="text" key="ingame">{this.props.game.numPlayers} players in game:</div>)
    else data.push(<div className="text" key="roomempty">Room is empty.</div>)
    for(let i = 0; i<this.props.game.numPlayers; i++) {
      data.push(<div className="text" key={i}>{this.props.game.players[i] }</div>)
    }
    return(
      <div className="username curved">{data}</div>
    ) 
  }

  displayStart(){
    return(
      this.props.player.index===0 
      ?
        <Button
            onClick={this.start}
            disabled={!this.props.inGame}
          >
            Start Game!
        </Button>
      : ""
        );
  }

 
  change(event, value){
    this.setState({ value })
  }

  render() {
    // let ShortSlider = withStyles({
    //   root: {
    //     width: 300,
    //   },
    //   track: {
    //     backgroundColor:  '#0accab'
    //   },
    //   thumb: {
    //     backgroundColor:  '#0accab'
    //   },
    // })(Slider);

    return (
      <Container fluid>
        <CardBody className="text">Choose a username and join the game!</CardBody>
        <Form inline className="centered">
          <Input
              type="text"
              id="username"
              name="username"
              placeholder= {this.props.inGame ? this.props.player.username : "Username" }
              disabled={this.props.inGame}
          />
          <br/><br/>
          
          <Button
            className="join"
            onClick={this.props.inGame ? this.leave : this.join}
          >
            {this.props.inGame ? "Leave" : "Join"}
          </Button>
          
          <Collapse isOpen={this.props.player.index===0 && this.props.inGame}>
            
            <Button
                className="join"
                onClick={() => this.setState({'settings': !this.state.settings})}
                disabled
              >
                <FaSlidersH/>
            </Button>
            <Button
                className="join"
                onClick={this.start}
                disabled={this.props.game.numPlayers<2}
              >
                Start Game!
            </Button>
        </Collapse>
        </Form>    
        <Collapse isOpen={this.state.settings}>
          <p className='slider'>{this.state.value}</p>
          <div className="slider">
          
            {/* <ShortSlider
              min={1}
              max={5}
              step={1}
              className={"slider"}
              value={this.state.value}
              onChange={this.change}
            /> */}
          </div>
        </Collapse>
        <CardBody>
          {this.displayPlayers()}
        </CardBody>
      </Container>
    )
  }
}
export default Login;