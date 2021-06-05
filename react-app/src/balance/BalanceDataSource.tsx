import { ObservableDataMap } from "../data/ObservableDataMap";
import { ObservableDataItem } from "../data/ObservableDataItem";

export interface MoneyData {
    id: number;
    currency: string;
    amount: number;
}

export interface MoneyAccountData {
    id: number;
    name: string;
    money: MoneyData;
}

export interface PropertyData {
    id: number;
    name: string;
    cost: MoneyData;
}

export interface ExchangeRateData {
    id: string;
    sourceCurrency: string;
    targetCurrency: string;
    rate: number;
}

export interface BalanceData {
    moneyAccounts: Array<MoneyAccountData>;
    properties: Array<PropertyData>;
    exchangeRates: Array<ExchangeRateData>;
    total: MoneyData;
}

export class BalanceDataSource {
    public readonly money: ObservableDataMap<number, MoneyData>;
    public readonly moneyAccounts: ObservableDataMap<number, MoneyAccountData>;
    public readonly exchangeRates: ObservableDataMap<string, ExchangeRateData>;
    public readonly editMoneyAccountId:ObservableDataItem<number>;
    public readonly moneyAccountCreateRequest:ObservableDataItem<MoneyAccountData>;
    public readonly currencies: Array<string>;
    public readonly total: ObservableDataItem<MoneyData>;

    constructor(money: Map<number, MoneyData>, moneyAccounts: Map<number, MoneyAccountData>, exchangeRates: Map<string, ExchangeRateData>, currencies: Array<string>, totalData: MoneyData) {
        this.money = new ObservableDataMap<number, MoneyData>(money);
        this.moneyAccounts = new ObservableDataMap<number, MoneyAccountData>(moneyAccounts);
        this.exchangeRates = new ObservableDataMap<string, ExchangeRateData>(exchangeRates);
        this.currencies = currencies;
        this.editMoneyAccountId = new ObservableDataItem(-1);
        this.moneyAccountCreateRequest = new ObservableDataItem({} as MoneyAccountData);
        this.total = new ObservableDataItem(totalData);
    }
}