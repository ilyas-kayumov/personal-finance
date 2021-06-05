export class ObservableDataItem<T> {
    private observer: (data: T) => void;
    private data: T;

    constructor(data: T) {
        this.data = data;
        this.observer = _ => { };
    }

    public addEventListener(callback: (data: T) => void) {
        this.observer = callback;
    }

    public removeEventListener() {
        this.observer = _ => { };
    }

    public change(data: T) {
        this.data = data;
        this.observer(data);
    }

    public get(): T {
        return this.data;
    }
}