import React, { Component } from 'react';
import { BalanceData, BalanceDataSource, MoneyData, MoneyAccountData, ExchangeRateData } from './BalanceDataSource';
import { EditMoneyAccount } from './EditMoneyAccount';
import { MoneyAccount } from './MoneyAccount';
import { MoneyAccountCreation } from './MoneyAccountCreation';
import { DataEvent } from "../data/DataEvent";
import MoneyAccountAPI from '../api/MoneyAccountAPI';
import { MoneyTotal } from './MoneyTotal';
import BalanceAPI from '../api/BalanceAPI';
import { Redirect } from 'react-router-dom';
import { BalanceExchangeRate } from './BalanceExchangeRate';
import { Helmet } from 'react-helmet';
import { Helper } from '../Helper';
import { Locale } from '../Locale';

export interface BalanceProps { data: BalanceData, currencies: Array<string> }

export class Balance extends Component<BalanceProps, { editId: number, moneyAccountsIds: Array<number>, exchangeRatesIds: Array<string>, redirect: string }> {
    private dataSource: BalanceDataSource;
    private money: Map<number, MoneyData>;
    private moneyAccounts: Map<number, MoneyAccountData>;
    private exchangeRates: Map<string, ExchangeRateData>;

    constructor(props: BalanceProps) {
        super(props);

        this.money = new Map<number, MoneyData>();
        this.moneyAccounts = new Map<number, MoneyAccountData>();
        let moneyAccountsIds = new Array<number>();

        for (let account of this.props.data.moneyAccounts) {
            this.moneyAccounts.set(account.id, account);
            moneyAccountsIds.push(account.id);
            this.money.set(account.money.id, account.money);
        }

        this.exchangeRates = new Map<string, ExchangeRateData>();
        let exchangeRatesIds = new Array<string>();

        for (let rate of this.props.data.exchangeRates) {
            this.exchangeRates.set(rate.id, rate);
            exchangeRatesIds.push(rate.id);
        }

        this.dataSource = new BalanceDataSource(this.money, this.moneyAccounts, this.exchangeRates, this.props.currencies, props.data.total);

        this.state = { editId: this.dataSource.editMoneyAccountId.get(), moneyAccountsIds: moneyAccountsIds, exchangeRatesIds: exchangeRatesIds, redirect: '' };
    }

    async componentDidMount() {
        this.money.forEach((_: MoneyData, id: number) => this.addMoneyEventListeners(id));

        this.moneyAccounts.forEach((_: MoneyAccountData, id: number) => this.addMoneyAccountEventListeners(id));

        this.dataSource.editMoneyAccountId.addEventListener(this.onChangeEditMoneyAccountId);
        this.dataSource.moneyAccountCreateRequest.addEventListener(this.onCreateMoneyAccountRequest);
    }

    async componentWillUnmount() {
        this.money.forEach((_: MoneyData, id: number) => this.removeMoneyEventListeners(id));

        this.moneyAccounts.forEach((_: MoneyAccountData, id: number) => this.removeMoneyAccountEventListeners(id));

        this.dataSource.editMoneyAccountId.removeEventListener();
        this.dataSource.moneyAccountCreateRequest.removeEventListener();
    }

    private addMoneyEventListeners(id: number) {
        this.dataSource.money.addEventListener(DataEvent.Change, id, this.onChangeMoney);
    }

    private removeMoneyEventListeners(id: number) {
        this.dataSource.money.removeEventListener(DataEvent.Change, id);
    }

    private addMoneyAccountEventListeners(id: number) {
        this.dataSource.moneyAccounts.addEventListener(DataEvent.Change, id, this.onChangeMoneyAccount);
        this.dataSource.moneyAccounts.addEventListener(DataEvent.Delete, id, this.onDeleteMoneyAccount);
    }

    private removeMoneyAccountEventListeners(id: number) {
        this.dataSource.moneyAccounts.removeEventListener(DataEvent.Change, id);
        this.dataSource.moneyAccounts.removeEventListener(DataEvent.Delete, id);
    }

    processResponse = async (response: Response, onSuccess: () => void) => {
        if (response.ok) {
            await onSuccess();
        }
        else if (response.status === 401) { // unauthorized
            this.setState({ redirect: 'login' });
        }
    }

    private onChangeMoney = (money: MoneyData) => {
        this.updateTotal();
    }

