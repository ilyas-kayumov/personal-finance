import BasicAPI from "./BasicAPI";

export default class MoneyAccountAPI {
  static async create(data) {
    return await fetch('/api/balance/moneyaccount/create', {
      method: 'POST',
      body: JSON.stringify(data),
      headers: BasicAPI.getHeaders()
    });
  }

  static async get(id) {
    return await fetch('/api/balance/moneyaccount/get?id=' + id, { method: 'GET', headers: BasicAPI.getHeaders() });
  }

  static async delete(id) {
    return await fetch('/api/balance/moneyaccount/delete?id=' + id, { method: 'DELETE', headers: BasicAPI.getHeaders() });
  }

  static async update(data) {
    return await fetch('/api/balance/moneyaccount/update', {
      method: 'PUT',
      body: JSON.stringify(data),
      headers: BasicAPI.getHeaders()
    });
  }
}
