import { ObservableDataItem } from "./data/ObservableDataItem";

export class TokenDataSource {

    private static instance: TokenDataSource;
    private data: ObservableDataItem<string>;

    private constructor() { 
        this.data = new ObservableDataItem(sessionStorage.getItem('token') ?? '');
    }

    public addEventListener(callback: (data: string) => void) {
        this.data.addEventListener(callback);
    }

    public removeEventListener() {
        this.data.removeEventListener();
    }

    public static getInstance(): TokenDataSource {
        if (!TokenDataSource.instance) {
            TokenDataSource.instance = new TokenDataSource();
        }

        return TokenDataSource.instance;
    }

    change(token: string) {
        this.data.change(token);
        sessionStorage.setItem('token', token);
    }

    get() {
        return sessionStorage.getItem('token');
    }
}