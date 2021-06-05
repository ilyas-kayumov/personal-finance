export class FieldData {
    public id: string;
    public value: string;
    public alert: string;
    public type: string;

    constructor(id: string, value: string, alert: string, type: string) {
        this.id = id;
        this.value = value;
        this.alert = alert;
        this.type = type;
    }
}