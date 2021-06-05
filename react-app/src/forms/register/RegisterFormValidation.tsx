import { FieldsDataSource } from "../FieldsDataSource";
import { BasicFormValidation } from "../BasicFormValidation";
import { FormValidation } from "../FormValidation";
import { Locale } from "../../Locale";

export class RegisterFormValidation implements FormValidation {
    dataSource: FieldsDataSource;
    basicValidation: BasicFormValidation;

    constructor(dataSource: FieldsDataSource, basicValidation: BasicFormValidation) {
        this.dataSource = dataSource;
        this.basicValidation = basicValidation;
    }

    validateFields = (fields: Array<string>) : Map<string, string> => {
        let result = new Map<string, string>();

        for (let id of fields) {
            result.set(id, this.validateField(id))
        }

        return result;
    };

    validateField = (id: string) : string => {
        let result = this.basicValidation.validateField(id);
        if (result !== '') {
            return result;
        }

        if (id === 'email') {
            result = this.validateEmail(id);
        }
        else if (id === 'password') {
            result = this.validatePassword(id);
        }
        else if (id === 'confirm password') {
            result = this.validateConfirmPassword(id);
        }

        return result;
    };

    private validateEmail = (id: string) : string => {
        let email = this.dataSource.getField(id).value;

        if (email.length < 3) {
            return Locale.get('Email must be at least 3 characters');
        }
        else if (email.indexOf('@') < 0) {
            return Locale.get('Email must contain \'@\' character');
        }

        return '';
    }

    private validatePassword = (id: string): string => {
        let password = this.dataSource.getField(id).value;

        let hasEmail = this.dataSource.hasField('email');
        let email = hasEmail ? this.dataSource.getField('email').value : '';

        if (password.length < 6) {
            return Locale.get('Password must be at least 6 characters');
        }
        else if (!/[a-z[A-Z]/.test(password) || !/[0-9]/.test(password)) {
            return Locale.get('Password must contain digits and letters');
        }
        else if (password === email) {
            return Locale.get('Password must differ from your email');
        }

        return '';
    }

    private validateConfirmPassword = (id: string): string => {
        let password = this.dataSource.getField('password').value;
        let confirmPassword = this.dataSource.getField(id).value;

        if (password !== confirmPassword) {
            return Locale.get('Your passwords do not match');
        }

        return '';
    }
}