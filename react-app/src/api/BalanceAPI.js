import BasicAPI from "./BasicAPI";

export default class BalanceAPI {
  static async get() {
    return await fetch('/api/balance/get', {
      method: 'GET',
      headers: BasicAPI.getHeaders()
    });
  }

  static async getExchangeRates(currency) {
    return await fetch('/api/balance/getexchangerates?targetCurrency=' + currency, {
      method: 'GET',
      headers: BasicAPI.getHeaders()
    });
  }

  static async getTotal(currency) {
    return await fetch('/api/balance/total?currency=' + currency, {
      method: 'GET',
      headers: BasicAPI.getHeaders()
    });
  }
}

