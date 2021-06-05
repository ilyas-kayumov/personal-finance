import React, { Component, ChangeEvent } from 'react';
import { BalanceDataSource } from './BalanceDataSource';
import Select from 'react-select';
import { CurrenciesContentProvider } from './CurrenciesContentProvider';
import { Locale } from '../Locale';

export interface EditMoneyRowProps {
    id: number,
    dataSource: BalanceDataSource,
    onClickApply: Function,
    onClickCancel: Function
}

export interface EditMoneyRowState {
    amount: number,
    currency: any
}

export class EditMoneyRow extends Component<EditMoneyRowProps, EditMoneyRowState> {
    constructor(props: EditMoneyRowProps) {
        super(props);
        let data = props.dataSource.money.get(props.id);
        this.state = { amount: data.amount, currency: CurrenciesContentProvider.getInstance().getCurrency(data.currency) };
    }

    onChangeAmount = (event: ChangeEvent<HTMLInputElement>) => {
        let str = event.target.value;
        let index = str.indexOf('.');
        if (index > 0) {
            str = str.substr(0, index) + str.substr(index, 3);
        }

        this.setState({ amount: parseFloat(str) });
    };

    onChangeCurrency = (option: any) => {
        this.setState({ currency: option });
    };

    onClickApply = (e: React.MouseEvent) => {
        this.props.dataSource.money.change(this.props.id, data => { data.amount = this.state.amount; data.currency = this.state.currency.value; });
        this.props.onClickApply();
    };

    onClickCancel = (e: React.MouseEvent) => {
        let data = this.props.dataSource.money.get(this.props.id);
        this.setState({ amount: data.amount, currency: CurrenciesContentProvider.getInstance().getCurrency(data.currency) });
        this.props.onClickCancel();
    };

    render() {
        return (<>
            <div className='col-md-3 col-6 box-col'>
                <input value={this.state.amount} onChange={this.onChangeAmount} type='number' placeholder={Locale.get('Amount')} className='form-control' />
            </div>
            <div className='col-md-2 col-6 box-col'>
                <Select value={this.state.currency} onChange={this.onChangeCurrency} options={CurrenciesContentProvider.getInstance().getCurrencies()}/>
            </div>
            <div className='col-md col-6 box-col'>
                <button type='button' onClick={this.onClickApply} className='btn btn-primary btn-block'>{Locale.get('Apply')}</button>
            </div>
            <div className='col-md col-6 box-col'>
                <button type='button' onClick={this.onClickCancel} className='btn btn-secondary btn-block'>{Locale.get('Cancel')}</button>
            </div>
        </>);
    }
}
