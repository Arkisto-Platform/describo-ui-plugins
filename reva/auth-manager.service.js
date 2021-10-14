export default class AuthManager {
    constructor({ log, httpService, configuration }) {
        this.$log = log;
        this.config = {
            configurationEndpoint: configuration,
            cache: {
                cacheLocation: "sessionStorage",
            },
        };
        this.serviceKey = "revaService";
        this.httpService = httpService;
    }

    async saveServiceConfiguration({ url, username, password }) {
        let response = await this.httpService.post({
            route: this.config.configurationEndpoint,
            body: {
                url,
                username,
                password,
            },
        });
        if (response.status !== 200) {
            // can't get access token using code
            throw new Error("Unable to log into reva at this time");
        }
        return response.json();
    }
}
