import { UserAgentApplication } from "msal";
import { ImplicitMSALAuthenticationProvider } from "@microsoft/microsoft-graph-client/lib/src/ImplicitMSALAuthenticationProvider";
import { MSALAuthenticationProviderOptions } from "@microsoft/microsoft-graph-client/lib/src/MSALAuthenticationProviderOptions";
import { Client } from "@microsoft/microsoft-graph-client";
import Vue from "vue";

export default class AuthManager {
    constructor({ clientId, redirectUri, log }) {
        this.$log = log;
        this.config = {
            auth: { clientId, redirectUri },
        };
        this.scopes = [
            "Files.Read",
            "Files.ReadWrite",
            "Files.Read.All",
            "Files.ReadWrite.All",
            "offline_access",
            "Sites.Read.All",
        ];
        this.tokenKey = "onedriveAccessToken";
        this.accountKey = "onedriveAccount";
        this.tokenRefreshHandle = undefined;
        this.refreshTokenIn = 50 * 60 * 1000; // 50 minutes in milliseconds
        this.httpService = undefined;
        this.api = undefined;
        this.configuration = undefined;
        this.apiClient = undefined;
    }

    getAccount() {
        return JSON.parse(window.sessionStorage.getItem(this.accountKey));
    }

    getToken() {
        return JSON.parse(window.sessionStorage.getItem(this.tokenKey));
    }

    async refreshToken() {
        this.$log.debug("Refreshing onedrive token");
        // log user in
        const userAgentApplication = new UserAgentApplication(this.config);
        if (!userAgentApplication.getAccount()) {
            await userAgentApplication.loginPopup({ scopes: this.scopes });
        }
        // get user account info and token
        let account = userAgentApplication.getAccount();
        this.account = account;

        let token;
        try {
            token = await userAgentApplication.acquireTokenSilent({
                scopes: this.scopes,
            });
        } catch (error) {
            await userAgentApplication.loginPopup({ scopes: this.scopes });
            account = userAgentApplication.getAccount();
            this.account = account;
        }
        this.token = Vue.observable(token);

        window.sessionStorage.setItem(this.tokenKey, JSON.stringify(token));
        window.sessionStorage.setItem(this.accountKey, JSON.stringify(account));
        if (this.tokenRefreshHandle) {
            clearTimeout(this.tokenRefreshHandle);
        }
        this.tokenRefreshHandle = setTimeout(this.refreshToken.bind(this), this.refreshTokenIn);

        if (this.httpService && this.api && this.configuration) {
            this.configuration = {
                ...this.configuration,
                token: {
                    access_token: this.getToken().accessToken,
                },
            };
            this.save({});
        }

        return { account, token };
    }

    async login() {
        await this.refreshToken();

        const msalApplication = new UserAgentApplication(this.config);
        const options = new MSALAuthenticationProviderOptions(this.scopes);
        const authProvider = new ImplicitMSALAuthenticationProvider(msalApplication, options);
        this.apiClient = Client.initWithMiddleware({ authProvider });
    }

    async loadDrives() {
        // get user drive
        let drives = (await this.apiClient.api(`/me/drives`).get()).value;

        return { drives };
    }

    async logout() {
        const config = {
            ...this.config,
            postLogoutRedirectUri: window.location.origin,
        };
        const msalApplication = new UserAgentApplication(config);
        const logoutRequest = {
            account: this.account.userName,
        };
        msalApplication.logout(logoutRequest);
    }

    async save({ httpService, api, configuration }) {
        this.$log.debug("Saving onedrive configuration back to the API");
        if (httpService) this.httpService = httpService;
        if (api) this.api = api;
        if (configuration) this.configuration = configuration;
        await this.httpService.post({
            route: this.api,
            body: this.configuration,
        });
    }
}
