export class FormResponseResult {
    public errors: Map<string, string>;
    public mainError: string;

    constructor(errors: Map<string, string>, mainError: string) {
        this.errors = errors;
        this.mainError = mainError;
    }
}

export class FormResponseReader {
    public async read(response: Response, fields: Array<string>): Promise<FormResponseResult> {
        let bodyText = await response.text();
        let bodyObject = FormResponseReader.tryParseJSON(bodyText);
        let errors = new Map<string, string>();
        let mainError = '';

        if (bodyObject !== undefined) {
            for (let field of fields) {
                let fieldCapital = field[0].toUpperCase() + field.slice(1);

                if (bodyObject['errors'] === undefined ||
                    bodyObject['errors'][fieldCapital] === undefined || 
                    bodyObject['errors'][fieldCapital][0] === undefined) {
                    continue;
                }

                let error = bodyObject['errors'][fieldCapital][0];
                errors.set(field, error);
            }

            mainError = errors.size > 0 ? 
                        'Some fields are incorrect' :
                        bodyObject;
        }
        else {
            mainError = bodyText;
        }

        return new FormResponseResult(errors, mainError);
    }

    private static tryParseJSON(body: string) : any {
        let bodyObject: any = undefined;

        try {
            bodyObject = JSON.parse(body);
        }
        catch (e) {
        }

        return bodyObject;
    }
}