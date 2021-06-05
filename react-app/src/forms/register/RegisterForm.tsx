import React, { FormEvent } from "react";
import '../../App.css';
import { BasicFormValidation } from "../BasicFormValidation";
import { Field } from "../Field";
import { FieldData } from "../FieldData";
import { FieldsDataSource } from "../FieldsDataSource";
import { FormEventsHandler } from "../FormEventsHandler";
import { RegisterFormValidation } from "./RegisterFormValidation";
import { Link } from "../Link";
import { FormResponseReader } from "../FormResponseReader";
import AccountAPI from "../../api/AccountAPI";
import { Redirect } from "react-router-dom";
import { SubmitButton } from "../SubmitButton";
import { TokenDataSource } from "../../TokenDataSource";
import { Welcome } from "../Welcome";
import { Locale } from "../../Locale";

export interface RegisterProps {
    onClickLogin: (e: React.MouseEvent<HTMLElement>) => void;
    onLogin: Function;
};

export class RegisterForm extends React.Component<RegisterProps, { alert: string, redirect: string, isLoading: boolean }> {
    fields: Array<string>;
    dataSource: FieldsDataSource;
    formValidation: RegisterFormValidation;
    eventsHandler: FormEventsHandler;
    responseReader: FormResponseReader;

    constructor(props: RegisterProps) {
        super(props);
        this.state = { alert: '', redirect: '', isLoading: false };
        this.fields = ['email', 'password', 'confirm password'];
        this.dataSource = new FieldsDataSource(
            new Map([
                ['email', new FieldData('email', '', '', 'email')],
                ['password', new FieldData('password', '', '', 'password')],
                ['confirm password', new FieldData('confirm password', '', '', 'password')]
            ])
        );
        this.formValidation = new RegisterFormValidation(this.dataSource, new BasicFormValidation(this.dataSource));
        this.eventsHandler = new FormEventsHandler(this.dataSource, this.formValidation, this.fields, this.submitForm);
        this.responseReader = new FormResponseReader();
    }

    submitForm = async (e: FormEvent<HTMLFormElement>) => {
        this.setState({ isLoading: true });
        let response = await AccountAPI.register({
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
            this.setState({ isLoading: false });
            let result = await this.responseReader.read(response, ['login', 'password']);
            this.setState({ alert: result.mainError });

            result.errors.forEach((value: string, key: string) => {
                this.dataSource.changeFieldAlert(key === 'login' ? 'email' : key, value);
            });
        }
    }

    render() {
        if (this.state.redirect !== '') {
            return <Redirect to={this.state.redirect} />
        }

        let register =
            <div className='main card'>
                <form onSubmit={this.eventsHandler.onSubmit} noValidate>
                    <h1>{Locale.get('Register_title')}</h1>
                    {this.fields.map(f => <Field key={f} id={f} dataSource={this.dataSource} onChange={this.eventsHandler.onChange} onBlur={this.eventsHandler.onBlur} />)}
                    <SubmitButton name={Locale.get('Register_submit')} isLoading={this.state.isLoading} />
                    <Link name={Locale.get('Login_title')} eventsHandler={this.eventsHandler} href='login' />
                    <div><small className="text-danger">{this.state.alert}</small></div>
                </form>
            </div>

        return <Welcome form={register} />
    }
}