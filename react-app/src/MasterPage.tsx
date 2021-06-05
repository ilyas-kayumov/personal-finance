import React, { Component } from 'react';
import { TokenDataSource } from './TokenDataSource';
import { Redirect, Link } from 'react-router-dom';
import { ExchangeRateData } from './balance/BalanceDataSource';
import CurrenciesAPI from './api/CurrenciesAPI';
import { Locale } from './Locale';
import SelectLanguage from './SelectLanguage';

class MasterPage extends Component<{}, { token: string, redirect: string, rates: Array<ExchangeRateData> }> {

    constructor(props: any) {
        super(props);
        this.state = { token: TokenDataSource.getInstance().get() ?? '', redirect: '', rates: [] };
    }

    async componentDidMount() {
        TokenDataSource.getInstance().addEventListener(token => this.setState({ token: token }));
        let response = await CurrenciesAPI.getPopularRates();
        let rates = await response.json();
        this.setState({ rates: rates });
    }

    componentWillUnmount() {
        TokenDataSource.getInstance().removeEventListener();
    }

    render() {
        if (this.state.redirect !== '') {
            return <Redirect to='login' />
        }

        let token = this.state.token;
        let logged = token !== null && token !== '';
        let email = sessionStorage.getItem('email');
        return (
            <div className='page-container'>
                <nav className="navbar navbar-expand-lg navbar-dark bg-primary">
                    <a className="navbar-brand custom-brand-text" href={Locale.getURL(logged ? 'balance' : '')}> {Locale.get('MULTI-CURRENCY FINANCE')}</a>
                    <ul className="navbar-nav mr-auto">
                        <li className='nav-item'><a className="nav-link" href={Locale.getURL('currency-converter')}>{Locale.get('Currency Converter')}</a></li>
                        <li className='nav-item'><a className="nav-link" href={Locale.getURL('exchange-rates')}>{Locale.get('Exchange Rates')}</a></li>
                        <li className='nav-item dropdown'>
                            <a className="nav-link dropdown-toggle" href="/" id="navbarDropdown" role="button" data-toggle="dropdown" aria-haspopup="true" aria-expanded="false">
                                {Locale.get('Calculators')}
                            </a>
                            <div className="dropdown-menu" aria-labelledby="navbarDropdown">
                                <a className="dropdown-item" href={Locale.getURL('loan-calculator')}>{Locale.get('Loan Calculator')}</a>
                                <a className="dropdown-item" href={Locale.getURL('interest-calculator')}>{Locale.get('Interest Calculator')}</a>
                            </div>
                        </li>
                        <li className='nav-item'><a className="nav-link" href={Locale.getURL('currency-inflation')}>{Locale.get('Currency Inflation')}</a></li>
                    </ul>
                    <form className="form-inline my-2 my-lg-0 language-form">
                        <label className='language-label-text mr-sm-2 mr-2'>{Locale.get('Language')}</label>
                        <div className='language-select'>
                            <SelectLanguage />
                        </div>
                    </form>
                    <form className="form-inline my-2 my-lg-0">
                        {logged && email !== null && email !== '' ? <label className='text-light mr-sm-2 mr-2'><strong>{email.split('@')[0]}</strong></label> : <></>}
                        {logged ? <Link to={Locale.getURL('login')} className='btn btn-outline-light my-2 my-sm-0' onClick={() => { TokenDataSource.getInstance().change(''); sessionStorage.setItem('email', ''); }}>Logout</Link> : <></>}
                    </form>
                </nav>
                <div className='container-fluid rates-bar'>
                    <div className='row justify-content-center'>
                        {this.state.rates.map(rate => <span key={rate.id} className='currency text-info text-nowrap'> {rate.sourceCurrency}/{rate.targetCurrency} {rate.rate.toFixed(3)} &nbsp; </span>)}
                    </div>
                </div>
                {this.props.children}
                <div className="box-footer" />
                <footer className="footer">
                    <div className="container footer-container">
                        <div className='row'>
                            <div className='col-12'>
                                <span className="text-secondary">{Locale.get('Multi-currency Finance')} - 2020</span>
                            </div>
                            <div className='col-12'>
                                <span className="text-secondary">{Locale.get('Contact')}: multi-currency-finance@protonmail.com</span>
                            </div>
                        </div>
                    </div>
                </footer>
            </div>
        );
    }
}

export default MasterPage;