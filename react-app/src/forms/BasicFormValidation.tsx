import { FieldsDataSource } from "./FieldsDataSource";
import { FormValidation } from "./FormValidation";
import { Locale } from "../Locale";

export class BasicFormValidation implements FormValidation {
    dataSource: FieldsDataSource;

    constructor(dataSource: FieldsDataSource) {
        this.dataSource = dataSource;
    }

    validateFields = (fields: Array<string>) : Map<string, string> => {
        let result = new Map<string, string>();

        for (let id of fields) {
            result.set(id, this.validateField(id))
        }

        return result;
    };

    validateField = (id: string): string => {
        return this.dataSource.getField(id).value.length === 0 ? this.getErrorMessage(id) : '';
    }

    getErrorMessage(id: string) {
        if (id === 'confirm password') {
            return Locale.get('Please, retype your password');
        }

        let label: string = '';
        id.split(' ').forEach(str => {
            label += str[0].toUpperCase() + str.slice(1) + ' ';
        });

        return Locale.get('Please, enter your ') + Locale.get(label.trimEnd()).toLowerCase();
    }
}
