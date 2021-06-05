import React from "react";
import { FieldsDataSource } from "./FieldsDataSource";
import { FieldData } from "./FieldData";
import { Field } from "./Field";
import { BasicFormValidation } from "./BasicFormValidation";
import '../App.css';
import { FormEventsHandler } from "./FormEventsHandler";
import { Link } from "./Link";
import AccountAPI from "../api/AccountAPI";
import { FormResponseReader } from "./FormResponseReader";
import { Redirect } from "react-router-dom";
import { TokenDataSource } from "../TokenDataSource";
import { Welcome } from "./Welcome";
import { Locale } from "../Locale";

export class LoginForm extends React.Component<{}, { alert: string, redirect: string, isLoading: boolean, loadingButton: string }> {
  fields: Array<string>;
  dataSource: FieldsDataSource;
  basicFormValidation: BasicFormValidation;
  eventsHandler: FormEventsHandler;
  responseReader: FormResponseReader;

  constructor(props: any) {
    super(props);
    this.state = { alert: '', redirect: '', isLoading: false, loadingButton: '' };
    this.fields = ['email', 'password'];
    this.dataSource = new FieldsDataSource(
      new Map([
        ['email', new FieldData('email', '', '', 'email')],
        ['password', new FieldData('password', '', '', 'password')]
      ])
    );
    this.basicFormValidation = new BasicFormValidation(this.dataSource);
    this.eventsHandler = new FormEventsHandler(this.dataSource, this.basicFormValidation, this.fields, this.submitForm);
    this.responseReader = new FormResponseReader();
  }

  submitForm = async () => {
    this.setState({ isLoading: true, loadingButton: 'login' });

    let response = await AccountAPI.login({
      login: this.dataSource.getField('email').value,
      password: this.dataSource.getField('password').value
    });

    if (response.status === 200) {
      let token = await response.json();
      TokenDataSource.getInstance().change(token);
      sessionStorage.setItem('email', this.dataSource.getField('email').value);
      this.setState({ redirect: Locale.getURL('balance') });
    }
    else {
      this.setState({ isLoading: false, loadingButton: '' });
      let result = await this.responseReader.read(response, ['login', 'password']);
      this.setState({ alert: result.mainError });

      result.errors.forEach((value: string, key: string) => {
        this.dataSource.changeFieldAlert(key === 'login' ? 'email' : key, value);
      });
    }
  }

  loginWithoutRegistration = async () => {
    this.setState({ isLoading: true, loadingButton: 'try' });

    let response = await AccountAPI.loginWithoutRegistration();

    if (response.status === 200) {
      let token = await response.json();
      TokenDataSource.getInstance().change(token);
      sessionStorage.setItem('email', 'Anonymous');
      this.setState({ redirect: Locale.getURL('balance') });
    }
    else {
      this.setState({ isLoading: false, loadingButton: '' });
      this.setState({ alert: 'Error' });
    }
  }

  render() {
    if (this.state.redirect !== '') {
      return <Redirect to={this.state.redirect} />
    }

    let loginForm =
      <div className='main card'>
        <form onSubmit={this.eventsHandler.onSubmit} noValidate>
          <h1>{Locale.get('Login_title')}</h1>
          {this.fields.map(f => <Field key={f} id={f} dataSource={this.dataSource} onChange={this.eventsHandler.onChange} onBlur={this.eventsHandler.onBlur} />)}
          <button name='Login' type='submit' className='btn btn-primary' disabled={this.state.isLoading}>
            {(this.state.isLoading && this.state.loadingButton === 'login') ? 'Loading' : Locale.get('Login_submit')}
          </button>
          <Link name={Locale.get('Register_title')} eventsHandler={this.eventsHandler} href='register' />
          <div className='box-try'>
            <button type='button' onClick={this.loginWithoutRegistration} className='btn btn-outline-success' disabled={this.state.isLoading}>
              {(this.state.isLoading && this.state.loadingButton === 'try') ? 'Loading' : Locale.get('Try without registration')}
            </button>
          </div>
          <div className='d-flex justify-content-center'>
            <Link name={Locale.get('Forgot your password?')} eventsHandler={this.eventsHandler} href='reset-password' />
          </div>
          <div><small className="text-danger">{this.state.alert}</small></div>
        </form>
      </div>

    return <Welcome form={loginForm} />;
  }
}