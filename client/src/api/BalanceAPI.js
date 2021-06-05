import BasicAPI from "./BasicAPI";

export default class BalanceAPI {
  static async get() {
    const response = await fetch('/api/balance/get', {
      method: 'GET',
      headers: BasicAPI.getHeaders()
    });

    return await response.json();
  }

  static async getTotal(currency) {
    const response = await fetch('/api/balance/total?currency=' + currency, {
      method: 'GET',
      headers: BasicAPI.getHeaders()
    });

    return await response.json();
  }
}

