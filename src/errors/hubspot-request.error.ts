export class HubspotRequestError extends Error {
    constructor() {
        super();

        this.message = 'Falha ao tentar realizar requisição ao hubspot';
    }
}
