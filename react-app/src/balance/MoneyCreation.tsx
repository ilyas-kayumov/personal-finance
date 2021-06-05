import React, { Component, ChangeEvent } from 'react';
import { BalanceDataSource } from './BalanceDataSource';
import { CurrenciesContentProvider } from './CurrenciesContentProvider';
import Select from 'react-select';
import { Locale } from '../Locale';

export interface MoneyCreationProps {
    dataSource: BalanceDataSource,
    onClickAdd: (amount: number, currency: string) => void
}

export interface MoneyCreationState {
    amount: number,
    currency: any
}

export class MoneyCreation extends Component<MoneyCreationProps, MoneyCreationState> {
    constructor(props: MoneyCreationProps) {
        super(props);
        this.state = { amount: 0, currency: CurrenciesContentProvider.getInstance().getCurrency('USD') };
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

    onClickAdd = (event: React.MouseEvent) => {
        this.props.onClickAdd(this.state.amount, this.state.currency.value);
    };

    render() {
        return (<>
            <div className='col-md-3 col-6 box-col'>
                <input value={this.state.amount} onChange={this.onChangeAmount} placeholder={Locale.get('Amount')} type='number' className='form-control' />
            </div>
            <div className='col-md-2 col-6 box-col'>
                <Select value={this.state.currency} onChange={this.onChangeCurrency} options={CurrenciesContentProvider.getInstance().getCurrencies()}/>
            </div>
            <div className='col-md col-12 box-col'>
                <button type='button' onClick={this.onClickAdd} className='btn btn-primary btn-block'>{Locale.get('Add')}</button>
            </div>
            <div className='col-md col'>
                <button type='button' className='btn btn-primary btn-block hidden-button'></button>
            </div>
        </>);
    }
}
