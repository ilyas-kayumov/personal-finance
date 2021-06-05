export default class BasicAPI {
    static getHeaders() {
        let token = sessionStorage.getItem('token');
        return {
            'Accept': 'application/json',
            'Content-Type': 'application/json',
            'Authorization': 'Bearer ' + token
        };
    }
}