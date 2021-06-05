import React, { Component } from 'react';
import { CurrenciesContentProvider } from '../balance/CurrenciesContentProvider';
import Select from 'react-select';
import { Helmet } from "react-helmet";
import { Helper } from '../Helper';
import { Locale } from '../Locale';
let data = require('../data.json');

export class CurrencyInflation extends Component<{}, { currency: any, rates: Array<any> }> {
    private currenciesMap: Map<string, string>;

    constructor(props: any) {
        super(props);
        let c = CurrenciesContentProvider.getInstance().getCurrency('USD');
        this.state = { currency: c, rates: [] };
        this.currenciesMap = new Map<string, any>([
            // 'AUD','BGN','BRL','CAD','CHF','CNY','CZK','DKK','EUR','GBP','HKD','HRK','HUF','IDR','ILS','INR','ISK','JPY','KRW','MXN',
            // 'MYR','NOK','NZD','PHP','PLN','RON','RUB','SEK','SGD','THB','TRY','USD','ZAR'
            ['AUD', 'Australia'],
            ['BGN', 'Bulgaria'],
            ['BRL', 'Brazil'],
            ['CAD', 'Canada'],
            ['CHF', 'Switzerland'],
            ['CNY', 'China, People\'s Republic of'],
            ['CZK', 'Czech Republic'],
            ['DKK', 'Denmark'],
            ['EUR', 'European Union'],
            ['GBP', 'United Kingdom'],
            ['HKD', 'Hong Kong SAR'],
            ['HRK', 'Croatia'],
            ['HUF', 'Hungary'],
            ['IDR', 'Indonesia'],
            ['ILS', 'Israel'],
            ['INR', 'India'],
            ['ISK', 'Iceland'],
            ['JPY', 'Japan'],
            ['KRW', 'Korea, Republic of'],
            ['MXN', 'Mexico'],
            ['MYR', 'Malaysia'],
            ['NOK', 'Norway'],
            ['NZD', 'New Zealand'],
            ['PHP', 'Philippines'],
            ['PLN', 'Poland'],
            ['RON', 'Romania'],
            ['RUB', 'Russian Federation'],
            ['SEK', 'Sweden'],
            ['SGD', 'Singapore'],
            ['THB', 'Thailand'],
            ['TRY', 'Turkey'],
            ['USD', 'United States'],
            ['ZAR', 'South Africa']
        ]);
    }

    componentDidMount() {
        this.updateRates('USD');
    }

    onChangeCurrency = (option: any) => {
        this.setState({ currency: option });
        this.updateRates(option.value);
    }

    updateRates = (currency: string) => {
        const countryKey: string = 'Inflation rate, average consumer prices (Annual percent change)';

        let ratesJSON = data['PCPIPCH'].filter((d: any) => d[countryKey] === this.currenciesMap.get(currency))[0];

        let rates = [];
        for (const [key, value] of Object.entries(ratesJSON)) {
            if (key !== countryKey) {
                let year = parseFloat(key);
                rates.push({ key: year, value: value });
            }
        }

        rates.sort((a, b) => b.key - a.key);

        this.setState({ rates: rates });
    }

    render() {
        const title = Locale.get('Currency Inflation');
        let provider = CurrenciesContentProvider.getInstance();
        return (
            <div className='card currency-inflation main'>
                <Helmet>
                    <title>{Helper.getFullTitle(title)}</title>
                    <meta name="description" content={Locale.get('Currency_Inflation_description')} />
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
                        <InflationTables rates={this.state.rates} />
                    </div>
                </div>
            </div>
        );
    }
}

class InflationTables extends React.Component<{ rates: Array<any> }, {}> {
    render() {
        let subRates = Array<Array<any>>();
        const step = 11;
        let length = this.props.rates.length;
        for (let i = 0; i < length; i += step) {
            subRates.push(this.props.rates.slice(i, (i + step) > length ? length : (i + step)));
        }

        return subRates.map(r => <div className='col-md-3 col-12'> <InflationTable rates={r} /> </div>);
    };
}

class InflationTable extends React.Component<{ rates: Array<any> }, {}> {
    render() {
        return (
        <table className="table">
        <thead>
            <tr>
                <th>{Locale.get('Year')}</th>
                <th>{Locale.get('Inflation Rate (%)')}</th>
            </tr>
        </thead>
        <tbody className='currency'>
            {this.props.rates.map(r => <tr className='text-info'> <td>{r.key}</td><td>{r.value}</td> </tr>)}
        </tbody>
    </table>);
    }
}