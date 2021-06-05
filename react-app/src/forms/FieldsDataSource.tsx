import { FieldData } from "./FieldData";
import { ObservableDataMap } from "../data/ObservableDataMap";

export class FieldsDataSource extends ObservableDataMap<string, FieldData>  {

    public hasField(id: string): boolean {
        return this.dataMap.has(id);
    }

    public getField(id: string): FieldData {
        return this.get(id);
    }

    public changeFieldValue(id: string, value: string) {
        this.change(id, data => { data.value = value; });
    }

    public changeFieldAlert(id: string, alert: string) {
        this.change(id, data => { data.alert = alert; });
    }
}