    private onCreateMoneyAccountRequest = async (moneyAccount: MoneyAccountData) => {
        let response = await MoneyAccountAPI.create(moneyAccount);
        await this.processResponse(response, async () => moneyAccount.id = await response.json() as number);
        if (!response.ok) {
            return;
        }

        response = await MoneyAccountAPI.get(moneyAccount.id);
        await this.processResponse(response, async () => moneyAccount = await response.json() as MoneyAccountData);
        if (!response.ok) {
            return;
        }

        this.dataSource.money.add(moneyAccount.money);
        this.dataSource.moneyAccounts.add(moneyAccount);

        this.addMoneyAccountEventListeners(moneyAccount.id);
        this.addMoneyEventListeners(moneyAccount.money.id);

        var newAccountsIds = this.state.moneyAccountsIds.concat(moneyAccount.id);
        this.setState({ moneyAccountsIds: newAccountsIds });

        this.updateTotal();
    }

    private onChangeMoneyAccount = async (moneyAccount: MoneyAccountData) => {
        let response = await MoneyAccountAPI.update(moneyAccount);
        await this.processResponse(response, () => {});
        if (!response.ok) {
            return;
        }

        this.updateTotal();
    }

    private onDeleteMoneyAccount = async (moneyAccount: MoneyAccountData) => {
        let response = await MoneyAccountAPI.delete(moneyAccount.id);
        await this.processResponse(response, () => {});
        if (!response.ok) {
            return;
        }

        this.removeMoneyAccountEventListeners(moneyAccount.id);
        this.removeMoneyEventListeners(moneyAccount.money.id);

        let filteredArray = this.state.moneyAccountsIds.filter(item => item !== moneyAccount.id);
        this.setState({ moneyAccountsIds: filteredArray });

        this.updateTotal();

    }

    private onChangeEditMoneyAccountId = (moneyAccountId: number) => {
        this.setState({ editId: this.dataSource.editMoneyAccountId.get() });
    }

    private getMoneyAccount = (ma: MoneyAccountData): JSX.Element => {
        if (this.state.editId === ma.id) {
            return <EditMoneyAccount name={ma.name} id={ma.id} moneyId={ma.money.id} dataSource={this.dataSource} />;
        }

        return <MoneyAccount name={ma.name} id={ma.id} moneyId={ma.money.id} dataSource={this.dataSource} />;
    }

    updateTotal = async () => {
        let total = this.dataSource.total.get();
        let response = await BalanceAPI.getTotal(total.currency);
        let amount = 0;
        await this.processResponse(response, async () => amount = await response.json());
        if (!response.ok) {
            return;
        }

        total.amount = amount;
        this.dataSource.total.change(total);

        // update rates
        let rates:Array<ExchangeRateData> = new Array<ExchangeRateData>();
        response = await BalanceAPI.getExchangeRates(total.currency);
        await this.processResponse(response, async () => rates = await response.json());
        if (!response.ok) {
            return;
        }

        this.dataSource.exchangeRates.clear();

        this.exchangeRates = new Map<string, ExchangeRateData>();
        let exchangeRatesIds = new Array<string>();

        for (let rate of rates) {
            this.exchangeRates.set(rate.id, rate);
            this.dataSource.exchangeRates.add(rate);
            exchangeRatesIds.push(rate.id);
        }

        this.setState({ exchangeRatesIds: exchangeRatesIds });
    }

    render() {
        if (this.state.redirect !== '') {
            return <Redirect to={this.state.redirect} />
        }

        const title = Locale.get('Balance');
        return (
            <>
                <div className='card balance main'>
                <Helmet>
                    <title>{Helper.getFullTitle(title)}</title>
                </Helmet>
                <h1>{title}</h1>
                    <form>
                        <div className='form-row box-total h-100 align-items-center'>
                            <MoneyTotal onChangeCurrency={this.updateTotal} dataSource={this.dataSource} />
                        </div>
                        <div className='form-row box'><MoneyAccountCreation dataSource={this.dataSource} /></div>
                        {this.state.moneyAccountsIds.map(id => <div id={id.toString()} className='form-row bottom-line-box h-100 justify-content-center align-items-center'>{this.getMoneyAccount(this.dataSource.moneyAccounts.get(id))}</div>)}
                    </form>
                    <div className='box'>
                        {this.state.exchangeRatesIds.map(id => <span id={id}> <BalanceExchangeRate id={id} dataSource={this.dataSource} /> </span>)}
                    </div>
                </div>
            </>
        );
    }
}