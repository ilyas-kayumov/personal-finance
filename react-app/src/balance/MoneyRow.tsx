import React, { Component } from 'react';
import { BalanceDataSource } from './BalanceDataSource';
import { CurrenciesContentProvider } from './CurrenciesContentProvider';
import { Locale } from '../Locale';

export interface MoneyRowProps {
    id: number,
    dataSource: BalanceDataSource,
    onClickEdit: (e: React.MouseEvent) => void,
    onClickDelete: (e: React.MouseEvent) => void
}

export interface MoneyRowState {
    amount: number,
    currency: string
}

export class MoneyRow extends Component<MoneyRowProps, MoneyRowState> {
    render() {
        return (<>
            <div className='col-md-3 col-6 box-col'>
                <span>{this.props.dataSource.money.get(this.props.id).amount}</span>
            </div>
            <div className='col-md-2 col-6 box-col'>
                <span>{CurrenciesContentProvider.getInstance().getCurrency(this.props.dataSource.money.get(this.props.id).currency).label}</span>
            </div>
            <div className='col-md col-6 box-col'>
                <button type='button' onClick={this.props.onClickEdit} className='btn btn-outline-info btn-block'>{Locale.get('Edit')}</button>
            </div>
            <div className='col-md col-6 box-col'>
                <button type='button' onClick={this.props.onClickDelete} className='btn btn-outline-danger btn-block'>{Locale.get('Delete')}</button>
            </div>
        </>);
    }
}
