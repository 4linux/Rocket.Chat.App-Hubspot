export class HubspotAuthenticationError extends Error {
    constructor(private responseData: any) {
        super();

        this.message = 'Falha ao tentar se autenticar com o hubspot';
    }

    public getResponseData() {
        return this.responseData;
    }
}
