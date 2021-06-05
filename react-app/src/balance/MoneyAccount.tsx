import React, { Component } from 'react';
import { BalanceDataSource } from './BalanceDataSource';
import { MoneyRow } from './MoneyRow';

export interface MoneyAccountProps {
    id: number,
    name: string,
    moneyId: number,
    dataSource: BalanceDataSource
}

export interface MoneyAccountState { name: string }

export class MoneyAccount extends Component<MoneyAccountProps, MoneyAccountState> {
    onClickEdit = () => {
        this.props.dataSource.editMoneyAccountId.change(this.props.id);
    };

    onClickDelete = () => {
        this.props.dataSource.moneyAccounts.delete(this.props.id);
    };

    render() {
        return (
            <>
                <div className='col-md-4 col-12 box-col'>
                    <span>{this.props.name}</span>
                </div>
                <MoneyRow id={this.props.moneyId} dataSource={this.props.dataSource} onClickEdit={this.onClickEdit} onClickDelete={this.onClickDelete}></MoneyRow>
            </>);
    }
}
