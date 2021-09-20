export default class AuthManager {
    constructor({ log, httpService, configuration }) {
        this.$log = log;
        this.config = {
            configurationEndpoint: configuration,
            cache: {
                cacheLocation: "sessionStorage",
            },
        };
        this.serviceKey = "s3Service";
        this.httpService = httpService;
    }

    async getConfiguration() {
        let response = await this.httpService.get({
            route: this.config.configurationEndpoint,
        });
        return await response.json();
    }

    async setServer({ server }) {
        // this.$log.debug("Getting owncloud oauth token");
        console.log(server);

        // let server = JSON.parse(window.sessionStorage.getItem(this.serviceKey));
        let response = await this.httpService.post({
            route: this.config.configurationEndpoint,
            body: {
                host: server.url,
            },
        });
        if (response.status !== 200) {
            console.log(await response.text());
            // can't get access token using code
            throw new Error("Unable to log into s3 at this time");
        }
        return response.json();
    }

    getServerInformation() {
        return JSON.parse(window.sessionStorage.getItem(this.serviceKey));
    }
}
