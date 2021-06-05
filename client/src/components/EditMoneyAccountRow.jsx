import React from 'react';
import Button from 'react-bootstrap/Button';
import Col from 'react-bootstrap/Col';
import Form from 'react-bootstrap/Form';
import Row from 'react-bootstrap/Row';

export default class EditMoneyAccountRow extends React.Component {
  constructor(props) {
    super(props);
    this.state = this.props.moneyAccount;
    this.handleOnChangeEditAmount = this.handleOnChangeEditAmount.bind(this);
    this.handleOnChangeEditCurrency = this.handleOnChangeEditCurrency.bind(this);
    this.handleOnChangeName = this.handleOnChangeName.bind(this);
    this.handleApply = this.handleApply.bind(this);
    this.handleCancel = this.handleCancel.bind(this);
  }

  handleOnChangeEditAmount(e) {
    let str = e.target.value;
    let index = str.indexOf('.');
    if (index > 0) {
      str = str.substr(0, index) + str.substr(index, 3);
    }

    let m = this.state.money;
    m.amount = parseFloat(str);
    this.setState({ money: m });
  }

  handleOnChangeEditCurrency(e) {
    let m = this.state.money;
    m.currency = e.target.value;
    this.setState({ money: m });
  }

  handleOnChangeName(e) {
    this.setState({ name: e.target.value });
  }

  handleApply(e) {
    this.props.handleApplyEdit(this.state);
  }

  handleCancel(e) {
    this.props.handleCancel();
  }

  render() {
    const id = this.props.moneyAccount.id;
    return (
      <Form>
        <Row noGutters="true">
          <Col className="basic-col" md={3}>
            <Form.Control size="sm" id={"editName-" + id} onChange={this.handleOnChangeName} value={this.state.name} />
          </Col>
          <Col className="basic-col" md={2}>
            <Form.Control size="sm" id={"editAmount-" + id}  type="number" onChange={this.handleOnChangeEditAmount} value={this.state.money.amount} />
          </Col>
          <Col className="basic-col" md={2}>
            <Form.Control size="sm" as="select" id={"editCurrency-" + id} name="currencies" onChange={this.handleOnChangeEditCurrency} value={this.state.money.currency} custom>
              {this.props.currencies.map(c => <option value={c}>{c}</option>)}
            </Form.Control>
          </Col>
          <Col className="basic-col">
            <Button size="sm" block onClick={this.handleApply}>Apply</Button>
          </Col>
          <Col className="basic-col">
            <Button size="sm" block onClick={this.handleCancel}>Cancel</Button>
          </Col>
        </Row>
      </Form>);
  }
}
