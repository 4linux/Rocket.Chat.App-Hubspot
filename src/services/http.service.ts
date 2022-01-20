import { IHttp } from '@rocket.chat/apps-engine/definition/accessors';
import { IHttpResponse } from '@rocket.chat/apps-engine/definition/accessors/IHttp';

const SUCCESS_RESPONSE_CODES = [200, 201];

export class HttpService {
    constructor(private http: IHttp) {}

    public async postForm(url: string, data: any, headers?: { [key: string]: string; }) {
        return this.http.post(url, {
            headers: {
                'Content-Type': 'application/x-www-form-urlencoded',
                ...headers,
            },
            params: data,
        });
    }

    public async postJson(url: string, data: any, headers?: { [key: string]: string; }) {
        return this.http.post(url, {
            headers: {
                'Content-Type': 'application/json',
                ...headers,
            },
            data,
        });
    }

    public isSuccess(response: IHttpResponse) {
        return SUCCESS_RESPONSE_CODES.includes(response.statusCode);
    }
}
