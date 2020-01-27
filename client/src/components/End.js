import React, { Component } from 'react';
import { Col } from 'reactstrap'
import { Button } from 'reactstrap'
import { Container } from 'reactstrap'

// import loading from '../../resources/loadingicon.gif'

class End extends Component {
  constructor(props){
    super(props);
    this.state = {
    };
    this.checkWinner = this.checkWinner.bind(this)
  }
  displayScores(){
    let data = [];
    for (let i = 0; i<this.state.game.scores.length; i++) {
      data.push(<Col key={this.state.game.players[i]}>{this.state.game.players[i] +": " + this.state.game.scores[i]}</Col>)
    }
    return(
      <Container>
      <div className="username curved">
        {data}
      </div>
      </Container>
    )
  }
  displayPlayerScores(){
    let data = [];
    for(let i in this.props.game.submittedQuotes) {
      let index = this.props.game.submittedQuotes[i][3]; //index not working!!
      if(index===this.props.player.index) continue;
      data.push(
        <Button block
          key={"voting_"+i}
          onClick={() => {
            this.props.vote(index, (this.props.game.indexOfIt === this.props.player.index))}}
          >
          {(this.props.game.indexOfIt===this.props.player.index
            && this.props.game.bonus[index]) 
            ? <div className="star">&#9733;</div> 
            : ""}
          <i>{this.props.game.submittedQuotes[i][0]}</i>
          <br/>
          {this.props.game.submittedQuotes[i][1] +"... "+ this.props.game.submittedQuotes[i][2]}
        </Button>)
    }
    
    return data;
  }

  checkWinner(){
    let max = {'user': this.props.game.players[0], 'score': this.props.game.scores[0]};
    for (let i = 0; i<this.props.game.scores.length; i++) {
      if(this.props.game.scores[i]>max['score'])
      max={'user': this.props.game.players[i], 'score': this.props.game.scores[i]};
    }
    return max;
  }


  render() {
    let max= this.checkWinner()
    return ( 
      <Container fluid >
        <div className="text">
          <br/>
          <i>{max['user']}</i> won with a score of {max['score']+"!"}
          <br/><br/>
          Wondering how ties are decided? It goes to the person who 
          joins the game first. Late to the party? Sucks to suck.
        </div>
        <br/>
      </Container>
    )
  }
}
export default End;