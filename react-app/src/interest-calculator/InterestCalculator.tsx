import React, { Component, ChangeEvent } from 'react';
import Select from 'react-select';
import { CurrenciesContentProvider } from '../balance/CurrenciesContentProvider';
import { Helmet } from 'react-helmet';
import { Helper } from '../Helper';
import Result from '../calculator/Result';
import { Locale } from '../Locale';

export interface InterestCalculatorState {
    amount: number,
    term: number,
    rate: number,
    totalInterest: number,
    currency: any,
    endBalance: number
}

class InterestCalculator extends Component<{}, InterestCalculatorState> {
    private formatter: Intl.NumberFormat;

    constructor(props: any) {
        super(props);
        this.formatter = new Intl.NumberFormat('en-US', {
            style: 'currency',
            currency: 'USD'
        });
        let c = CurrenciesContentProvider.getInstance().getCurrency('USD');
        this.state = {
            amount: 0,
            currency: c,
            term: 0,
            rate: 0,
            totalInterest: 0,
            endBalance: 0
        };
    }
    onChange = (event: ChangeEvent<HTMLInputElement>) => {
        let str = event.target.value;
        let index = str.indexOf('.');
        if (index > 0) {
            str = str.substr(0, index) + str.substr(index, 3);
        }

        let result = parseFloat(str);
        let amount = this.state.amount, term = this.state.term, rate = this.state.rate;
        switch (event.target.name) {
            case 'amount':
                this.setState({ amount: result });
                amount = result;
                break;
            case 'term':
                this.setState({ term: result });
                term = result;
                break;
            case 'rate':
                this.setState({ rate: result });
                rate = result;
                break;
        }

        this.updateResults(amount, rate, term);
    };

    updateResults = (amount: number, rate: number, term: number) => {
        let endBalance = amount * Math.pow(1 + rate / 100, term);

        this.setState({ endBalance: endBalance });
        this.setState({ totalInterest: endBalance - amount });
    }

    onChangeCurrency = (option: any) => {
        this.setState({ currency: option });
        this.formatter = new Intl.NumberFormat('en-US', {
            style: 'currency',
            currency: option.value
        });
    };

    render() {
        let title = Locale.get('Interest Calculator');
        let provider = CurrenciesContentProvider.getInstance();
        let amountLabel = Locale.get('Amount');
        return (
            <div className='card loan-calculator main'>
                <Helmet>
                    <title>{Helper.getFullTitle(title)}</title>
                    <meta name="description" content={Locale.get('Interest_Calculator_description')} />
                </Helmet>
                <h1>{title}</h1>
                <form>
                    <div className='form-group'>
                        <label>{amountLabel}</label>
                        <div className='form-row'>
                            <div className='col'>
                                <input name='amount' value={this.state.amount} onChange={this.onChange} min="0" step='0.01' type='number' className='form-control' placeholder={amountLabel} />
                            </div>
                            <div className='col'>
                                <Select value={this.state.currency} onChange={this.onChangeCurrency} options={provider.getCurrencies()} />
                            </div>
                        </div>
                    </div>
                    <div className='form-row'>
                        <div className='col form-group'>
                            <label>{Locale.get('Term in Years')}</label>
                            <input name='term' value={this.state.term} onChange={this.onChange} min="0" step='0.01' type='number' className='form-control' placeholder={Locale.get('Term in Years')} />
                        </div>
                        <div className='col form-group'>
                            <label>{Locale.get('Annual Rate (%)')}</label>
                            <input name='rate' value={this.state.rate} onChange={this.onChange} min='0' step='0.01' type='number' className='form-control' placeholder={Locale.get('Annual Rate (%)')} />
                        </div>
                    </div>
                    <div className='form-group'>
                        <h5>{Locale.get('Results')}</h5>
                        <Result label={Locale.get('End Balance')} value={this.state.endBalance} formatter={this.formatter} />
                        <Result label={Locale.get('Total Interest')} value={this.state.totalInterest} formatter={this.formatter} />
                    </div>
                </form>
            </div>
        );
    }
}

export default InterestCalculator;