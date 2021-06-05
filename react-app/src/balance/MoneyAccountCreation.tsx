import React, { Component, ChangeEvent } from 'react';
import { BalanceDataSource } from './BalanceDataSource';
import { MoneyCreation } from './MoneyCreation';
import { Locale } from '../Locale';

export interface MoneyAccountCreationProps {
    dataSource: BalanceDataSource
}

export interface MoneyAccountCreationState { name: string }

export class MoneyAccountCreation extends Component<MoneyAccountCreationProps, MoneyAccountCreationState> {
    constructor(props: MoneyAccountCreationProps) {
        super(props);
        this.state = { name: '' };
    }

    onClickAdd = (amount: number, currency: string) => {
        this.props.dataSource.moneyAccountCreateRequest.change({ id: 0, name: this.state.name, money: { id: 0, amount: amount, currency: currency } });
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
                <MoneyCreation dataSource={this.props.dataSource} onClickAdd={this.onClickAdd} />
            </>);
    }
}
