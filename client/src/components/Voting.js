import React, { Component } from 'react';
import { CardBody } from 'reactstrap'
import { Button } from 'reactstrap'
import { Container } from 'reactstrap'

import loading from '../resources/loadingicon.gif'
// import { FaRegCalendarCheck } from 'react-icons/fa';

class Voting extends Component {
  constructor(props){
    super(props);
    this.state = {
    };
  }

  displayQuotes(){
    let data = [];
    for(let i in this.props.game.submittedQuotes) {
      let index = this.props.game.submittedQuotes[i][3]; //index not working!!
      if(index===this.props.player.index && !this.props.game.results) continue; 
      let votes = [];
      for(let j = 0; j<this.props.game.votes[index]; j++) {
        votes.push("❚")
      }
      data.push(
        <Button block
          className={(this.props.game.results && this.props.game.indexOfIt===index) ? "correct" : ""}
          key={"voting_"+i}
          onClick={() => {
            this.props.vote(index, (this.props.game.indexOfIt === this.props.player.index))}}
          disabled={this.props.game.results}
          >
            {((this.props.game.indexOfIt===this.props.player.index )|| this.props.game.results) 
            ? <div className="star">{this.props.game.results ? votes : ""} {this.props.game.bonus[index] ? "★" : ""}</div> 
            : ""}
          <i>{this.props.game.submittedQuotes[i][0]}</i>
          <br/>
          {this.props.game.submittedQuotes[i][1] +"... "+ this.props.game.submittedQuotes[i][2]}
        </Button>)
    }
    
    return data;
  }

  render() {
    const waiting = 
      <CardBody>
        <img src={loading} style={{'display': 'block', 'margin': '0 auto' }} height="45" alt="..."/>
        <div className='text' style={{'textAlign': 'center'}}>Waiting for other players to vote.</div>
      </CardBody>

    return ( 
          
      <Container fluid >
        { (this.props.game.submitted[this.props.player.index] && !this.props.game.results) ? 
          waiting : 
          <CardBody>
            <div className="text"><i>{ (this.props.game.results)
            ? "❚ = 1 Vote, ★ = Bonus Point"
            : (this.props.game.indexOfIt === this.props.player.index) 
            ? "Award bonus points to the players' quotes."
            : "Vote for the quote below which you believe to be the original." }</i></div>
            <br/>
            {this.displayQuotes()}
          </CardBody>
        }
      </Container>
    )
  }
}
export default Voting;