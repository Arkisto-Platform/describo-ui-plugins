export default class AuthManager {
    constructor({ log, httpService, configuration, configurationRoute, authenticationRoute }) {
        this.$log = log;
        this.config = {
            configuration,
            configurationEndpoint: configurationRoute,
            authenticationEndpoint: authenticationRoute,
            cache: {
                cacheLocation: "sessionStorage",
            },
        };
        this.serviceKey = "revaService";
        this.httpService = httpService;
    }

    async authenticate({ gateway, username, password }) {
        let response = await this.httpService.post({
            route: this.config.authenticationEndpoint,
            body: {
                gateway,
                username,
                password,
            },
        });
        if (response.status !== 200) {
            // can't get access token using code
            throw new Error("Unable to log into reva at this time");
        }
        return await response.json();
    }

    async saveServiceConfiguration({ mode, gateway, username, password, token }) {
        let response = await this.httpService.post({
            route: this.config.configurationEndpoint,
            body: {
                mode,
                gateway,
                username,
                password,
                token,
            },
        });
        if (response.status !== 200) {
            // can't get access token using code
            throw new Error("Unable to log into reva at this time");
        }
        return response.json();
    }
}
