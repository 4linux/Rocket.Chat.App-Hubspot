export interface IHubspotApp {
    id?: string;
    tokenType: string;
    refreshToken: string;
    accessToken: string;
    expiresIn: number;
    expiration: number;
    createAt: number;
    updatedAt: number;
}
