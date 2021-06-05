export default class CurrenciesAPI {
  static async get() {
    const response = await fetch('/api/currencies/get');
    return await response.json();
  }
}
