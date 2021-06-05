import React from 'react';
import Alert from 'react-bootstrap/Alert';
import AccountAPI from './api/AccountAPI';
import Balance from './components/Balance';
import Header from './components/Header';
import Login from './components/Login';
import Registration from './components/Registration';
import './css/Styles.css';
import PasswordChange from './components/PasswordChange';

export default class App extends React.Component {
  constructor() {
    super();
    this.state = { screen: "login", logged: false, alert: '', loginAlert: '', passwordAlert: '', login: '' };
    this.onLoginSubmit = this.onLoginSubmit.bind(this);
    this.onRegisterSubmit = this.onRegisterSubmit.bind(this);
    this.onClickRegister = this.onClickRegister.bind(this);
    this.onClickLogin = this.onClickLogin.bind(this);
    this.onClickLogout = this.onClickLogout.bind(this);
    this.onClickForgot = this.onClickForgot.bind(this);
    this.updateAlerts = this.updateAlerts.bind(this);
    this.resetAlerts = this.resetAlerts.bind(this);
    this.updatePage = this.updatePage.bind(this);
    this.passwordChangeEnd = this.passwordChangeEnd.bind(this);
  }

  async onLoginSubmit(data) {
    this.setState({ login: data.login });
    this.updatePage(await AccountAPI.login(data));
  }

  async onRegisterSubmit(data) {
    this.setState({ login: data.login });
    this.updatePage(await AccountAPI.register(data));
  }

  onClickRegister(e) {
    this.resetAlerts();
    this.setState({ screen: 'registration' });
  }

  onClickLogin(e) {
    this.resetAlerts();
    this.setState({ screen: 'login' });
  }

  onClickLogout(e) {
    this.resetAlerts();
    this.setState({ screen: 'login', logged: false, login: '' });
  }

  onClickForgot(e) {
    this.setState({ screen: 'passwordChange' });
  }

  passwordChangeEnd() {
    this.setState({ screen: 'login' });
  }

  async updatePage(result) {
    this.resetAlerts();

    if (result.status !== 200) {
      await this.updateAlerts(result);
    }
    else {
      let token = await result.json();

      sessionStorage.setItem('token', token);
      sessionStorage.setItem('logged', 'true');

      this.setState({ screen: 'balance', logged: true });
    }
  }

  resetAlerts() {
    this.setState({ alert: '', loginAlert: '', passwordAlert: '' });
  }

  async updateAlerts(result) {
    let body = await result.text();

    let isJSON;
    ({ isJSON, body } = App.tryParseJSON(body));

    let hasFieldsErrors = false;
    if (isJSON) {
      let loginAlert = '', passwordAlert = '';
      ({ loginAlert, passwordAlert, hasFieldsErrors } = App.getFieldsErrors(body));

      if (hasFieldsErrors) {
        this.setState({ loginAlert: loginAlert });
        this.setState({ passwordAlert: passwordAlert });
      }
    }

    if (body !== null && ((!hasFieldsErrors && isJSON) || !isJSON)) {
      this.setState({ alert: body });
    }
    else if (hasFieldsErrors && isJSON) {
      this.setState({ alert: 'Some fields are incorrect.' });
    }
    else {
      this.setState({ alert: result.status + ' - ' + result.statusText });
    }
  }

  static tryParseJSON(body) {
    let isJSON = true;
    try {
      body = JSON.parse(body);
    }
    catch (e) {
      isJSON = false;
    }
    return { isJSON, body };
  }

  static getFieldsErrors(body) {
    let loginAlert = '', passwordAlert = '', hasFieldsErrors = false;

    let errors = body['errors'];

    if (errors !== undefined) {
      let login = errors['Login'];

      if (login !== undefined && login[0] !== undefined) {
        loginAlert = login[0];
        hasFieldsErrors = true;
      }

      let password = errors['Password'];

      if (password !== undefined && password[0] !== undefined) {
        passwordAlert = password[0];
        hasFieldsErrors = true;
      }
    }

    return { loginAlert, passwordAlert, hasFieldsErrors };
  }

  render() {
    let state = this.state;
    let screenName = state.screen;
    let screenComponent;
    switch (screenName) {
      case 'login':
        screenComponent = <Login onFormSubmit={this.onLoginSubmit} onClickRegister={this.onClickRegister} onClickForgot={this.onClickForgot} />;
        break;
      case 'registration':
        screenComponent = <Registration onFormSubmit={this.onRegisterSubmit} loginAlert={state.loginAlert} passwordAlert={state.passwordAlert} onClickLogin={this.onClickLogin} />;
        break;
      case 'balance':
        screenComponent = <Balance />;
        break;
      case 'passwordChange':
        screenComponent = <PasswordChange passwordChangeEnd={this.passwordChangeEnd} />;
        break;
      default:
        break;
    }

    let alert;
    if (this.state.alert !== '' && (screenName === 'login' || screenName === 'registration')) {
      alert = <Alert className="account-alert" variant='danger'> {this.state.alert} </Alert>;
    }
    else {
      alert = <></>;
    }

    return (
      <div>
        <div className="app">
          <Header onClickLogout={this.onClickLogout} logged={this.state.logged} login={this.state.login} />
          <div className="app-content">
            {screenComponent}
            {alert}
          </div>
        </div>
      </div>
    );
  }
}