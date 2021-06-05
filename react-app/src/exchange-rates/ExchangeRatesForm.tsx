import React, { Component } from 'react';
import { CurrenciesContentProvider } from '../balance/CurrenciesContentProvider';
import Select from 'react-select';
import { ExchangeRateData } from '../balance/BalanceDataSource';
import CurrenciesAPI from '../api/CurrenciesAPI';
import { Helper } from '../Helper';
import { Helmet } from 'react-helmet';
import { Locale } from '../Locale';

class ExchangeRatesForm extends Component<{}, { currency: any, rates: Array<ExchangeRateData> }> {
    constructor(props: any) {
        super(props);
        let c = CurrenciesContentProvider.getInstance().getCurrency('USD');
        this.state = { currency: c, rates: [] };
    }

    async componentDidMount() {
        await this.updateRates(this.state.currency.value);
    }

    onChangeCurrency = async (option: any) => {
        this.setState({ currency: option });
        await this.updateRates(option.value);
    };

    updateRates = async (currency: string) => {
        let response = await CurrenciesAPI.getAllRates(currency);
        let rates = await response.json();
        this.setState({ rates: rates });
    }

    render() {
        const title = Locale.get('Exchange Rates');
        let provider = CurrenciesContentProvider.getInstance();
        return (
            <div className='card exchange-rates main'>
                <Helmet>
                    <title>{Helper.getFullTitle(title)}</title>
                    <meta name="description" content={Locale.get('Exchange_Rates_description')} />
                </Helmet>
                <h1>{title}</h1>
                <form>
                    <div className='form-group currency-inflation-form'>
                        <label>{Locale.get('Currency')}: </label>
                        <Select value={this.state.currency} onChange={this.onChangeCurrency} options={provider.getCurrencies()} />
                    </div>
                </form>
                <div className='container'>
                    <div className='row' >
                        <RatesTables rates={this.state.rates} />
                    </div>
                </div>
            </div>
        );
    }
}


class RatesTables extends React.Component<{ rates: Array<any> }, {}> {
    render() {
        let subRates = Array<Array<any>>();
        const step = 11;
        let length = this.props.rates.length;
        for (let i = 0; i < length; i += step) {
            subRates.push(this.props.rates.slice(i, (i + step) > length ? length : (i + step)));
        }

        return subRates.map(r => <div className='col-md-6 col-12'> <RateTable rates={r} /> </div>);
    };
}

class RateTable extends React.Component<{ rates: Array<any> }, {}> {
    render() {
        return (
            <table className="table">
                <thead>
                    <tr>
                        <th scope="col">{Locale.get('Currency Pair')}</th>
                        <th scope="col">{Locale.get('Rate')}</th>
                    </tr>
                </thead>
                <tbody className='currency'>
                    {this.props.rates.map(r => <tr className='text-info'> <td>{r.sourceCurrency} / {r.targetCurrency}</td><td>{r.rate.toFixed(5)}</td> </tr>)}
                </tbody>
            </table>);
    }
}

export default ExchangeRatesForm;

