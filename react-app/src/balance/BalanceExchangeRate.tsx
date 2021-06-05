import React from "react";
import { BalanceDataSource } from "./BalanceDataSource";
import { ExchangeRate } from "../ExchangeRate";

export interface BalanceExchangeRateProps {
    id: string;
    dataSource: BalanceDataSource;
}

export class BalanceExchangeRate extends React.Component<BalanceExchangeRateProps, {}> {
    render() {
        let rate = this.props.dataSource.exchangeRates.get(this.props.id);
        return <ExchangeRate {...rate} />;
    }
}