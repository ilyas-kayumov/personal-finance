import React, { Component } from 'react';
import BalanceAPI from '../api/BalanceAPI';
import CurrenciesAPI from '../api/CurrenciesAPI';
import { BalanceData } from './BalanceDataSource';
import { Balance } from './Balance';
import { Redirect } from 'react-router-dom';

export default class BalanceProxy extends Component<{}, { loaded: boolean, redirect: string }> {
    balanceData: BalanceData;
    currencies: Array<string>;

    constructor(props: any) {
        super(props);
        this.balanceData = {} as BalanceData;
        this.currencies = new Array<string>();
        this.state = { loaded: false, redirect: '' };
    }

    processResponse = async (response: Response, onSuccess: () => void) => {
        if (response.ok) {
            await onSuccess();
        }
        else if (response.status === 401) { // unauthorized
            this.setState({ redirect: 'login' });
        }
    }

    async componentDidMount() {
        let response = await BalanceAPI.get();
        await this.processResponse(response, async () => {
            this.balanceData = await response.json();
        });
        if (!response.ok) {
            return;
        }

        response = await CurrenciesAPI.get();
        await this.processResponse(response, async () => {
            this.currencies = await response.json();
            this.setState({ loaded: true });
        });
    }

    render() {
        if (this.state.redirect !== '') {
            return <Redirect to={this.state.redirect} />
        }

        if (this.state.loaded) {
            return <Balance data={this.balanceData} currencies={this.currencies} />
        }

        return (
            <div className="d-flex justify-content-center loading">
                <div className="spinner-border" role="status">
                    <span className="sr-only">Loading...</span>
                </div>
            </div>
        );
    }
}