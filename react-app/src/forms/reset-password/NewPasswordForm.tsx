import React, { FormEvent } from "react";
import '../../App.css';
import { BasicFormValidation } from "../BasicFormValidation";
import { Field } from "../Field";
import { FieldData } from "../FieldData";
import { FieldsDataSource } from "../FieldsDataSource";
import { FormEventsHandler } from "../FormEventsHandler";
import { RegisterFormValidation } from "../register/RegisterFormValidation";
import AccountAPI from "../../api/AccountAPI";
import { SubmitButton } from "../SubmitButton";
import { Redirect } from "react-router-dom";
import { Locale } from "../../Locale";

export interface NewPasswordProps { onClickConfirm: (e: React.MouseEvent<HTMLElement>) => void; email: string };

export class NewPasswordForm extends React.Component<NewPasswordProps, { isLoading: boolean, alert: string, redirect: string }> {
    fields: Array<string>;
    dataSource: FieldsDataSource;
    formValidation: RegisterFormValidation;
    eventsHandler: FormEventsHandler;

    constructor(props: NewPasswordProps) {
        super(props);
        this.state = { isLoading: false, alert: '', redirect: '' };
        this.fields = ['password', 'confirm password'];
        this.dataSource = new FieldsDataSource(
            new Map([
                ['password', new FieldData('password', '', '', 'password')],
                ['confirm password', new FieldData('confirm password', '', '', 'password')]
            ])
        );
        this.formValidation = new RegisterFormValidation(this.dataSource, new BasicFormValidation(this.dataSource));
        this.eventsHandler = new FormEventsHandler(this.dataSource, this.formValidation, this.fields, this.submitForm);
    }

    submitForm = async (e:FormEvent<HTMLFormElement>) => {
        this.setState({ isLoading: true });
        let response = await AccountAPI.resetPassword({ email: this.props.email, newPassword: this.dataSource.getField('password').value });

        if (response.status === 200) {
            this.setState({ redirect: 'login' });
        }
        else {
            this.setState({ isLoading: false });
            this.setState({ alert: await response.text() });
        }
    }

    render() {
        if (this.state.redirect !== '') {
            return <Redirect to='login' />
        }

        return (
            <form onSubmit={this.eventsHandler.onSubmit} noValidate>
                <h1>{Locale.get('Reset Password')}</h1>
                {this.fields.map(f => <Field key={f} id={f} dataSource={this.dataSource} onChange={this.eventsHandler.onChange} onBlur={this.eventsHandler.onBlur} />)}
                <SubmitButton name={Locale.get('Confirm')} isLoading={this.state.isLoading} />
                <div><small className="text-danger">{this.state.alert}</small></div>
            </form>
        );
    }
}