import React, { Component } from 'react';
import { BalanceDataSource } from './BalanceDataSource';
import { CurrenciesContentProvider } from './CurrenciesContentProvider';
import Select from 'react-select';
import { Locale } from '../Locale';

export interface MoneyTotalRowProps {
    dataSource: BalanceDataSource,
    onChangeCurrency: Function
}

export interface MoneyTotalRowState {
    amount: number,
    currency: string
}

export class MoneyTotal extends Component<MoneyTotalRowProps, MoneyTotalRowState> {
    constructor(props: MoneyTotalRowProps) {
        super(props);
        let data = this.props.dataSource.total.get();
        this.state = { amount: data.amount, currency: CurrenciesContentProvider.getInstance().getCurrency(data.currency) };
    }

    componentDidMount() {
        this.props.dataSource.total.addEventListener(data => this.setState({ amount: data.amount, currency: CurrenciesContentProvider.getInstance().getCurrency(data.currency) }));
    }

    componentWillUnmount() {
        this.props.dataSource.total.removeEventListener();
    }

    onChangeCurrency = (option: any) => {
        let data = this.props.dataSource.total.get();
        data.currency = option.value;
        this.props.dataSource.total.change(data);
        this.props.onChangeCurrency();
    };

    render() {
        return (<>
            <div className='col-md-1 col-12'>
                <span><h5>{Locale.get('Total')}:</h5></span>
            </div>
            <div className='col-md-3 col-6'>
                <input className='form-control' value={this.state.amount.toFixed(2)} readOnly />
            </div>
            <div className='col-md-2 col-6'>
                <Select value={this.state.currency} onChange={this.onChangeCurrency} options={CurrenciesContentProvider.getInstance().getCurrencies()}/>
            </div>
        </>);
    }
}
