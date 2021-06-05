export default class AccountAPI {
    static async login(data) {
        return await AccountAPI.postData('login', data);
    }

    static async register(data) {
        return await AccountAPI.postData('register', data);
    }

    static async sendVerificationCode(email) {
        return await fetch('/api/account/sendverificationcode?email=' + email, { method: 'POST' });
    }

    static async verifyEmail(data) {
        return await AccountAPI.putData('verifyemail', data);
    }

    static async resetPassword(data) {
        return await AccountAPI.putData('resetpassword', data);
    }

    static async postData(url, data) {
        return await fetch('/api/account/' + url, {
            method: 'POST',
            headers: AccountAPI.getJsonHeaders(),
            body: JSON.stringify(data)
        });
    }

    static async putData(url, data) {
        return await fetch('/api/account/' + url, {
            method: 'PUT',
            headers: AccountAPI.getJsonHeaders(),
            body: JSON.stringify(data)
        });
    }

    static getJsonHeaders() {
        return {
            'Accept': 'application/json',
            'Content-Type': 'application/json'
        };
    }
}