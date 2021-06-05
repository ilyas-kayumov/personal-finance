export default class CurrenciesAPI {
  static async getPopularRates() {
    return await fetch('/api/currencies/getpopularrates');
  }

  static async get() {
    return await fetch('/api/currencies/get');
  }

  static async getAllRates(currency) {
    return await fetch('/api/currencies/getallrates?currency=' + currency);
  }

  static async getRate(sourceCurrency, targetCurrency)
  {
    return await fetch('/api/currencies/getrate?sourceCurrency=' + 
      sourceCurrency + '&targetCurrency=' + targetCurrency);
  }

  static async exchange(sourceAmount, sourceCurrency, targetCurrency)
  {
    return await fetch('/api/currencies/exchange?sourceAmount=' + sourceAmount +
      '&sourceCurrency=' + sourceCurrency + '&targetCurrency=' + targetCurrency);
  }}
