import React, { FormEvent } from 'react';
import { FieldsDataSource } from "../FieldsDataSource";
import { FieldData } from "../FieldData";
import { BasicFormValidation } from "../BasicFormValidation";
import '../../App.css';
import { FormEventsHandler } from "../FormEventsHandler";
import { Field } from '../Field';
import AccountAPI from '../../api/AccountAPI';
import { SubmitButton } from '../SubmitButton';
import { Locale } from '../../Locale';

export interface CodeProps { onClickNext: Function; email: string };

export class CodeForm extends React.Component<CodeProps, { isLoading: boolean, alert: string }> {
    field: string;
    dataSource: FieldsDataSource;
    formValidation: BasicFormValidation;
    eventsHandler: FormEventsHandler;

    constructor(props: CodeProps) {
        super(props);
        this.state = { isLoading: false, alert: '' }; 
        this.field = 'code';
        this.dataSource = new FieldsDataSource(
            new Map([
                ['code', new FieldData('code', '', '', 'text')]
            ])
        );
        this.formValidation = new BasicFormValidation(this.dataSource);
        this.eventsHandler = new FormEventsHandler(this.dataSource, this.formValidation, [this.field], this.submitForm);
    }

    submitForm = async (e:FormEvent<HTMLFormElement>) => {
        this.setState({ isLoading: true });
        let response = await AccountAPI.verifyEmail({ email: this.props.email, verificationCode: this.dataSource.getField('code').value });
        if (response.status === 200) {
            this.props.onClickNext();
        }
        else {
            this.setState({ isLoading: false });
            this.setState({ alert: await response.text() });
        }
    }

    render() {
        return (
            <form onSubmit={this.eventsHandler.onSubmit} noValidate>
                <h1>{Locale.get('Reset Password')}</h1>
                <p> {Locale.get('We have sent you a verification code. Please, check spam/junk.')}</p>
                <Field key={this.field} id={this.field} dataSource={this.dataSource} onChange={this.eventsHandler.onChange} onBlur={this.eventsHandler.onBlur} />
                <SubmitButton name={Locale.get('Next')} isLoading={this.state.isLoading} />
                <div><small className="text-danger">{this.state.alert}</small></div>
            </form>
        );
    }
}
