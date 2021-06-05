import React, { Component, ChangeEvent } from 'react';
import { BalanceDataSource } from './BalanceDataSource';
import { EditMoneyRow } from './EditMoneyRow';
import { Locale } from '../Locale';

export interface EditMoneyAccountProps {
    id: number,
    name: string,
    moneyId: number,
    dataSource: BalanceDataSource
}

export interface EditMoneyAccountState { name: string }

export class EditMoneyAccount extends Component<EditMoneyAccountProps, EditMoneyAccountState> {
    constructor(props: EditMoneyAccountProps) {
        super(props);
        this.state = { name: props.name };
    }

    onClickApply = () => {
        this.props.dataSource.moneyAccounts.change(this.props.id, data => { data.name = this.state.name; });
        this.props.dataSource.editMoneyAccountId.change(-1);
    };

    onClickCancel = () => {
        this.setState({ name: this.props.dataSource.moneyAccounts.get(this.props.id).name });
        this.props.dataSource.editMoneyAccountId.change(-1);
    };

    onChangeName = (event: ChangeEvent<HTMLInputElement>) => {
        this.setState({ name: event.target.value });
    };

    render() {
        return (
                <>
                    <div className='col-md-4 col-12 box-col'>
                        <input value={this.state.name} onChange={this.onChangeName} placeholder={Locale.get('Name')} className='form-control' />
                    </div>
                    <EditMoneyRow id={this.props.moneyId} dataSource={this.props.dataSource} onClickApply={this.onClickApply} onClickCancel={this.onClickCancel}></EditMoneyRow>
                </>);
    }
}
