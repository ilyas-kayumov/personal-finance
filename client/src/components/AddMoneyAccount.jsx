import React from 'react';
import Button from 'react-bootstrap/Button';
import Col from 'react-bootstrap/Col';
import Container from 'react-bootstrap/Container';
import Form from 'react-bootstrap/Form';
import Row from 'react-bootstrap/Row';
import '../css/Styles.css';

export default class AddMoneyAccount extends React.Component {
  constructor(props) {
    super(props);
    this.state = { name: '', money: { amount: 0.0, currency: "USD" } };
    this.handleAddMoney = this.handleAddMoney.bind(this);
    this.handleOnChangeAddName = this.handleOnChangeAddName.bind(this);
    this.handleOnChangeAddAmount = this.handleOnChangeAddAmount.bind(this);
    this.handleOnChangeAddCurrency = this.handleOnChangeAddCurrency.bind(this);
  }

  handleOnChangeAddName(e) {
    this.setState({name: e.target.value});
  }

  handleOnChangeAddAmount(e) {
    let str = e.target.value;
    let index = str.indexOf('.');
    if (index > 0) {
      str = str.substr(0, index) + str.substr(index, 3);
    }

    let m = this.state.money;
    m.amount = parseFloat(str);
    this.setState({ money: m });
  }

  handleOnChangeAddCurrency(e) {
    let m = this.state.money;
    m.currency = e.target.value;
    this.setState({ money: m });
  }

  handleAddMoney() {
    this.props.handleAdd(this.state);
  }

  render() {
    return (
    <Container className='add-money' fluid>
      <Row noGutters="true">
        <Col className="basic-col" sm={3}>
            <Form.Control size='sm' id="add-name" value={this.state.name} onChange={this.handleOnChangeAddName} />
        </Col>
        <Col className="basic-col" sm={3}>
          <Form.Control size="sm" id="add-amount" value={this.state.money.amount} type="number" onChange={this.handleOnChangeAddAmount} />
        </Col>
        <Col className="basic-col" sm={2}>
          <Form.Control size="sm" as="select" id="add-currency" name="currencies" value={this.state.money.currency} onChange={this.handleOnChangeAddCurrency} custom>
            {this.props.currencies.map(c => <option value={c}>{c}</option>)}
          </Form.Control>
        </Col>
        <Col className="basic-col" sm={3}>
          <Button size="sm" block onClick={this.handleAddMoney}> Add </Button>
        </Col>
      </Row>
    </Container>);
  }
}
