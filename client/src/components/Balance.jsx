import 'bootstrap/dist/css/bootstrap.min.css';
import React from 'react';
import Col from 'react-bootstrap/Col';
import Form from 'react-bootstrap/Form';
import ListGroup from 'react-bootstrap/ListGroup';
import Row from 'react-bootstrap/Row';
import BalanceAPI from '../api/BalanceAPI';
import CurrenciesAPI from '../api/CurrenciesAPI';
import MoneyAccountAPI from '../api/MoneyAccountAPI';
import AddMoneyAccount from './AddMoneyAccount';
import EditMoneyAccountRow from './EditMoneyAccountRow';
import MenuRow from './MenuRow';
import Money from './Money';

export default class Balance extends React.Component {
  constructor(props) {
    super(props);
    this.state = { moneyAccounts: [], properties: [], total: { amount: 0, currency: '' }, editId: -1, currencies: [] };
    this.handleDelete = this.handleDelete.bind(this);
    this.handleAdd = this.handleAdd.bind(this);
    this.handleEdit = this.handleEdit.bind(this);
    this.handleApplyEdit = this.handleApplyEdit.bind(this);
    this.handleCancelEdit = this.handleCancelEdit.bind(this);
    this.handleOnChangeTotalCurrency = this.handleOnChangeTotalCurrency.bind(this);
  }

  componentDidMount() {
    BalanceAPI.get().then(r => this.setState(r));
    CurrenciesAPI.get().then(r => this.setState({ currencies: r }));
  }

  handleDelete(e) {
    let id = this.getMoneyAccountId(e.target.id);
    MoneyAccountAPI.delete(id).then(() => this.updateTotal(this.state.total.currency));

    let moneyAccounts = this.state.moneyAccounts;
    let index = moneyAccounts.findIndex(m => m.id === id);
    moneyAccounts.splice(index, 1);
    this.setState({ moneyAccounts: moneyAccounts });
  }

  async handleAdd(data) {
    let moneyId = await MoneyAccountAPI.create({ name : data.name, money: Object.assign({}, data.money) });
    console.trace(moneyId);
    let newMoneyAccounts = this.state.moneyAccounts;
    let ma = { id: parseInt(moneyId), name: data.name, money: Object.assign({}, data.money) };
    newMoneyAccounts.push(ma);
    this.setState({ moneyAccounts: newMoneyAccounts });
    this.updateTotal(this.state.total.currency);
  }

  async updateTotal(currency) {
    let amount = await BalanceAPI.getTotal(currency);
    let total = this.state.total;
    total.amount = amount;
    this.setState({ total: total });
  }

  handleEdit(e) {
    let id = this.getMoneyAccountId(e.target.id);
    this.setState({ editId: id });
  }

  handleApplyEdit(newMoneyAccount) {
    let id = newMoneyAccount.id;
    let moneyAccounts = this.state.moneyAccounts;

    let index = moneyAccounts.findIndex(m => m.id === id);
    moneyAccounts[index].name = newMoneyAccount.name;
    moneyAccounts[index].money.amount = newMoneyAccount.money.amount;
    moneyAccounts[index].money.currency = newMoneyAccount.money.currency;

    this.setState({ editId: -1 });
    this.setState({ moneyAccounts: moneyAccounts });

    MoneyAccountAPI.update(moneyAccounts[index]).then(_ => this.updateTotal(this.state.total.currency));
  }

  handleCancelEdit() {
    this.setState({ editId: -1 });
  }

  getMoneyAccountId(targetId) {
    return parseInt(targetId.split('-')[1]);
  }

  handleOnChangeTotalCurrency(e) {
    let t = this.state.total;
    this.setState({ total: { amount: t.amount, currency: e.target.value } });
    this.updateTotal(e.target.value);
  }

  render() {
    return (<>
    <h1 class='account-header'>Balance</h1>
      <ListGroup> {this.state.moneyAccounts.map(a => <ListGroup.Item key={a.id}> {this.getMoneyAccountRow(a)} </ListGroup.Item>)}
        <ListGroup.Item>
          <Form>
            <Row>
              <Col md="auto">
                <label>Total: {this.state.total.amount.toFixed(2)}</label>
              </Col>
              <Col className="basic-col" md={3}>
                <Form.Control size="sm" as="select" id="editCurrencyTotal" name="currencies" onChange={this.handleOnChangeTotalCurrency} value={this.state.total.currency} custom>
                  {this.state.currencies.map(c => <option value={c}>{c}</option>)}
                </Form.Control>
              </Col>
            </Row>
          </Form>
        </ListGroup.Item>
      </ListGroup>
      <AddMoneyAccount handleAdd={this.handleAdd} currencies={this.state.currencies} />
    </>);
  }

  getMoneyAccountRow(a) {
    let m = a.money;
    return ((a.id === this.state.editId) ?
      <EditMoneyAccountRow moneyAccount={a} handleApplyEdit={this.handleApplyEdit} handleCancel={this.handleCancelEdit} currencies={this.state.currencies} />
      :
      <Form>
        <Row noGutters="true">
          <Col className="basic-col" md={3}>
            <Form.Label size='sm'>{a.name}</Form.Label>
          </Col>
          <Col className="basic-col" md={3}>
            <Money money={m} />
          </Col>
          <Col className="basic-col" md={1}></Col>
          <MenuRow id={a.id} handleEdit={this.handleEdit} handleDelete={this.handleDelete} />
        </Row>
      </Form>);
  }
}