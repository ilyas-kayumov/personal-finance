import React, { Component, ChangeEvent } from 'react';
import { CurrenciesContentProvider } from '../balance/CurrenciesContentProvider';
import Select from 'react-select';
import { MoneyData } from '../balance/BalanceDataSource';
import { ObservableDataMap } from '../data/ObservableDataMap';
import { DataEvent } from '../data/DataEvent';
import CurrenciesAPI from '../api/CurrenciesAPI';
import { Helmet } from 'react-helmet';
import { Helper } from '../Helper';
import { Locale } from '../Locale';

export class CurrencyConvertorDataSource {
    public readonly money: ObservableDataMap<number, MoneyData>;
    constructor() {
        this.money = new ObservableDataMap(new Map([
            [0, { id: 0, currency: 'USD', amount: 0 }],
            [1, { id: 1, currency: 'USD', amount: 0 }]
        ]));
    }
}

export class CurrencyConverter extends Component {
    private readonly dataSource: CurrencyConvertorDataSource;
    constructor(props: any) {
        super(props);
        this.dataSource = new CurrencyConvertorDataSource();
    }

    private onChangeMoneyAmount = async (id: number) => {
        let source = this.dataSource.money.get(id);
        let target = this.dataSource.money.get(id === 0 ? 1 : 0);
        let response = await CurrenciesAPI.exchange(source.amount, source.currency, target.currency);
        let amount = parseFloat(await response.text()).toFixed(5);
        this.dataSource.money.change(id === 0 ? 1 : 0, d => { d.amount = parseFloat(amount) });
    }

    private onChangeMoneyCurrency = async (id: number) => {
        let source = this.dataSource.money.get(0);
        let target = this.dataSource.money.get(1);
        let response = await CurrenciesAPI.exchange(source.amount, source.currency, target.currency);
        let amount = parseFloat(await response.text()).toFixed(5);
        this.dataSource.money.change(1, d => { d.amount = parseFloat(amount) });
    }

    render() {
        const title = Locale.get('Currency Converter');
        return (
            <div className='card currency-convertor main'>
                <Helmet>
                    <title>{Helper.getFullTitle(title)}</title>
                    <meta name="description" content={Locale.get('Currency_Converter_description')} />
                </Helmet>
                <h1>{title}</h1>
                <form>
                    {[0, 1].map(id => <ConvertorMoney id={id} dataSource={this.dataSource} onChangeMoneyAmount={this.onChangeMoneyAmount} onChangeMoneyCurrency={this.onChangeMoneyCurrency} />)}
                </form>
            </div>
        );
    }
}

export interface ConvertorMoneyProps { 
    id: number,
    dataSource: CurrencyConvertorDataSource,
    onChangeMoneyAmount: (id:number) => void;
    onChangeMoneyCurrency: (id:number) => void;
}

export class ConvertorMoney extends React.Component<ConvertorMoneyProps, { amount: number, currency: any } > {
    constructor(props: ConvertorMoneyProps) {
        super(props);
        let data = this.props.dataSource.money.get(props.id);
        let c = CurrenciesContentProvider.getInstance().getCurrency(data.currency);
        this.state = { amount: data.amount, currency: c };
    }

    componentDidMount() {
        this.props.dataSource.money.addEventListener(DataEvent.Change, this.props.id, this.onChangeMoney);
    }

    componentWillUnmount() {
        this.props.dataSource.money.removeEventListener(DataEvent.Change, this.props.id);
    }

    private onChangeMoney = (data: MoneyData) => {
        this.setState({ amount: data.amount, currency: CurrenciesContentProvider.getInstance().getCurrency(data.currency) });
    }

    onChangeAmount = (event: ChangeEvent<HTMLInputElement>) => {
        let str = event.target.value;
        let index = str.indexOf('.');
        if (index > 0) {
            str = str.substr(0, index) + str.substr(index, 6);
        }

        let amount = parseFloat(str);
        this.props.dataSource.money.change(this.props.id, d => d.amount = amount);
        this.props.onChangeMoneyAmount(this.props.id);
    };

    onChangeCurrency = (option: any) => {
        this.props.dataSource.money.change(this.props.id, d => d.currency = option.value);
        this.props.onChangeMoneyCurrency(this.props.id);
    };

    render() {
        let provider = CurrenciesContentProvider.getInstance();
        return (
            <div className='form-row'>
                <div className='col-6 box-col'>
                    <input value={this.state.amount} onChange={this.onChangeAmount} type='number' className='form-control' placeholder={Locale.get('Amount')} />
                </div>
                <div className='col-6 box-col'>
                    <Select value={this.state.currency} onChange={this.onChangeCurrency} options={provider.getCurrencies()} />
                </div>
            </div>
        );
    }
}