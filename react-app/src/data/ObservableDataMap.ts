import { DataEvent } from "./DataEvent";

export interface Data<TKey> { id: TKey }

export class ObservableDataMap<TKey, TData extends Data<TKey>> {
    private observers: Map<DataEvent, Map<TKey, Function>>;
    protected dataMap: Map<TKey, TData>;
 
    constructor(dataMap: Map<TKey, TData>) {
        this.dataMap = dataMap;
        this.observers = new Map<DataEvent, Map<TKey, Function>>();

        for (let event of [DataEvent.Change, DataEvent.Add, DataEvent.Delete]) {
            this.observers.set(event, new Map<TKey, Function>());
        }
    }

    public addEventListener(event: DataEvent, id: TKey, callback: (money: TData) => void): void {
        this.observers.get(event)?.set(id, callback);
    }

    public removeEventListener(event: DataEvent, id: TKey): void {
        this.observers.get(event)?.delete(id);
    }

    public add(data: TData): void {
        if (this.dataMap.has(data.id)) {
            throw new Error('Data with id : ' + data.id + ' already exits');
        }

        this.dataMap.set(data.id, data);

        this.raiseEvent(DataEvent.Add, data);
    }

    public get(id: TKey): TData {
        let data = this.dataMap.get(id);
        if (data === undefined) {
            throw new Error('No data with id : ' + id);
        }

        return data;
    }

    public change(id: TKey, changeCallback: (data: TData) => void): void {
        let data = this.get(id);
        changeCallback(data);

        this.raiseEvent(DataEvent.Change, data);
    }

    public delete(id: TKey): void {
        let data = this.get(id);
        this.dataMap.delete(id);

        this.raiseEvent(DataEvent.Delete, data);
    }

    public clear(): void {
        this.dataMap.clear();
        this.observers.clear();
    }

    private raiseEvent(event: DataEvent, data: TData): void {
        let callback = this.observers.get(event)?.get(data.id);
        if (callback !== undefined) {
            callback(data);
        }
    }
}