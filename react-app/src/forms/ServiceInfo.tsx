import { CurrenciesContentProvider } from "../balance/CurrenciesContentProvider";
import React from "react";
import { Locale } from "../Locale";

export function ServiceInfo() {
    let currencies = CurrenciesContentProvider.getInstance().getCurrencies();
    return (
        <>
            <div className='main-text'>
                <h1>{Locale.get('Multi-currency Finance')}</h1>
                <div className='text-info'>
                    {Locale.get('Main_description', false)}
                </div>
            </div>
            <div className='main-currencies'>
                <h1>{Locale.get('Supported Currencies')}</h1>
                <div className='text-info'>
                    <div className='container'>
                        <div className='row'>
                            {currencies.map(c => c.label)}
                        </div>
                    </div>
                </div>
            </div>
        </>
    );
}