let locale = require("./locale.json");

export class Locale {
    static get(key: string, enFromKey: boolean = true): string {
        let language = Locale.getLanguage();

        if (language === 'Русский') {
            return locale[key]['ru'];
        }
        else if (language === 'Español') {
            return locale[key]['es'];
        }

        if (key.includes('_')) {
            return locale[key]['en'];
        }

        return key;
    }

    static getLanguage() {
        let url = window.location.href;

        if (url.includes('/ru/') || url.endsWith('/ru')) {
            return 'Русский';
        }
        else if (url.includes('/es/') || url.endsWith('/es')) {
            return 'Español';
        }

        return 'English';
    }

    static getLocaleURL(language: string) {
        let url = window.location.href;

        let newCode = Locale.getCode(language);
        let code = Locale.getCode(Locale.getLanguage());

        let index = url.indexOf('/' + code + '/');
        if (index > 0) {
            return url.slice(index, url.length).replace('/' + code + '/', '/' + newCode + '/');
        }
        else if (url.endsWith('/' + code)) {
            return '/' + newCode;
        }

        return url;
    }

    static getURL(path: string) {
        let code = Locale.getCode(Locale.getLanguage());
        return '/' + code + (path === '' ? '' : '/') + path;
    }

    static getCode(language: string) {
        if (language === 'English') {
            return 'en';
        }

        if (language === 'Русский') {
            return 'ru';
        }

        if (language === 'Español') {
            return 'es';
        }

        return '';
    }
}