export interface FormValidation {
    validateFields(fields: Array<string>) : Map<string, string>;
    validateField(id: string) : string;
}