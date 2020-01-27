import React, { Component } from 'react';
import { CardBody, CardTitle } from 'reactstrap'
import { Button } from 'reactstrap'
import { Container } from 'reactstrap'

import loading from '../resources/loadingicon.gif'

class Choice extends Component {
  constructor(props){
    super(props);
    this.state = {
    };
  }
  displayQuotes(){    
    // while(typeof this.props.game.quoteChoices === 'undefined');
    let data = [];

    for(let i in this.props.game.quoteChoices) {
      let index = i;
      data.push(
              <Button block className="curved"
                key={"quote_"+i}
                onClick={() => {
                  console.log(this.props.game.quoteChoices[i])
                  this.props.choose(this.props.game.quoteChoices[index])
                }}
                >
                <i>{this.props.game.quoteChoices[i][0]}</i>
                <br/>
                {this.props.game.quoteChoices[i][1] +"... "+ this.props.game.quoteChoices[i][2]}
              </Button>)
    }
    return data;
  }
  screen() {
    const waiting = 
      <CardBody>
        <img src={loading} style={{'display': 'block', 'margin': '0 auto' }} height="45" alt="..."/>
        <CardTitle style={{'textAlign': 'center'}}>Waiting for {this.props.game.players[this.props.game.indexOfIt]} to choose a quote.</CardTitle>
      </CardBody>

    const quotes =
      <CardBody>
        <div className="text"><i>Choose one of the following quotes.</i></div>
        {this.displayQuotes()}
      </CardBody>
    return(
      (this.props.game.indexOfIt === this.props.player.index)
      ? quotes
      : waiting
    )
  }

  render() {
    const waiting = 
      <CardBody>
        <img src={loading} style={{'display': 'block', 'margin': '0 auto' }} height="45" alt="..."/>
        <div className="text" style={{'textAlign': 'center'}}>Waiting for {this.props.game.players[this.props.game.indexOfIt]} to choose a quote.</div>
      </CardBody>

    const quotes =
      <CardBody>
        <div className="text"><i>Choose one of the following quotes.</i></div>
        <br/>
        {this.displayQuotes()}
      </CardBody>

    return (
      <Container fluid >
        {(this.props.game.indexOfIt === this.props.player.index)
          ? quotes
          : waiting}
      </Container>
    )
  }
}
export default Choice;