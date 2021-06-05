import React, { Component, ChangeEvent } from 'react';
import Select from 'react-select';
import { CurrenciesContentProvider } from '../balance/CurrenciesContentProvider';
import { Helper } from '../Helper';
import { Helmet } from 'react-helmet';
import Result from '../calculator/Result';
import { Locale } from '../Locale';

export interface LoanCalculatorState {
    amount: number,
    term: number,
    rate: number,
    monthlyPayment: number,
    totalPayments: number,
    totalInterest: number,
    currency: any
}

class LoanCalculator extends Component<{}, LoanCalculatorState> {
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
            monthlyPayment: 0,
            totalPayments: 0,
            totalInterest: 0
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
        // Loan Payment (P) = Amount (A) / Discount Factor (D)
        // A = Total loan amount
        // D = {[(1 + r)n] - 1} / [r(1 + r)n]
        // Periodic Interest Rate (r) = Annual rate (converted to decimal figure) divided by number of payment periods
        // Number of Periodic Payments (n) = Payments per year multiplied by number of years
        let a = amount;
        let n = term * 12;
        let p = 0;
        if (rate !== 0) {
            let r = (rate / 100) / 12;
            let t = Math.pow(1 + r, n);
            let d = (t - 1) / (r * t);
            p = a / d;
        }
        else {
            if (term !== 0) {
                p = a / n;
            }
            else {
                p = Number.NaN;
            }
        }
        let totalPayments = p * n;
        this.setState({ monthlyPayment: p });
        this.setState({ totalPayments: totalPayments });
        this.setState({ totalInterest: totalPayments - a });
    }

    onChangeCurrency = (option: any) => {
        this.setState({ currency: option });
    };

    render() {
        let title = Locale.get('Amortized Loan Calculator');
        let provider = CurrenciesContentProvider.getInstance();
        return (
            <div className='card loan-calculator main'>
                <Helmet>
                    <title>{Helper.getFullTitle(title)}</title>
                    <meta name="description" content={Locale.get('Loan_Calculator_description')} />
                </Helmet>
                <h1>{title}</h1>
                <form>
                    <div className='form-group'>
                        <label>{Locale.get('Loan Amount')}</label>
                        <div className='form-row'>
                            <div className='col'>
                                <input name='amount' value={this.state.amount} onChange={this.onChange} min="0" step='0.01' type='number' className='form-control' placeholder={Locale.get('Loan Amount')} />
                            </div>
                            <div className='col'>
                                <Select value={this.state.currency} onChange={this.onChangeCurrency} options={provider.getCurrencies()} />
                            </div>
                        </div>
                    </div>
                    <div className='form-row'>
                        <div className='col form-group'>
                            <label>{Locale.get('Loan Term in Years')}</label>
                            <input name='term' value={this.state.term} onChange={this.onChange} min="0" step='0.01' type='number' className='form-control' placeholder={Locale.get('Loan Term in Years')} />
                        </div>
                        <div className='col form-group'>
                            <label>{Locale.get('Annual Rate (%)')}</label>
                            <input name='rate' value={this.state.rate} onChange={this.onChange} min="0" step='0.01' type='number' className='form-control' placeholder={Locale.get('Annual Rate (%)')} />
                        </div>
                    </div>
                    <div className='form-group'>
                        <h5>{Locale.get('Results')}</h5>
                        <Result label={Locale.get('Monthly Payment')} value={this.state.monthlyPayment} formatter={this.formatter} />
                        <Result label={Locale.get('Total Payments')} value={this.state.totalPayments} formatter={this.formatter} />
                        <Result label={Locale.get('Total_Interest_loan')} value={this.state.totalInterest} formatter={this.formatter} />
                    </div>
                </form>
            </div>
        );
    }
}

export default LoanCalculator;