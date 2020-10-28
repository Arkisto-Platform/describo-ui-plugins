import { UserAgentApplication } from "msal";
import { ImplicitMSALAuthenticationProvider } from "@microsoft/microsoft-graph-client/lib/src/ImplicitMSALAuthenticationProvider";
import { MSALAuthenticationProviderOptions } from "@microsoft/microsoft-graph-client/lib/src/MSALAuthenticationProviderOptions";
import { Client } from "@microsoft/microsoft-graph-client";

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
        const account = userAgentApplication.getAccount();
        this.account = account;

        const token = await userAgentApplication.acquireTokenSilent({
            scopes: this.scopes,
        });
        this.token = token;

        window.sessionStorage.setItem(this.tokenKey, JSON.stringify(token));
        window.sessionStorage.setItem(this.accountKey, JSON.stringify(account));
        if (this.tokenRefreshHandle) {
            clearTimeout(this.tokenRefreshHandle);
        }
        this.tokenRefreshHandle = setTimeout(
            this.refreshToken.bind(this),
            this.refreshTokenIn
        );

        return { account, token };
    }

    async login() {
        let { account } = await this.refreshToken();

        const msalApplication = new UserAgentApplication(this.config);
        const options = new MSALAuthenticationProviderOptions(this.scopes);
        const authProvider = new ImplicitMSALAuthenticationProvider(
            msalApplication,
            options
        );
        const client = Client.initWithMiddleware({ authProvider });

        // get user drive
        let drives = (
            await client.api(`/users/${account.accountIdentifier}/drives`).get()
        ).value;

        return { drives };
    }
}
