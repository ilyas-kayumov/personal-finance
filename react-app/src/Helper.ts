import { Locale } from "./Locale";

export class Helper {
    public static getFullTitle(title: string) {
        return title + ' | ' + Locale.get('Multi-currency Finance');
    }
}