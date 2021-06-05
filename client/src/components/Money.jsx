import React from 'react';

export default class Money extends React.Component {
  render() {
    const { currency, amount } = this.props.money;
    return (<label>{amount.toFixed(2)} {currency}</label>);
  }
}
