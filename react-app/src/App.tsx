import React from 'react';
import './App.css';
import { RegisterForm } from './forms/register/RegisterForm';
import { EmailForm } from './forms/reset-password/EmailForm';
import { CodeForm } from './forms/reset-password/CodeForm';
import { NewPasswordForm } from './forms/reset-password/NewPasswordForm';
import { Balance } from './balance/Balance';
import { BalanceData } from './balance/BalanceDataSource';

export class ResetPasswordForm extends React.Component<{}, { form: string }> {
  forms: Map<string, JSX.Element>;

  constructor(props: any) {
    super(props);
    this.state = { form: 'email' };
    this.forms = new Map([
      ['email', <EmailForm onClickNext={() => this.setState({ form: 'code' })} />],
      ['code', <CodeForm onClickNext={() => this.setState({ form: 'new-password' })} email={sessionStorage.getItem('email') ?? ''} />],
      ['new-password', <NewPasswordForm onClickConfirm={() => this.setState({ form: 'new-password' })} email={sessionStorage.getItem('email') ?? ''} />]
    ]);
  }

  render() {
    return (<div className='main card'>{this.forms.get(this.state.form)}</div>);
  }
}

export default class App extends React.Component<{}, { form: string }> {
  forms: Map<string, JSX.Element>;
  balanceData: BalanceData;
  currencies: Array<string>;

  constructor(props: any) {
    super(props);
    this.state = { form: 'login' };
    this.balanceData = {} as BalanceData;
    this.currencies = [];
    this.forms = new Map([
      //['login', <LoginForm onLogin={this.onLogin} onClickRegister={() => this.setState({ form: 'register' })} onClickForgotPassword={() => this.setState({ form: 'reset-password' })} />],
      ['register', <RegisterForm onLogin={this.onLogin} onClickLogin={() => this.setState({ form: 'login' })} />],
      ['reset-password', <ResetPasswordForm />]
    ]);
  }

  componentDidMount() {
    // let page = sessionStorage.getItem('page');
    // if (page !== null && page === 'balance') {
    //   this.onLogin();
    // }
}

  onLogin = async () => {
    //this.balanceData = await BalanceAPI.get();
    //this.currencies = await CurrenciesAPI.get();
    //this.setState({ form: 'balance' });
    //sessionStorage.setItem('page', 'balance');
  }

  render() {
    if (this.state.form === 'balance') {
      return (<div>  <Balance data={this.balanceData} currencies={this.currencies} /> </div>);
    }

    return (<div className='main'> {this.forms.get(this.state.form)} </div>);
  }
}
