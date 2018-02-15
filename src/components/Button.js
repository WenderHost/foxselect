import React from 'react';

class Button extends React.Component{
  render(){
    return(
      <button className="btn btn-primary" type="submit" onClick={this.props.handleClick}>{this.props.text}</button>
    );
  }
}

export default Button;