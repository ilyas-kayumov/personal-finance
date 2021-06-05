import React from "react";

function CurrencyContent(props: any) {
    return <span key={props.code} className='currency text-nowrap'><img className='flag' alt={props.code} src={require('../vector-svg/' + props.image + '.svg')} height='20px' width='20px' /> {props.code} &nbsp; </span>;
}

export class CurrenciesContentProvider {
    private static instance: CurrenciesContentProvider;
    private currenciesMap:Map<string, any>;
    private currencies:Array<any>;

    private constructor() { 
        this.currenciesMap =  new Map<string, any>([
            // 'AUD','BGN','BRL','CAD','CHF','CNY','CZK','DKK','EUR','GBP','HKD','HRK','HUF','IDR','ILS','INR','ISK','JPY','KRW','MXN',
            // 'MYR','NOK','NZD','PHP','PLN','RON','RUB','SEK','SGD','THB','TRY','USD','ZAR'
              ['AUD', this.currency('AUD', 'au')],
              ['BGN', this.currency('BGN', 'bg')],
              ['BRL', this.currency('BRL', 'br')],
              ['CAD', this.currency('CAD', 'ca')],
              ['CHF', this.currency('CHF', 'ch')],
              ['CNY', this.currency('CNY', 'cn')],
              ['CZK', this.currency('CZK', 'cz')],
              ['DKK', this.currency('DKK', 'dk')],
              ['EUR', this.currency('EUR', 'eu')],
              ['GBP', this.currency('GBP', 'gb')],
              ['HKD', this.currency('HKD', 'hk')],
              ['HRK', this.currency('HRK', 'hr')],
              ['HUF', this.currency('HUF', 'hu')],
              ['IDR', this.currency('IDR', 'id')],
              ['ILS', this.currency('ILS', 'il')],
              ['INR', this.currency('INR', 'in')],
              ['ISK', this.currency('ISK', 'is')],
              ['JPY', this.currency('JPY', 'jp')],
              ['KRW', this.currency('KRW', 'kr')],
              ['MXN', this.currency('MXN', 'mx')],
              ['MYR', this.currency('MYR', 'my')],
              ['NOK', this.currency('NOK', 'no')],
              ['NZD', this.currency('NZD', 'nz')],
              ['PHP', this.currency('PHP', 'ph')],
              ['PLN', this.currency('PLN', 'pl')],
              ['RON', this.currency('RON', 'ro')],
              ['RUB', this.currency('RUB', 'ru')],
              ['SEK', this.currency('SEK', 'se')],
              ['SGD', this.currency('SGD', 'sg')],
              ['THB', this.currency('THB', 'th')],
              ['TRY', this.currency('TRY', 'tr')],
              ['USD', this.currency('USD', 'us')],
              ['ZAR', this.currency('ZAR', 'za')]
            ]);

            this.currencies = Array.from(this.currenciesMap.values());
    }

    private currency(code: string, image: string): any {
        return { value: code, label: <CurrencyContent code={code} image={image} />  };
    }

    public static getInstance(): CurrenciesContentProvider {
        if (!CurrenciesContentProvider.instance) {
            CurrenciesContentProvider.instance = new CurrenciesContentProvider();
        }

        return CurrenciesContentProvider.instance;
    }

    public getCurrency(key: string): any {
        return this.currenciesMap.get(key);
    }

    public getCurrencies(): Array<any> {
        return this.currencies;
    }
}