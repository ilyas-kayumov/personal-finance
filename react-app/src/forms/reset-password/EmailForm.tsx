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

export interface EmailProps { onClickNext: Function; };

export class EmailForm extends React.Component<EmailProps, { isLoading: boolean, alert: string }> {
    field: string;
    dataSource: FieldsDataSource;
    formValidation: BasicFormValidation;
    eventsHandler: FormEventsHandler;

    constructor(props: EmailProps) {
        super(props);
        this.state = { isLoading: false, alert: '' };
        this.field = 'email';
        this.dataSource = new FieldsDataSource(
            new Map([
                ['email', new FieldData('email', '', '', 'email')]
            ])
        );
        this.formValidation = new BasicFormValidation(this.dataSource);
        this.eventsHandler = new FormEventsHandler(this.dataSource, this.formValidation, [this.field], this.submitForm);
    }

    submitForm = async (e:FormEvent<HTMLFormElement>) => {
        this.setState({ isLoading: true });
        let field = this.dataSource.getField('email');
        let response = await AccountAPI.sendVerificationCode(field.value);

        if (response.status === 200) {
            sessionStorage.setItem('email', field.value);
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
                <Field key={this.field} id={this.field} dataSource={this.dataSource} onChange={this.eventsHandler.onChange} onBlur={this.eventsHandler.onBlur} />
                <SubmitButton name={Locale.get('Next')} isLoading={this.state.isLoading} />
                <div><small className="text-danger">{this.state.alert}</small></div>
            </form>
        );
    }
}
