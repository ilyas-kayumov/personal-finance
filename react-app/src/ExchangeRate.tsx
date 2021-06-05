import React from "react";
import { ExchangeRateData } from "./balance/BalanceDataSource";

export class ExchangeRate extends React.Component<ExchangeRateData, {}> {
    render() {
        let rate = this.props;
        return <span className='currency text-info text-nowrap'> {rate.sourceCurrency}/{rate.targetCurrency} {rate.rate.toFixed(5)} &nbsp; </span>;
    }
}