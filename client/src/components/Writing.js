import React, { Component } from 'react';
import { CardBody, CardTitle } from 'reactstrap'
import { Button } from 'reactstrap'
import { Container, Input, Form } from 'reactstrap'

import loading from '../resources/loadingicon.gif'

class Writing extends Component {
  constructor(props){
    super(props);
    this.state = {
    };
  }
  displayQuotes(){
    let quotes = [ ["Origin","Quote 1"], ["Origin","Quote 2"], ["Origin","Quote 3"]];
    let data = [];
    for (let i = 0; i<quotes.length; i++){
      data.push(
        <Button block>
          <i>{quotes[i][0]}</i>
          <br/>
          {quotes[i][1]}
        </Button>
      )
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
        <CardTitle>Choose one of the following quotes.</CardTitle>
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
        <div className="text" style={{'textAlign': 'center'}}>Waiting for other players to complete their quotes.</div>
      </CardBody>
    let quote = this.props.game.quote;
    const writing =
      <CardBody>
        <div className="text">
          <i>Finish the quote below and fool other players into believing yours is the original!<br/>Do your best to make your quote sound authentic.</i>
        </div>
        <br/>
        <div className="text">
          <i>{quote[0]}</i>
          <br/>
          {quote[1]}...
        </div>
        <Form inline className="centered full">
          <Input 
            id="username"
            type='text'
            placeholder='...'
            onChange={(e) => this.props.writeQuote(e.target.value)}
          />
          <br/><br/><br/>
          <Button
            className="join"
            onClick={() =>{ this.props.choose(this.props.player.quote); wait=true;}}>
            Submit
          </Button>
        </Form>
      </CardBody>
    
    let wait = (this.props.game.indexOfIt === this.props.player.index) || (this.props.game.submitted[this.props.player.index]);
    return (
      <Container fluid >
        { wait
          ? waiting
          : writing}
      </Container>
    )
  }
}
export default Writing;