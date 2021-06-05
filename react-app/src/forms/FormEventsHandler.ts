import { FormValidation } from "./FormValidation";
import { FieldsDataSource } from "./FieldsDataSource";
import { FormEvent } from "react";

export class FormEventsHandler {
    dataSource: FieldsDataSource;
    formValidation: FormValidation;
    fields: Array<string>;
    submitForm: (e:FormEvent<HTMLFormElement>) => void;
    alerts: Set<string>;
    blockOnBlur: boolean;

    constructor(dataSource: FieldsDataSource, formValidation: FormValidation, fields: Array<string>, submitForm: (e:FormEvent<HTMLFormElement>) => void) {
        this.dataSource = dataSource;
        this.formValidation = formValidation;
        this.fields = fields;
        this.submitForm = submitForm;
        this.alerts = new Set<string>();
        this.blockOnBlur = false;
    }

    onChange = (e: any) => {
        const name = e.target.name;

        this.dataSource.changeFieldValue(name, e.target.value);

        let error = this.formValidation.validateField(name);
        this.updateAlert(name, error);
    }

    onBlur = (e: any) => {
        if (this.blockOnBlur) {
            return false;
        }

        const name = e.target.name;

        let error = this.formValidation.validateField(name);

        if (!this.alerts.has(name)) {
            this.alerts.add(name);
        }

        this.updateAlert(name, error);
    }

    onSubmit = async (e: FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        let errors = this.formValidation.validateFields(this.fields);

        for (let key of this.fields) {
            if (!this.alerts.has(key)) {
                this.alerts.add(key);
            }
        }

        this.updateAlerts(errors);

        if (!this.isValidForm(errors)) {
            await this.submitForm(e);
        }
    }

    onMouseDown = (e: React.MouseEvent<HTMLElement>) : void => {
        this.blockOnBlur = true;
    }

    onMouseLeave = (e: React.MouseEvent<HTMLElement>) : void => {
        this.blockOnBlur = false;
    }

    onMouseUp = (e: React.MouseEvent<HTMLElement>) : void => {
        this.blockOnBlur = false;
    }

    private updateAlerts = (errors: Map<string, string>) : void => {
        errors.forEach((value: string, key: string) => {
            this.updateAlert(key, value);
        });
    }

    private updateAlert = (id: string, error: string) : void => {
        if (this.alerts.has(id)) {
            this.dataSource.changeFieldAlert(id, error);
        } 
        else {
            this.dataSource.changeFieldAlert(id, '');
        }
    }

    private isValidForm = (errors: Map<string, string>) : boolean => {
        let anyErrors = false;

        errors.forEach((value: string) => {
            if (value !== '') {
                anyErrors = true;
            }
        });

        return anyErrors;
    }
}