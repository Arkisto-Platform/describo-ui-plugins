import { UserAgentApplication } from "msal";
import { ImplicitMSALAuthenticationProvider } from "@microsoft/microsoft-graph-client/lib/src/ImplicitMSALAuthenticationProvider";
import { MSALAuthenticationProviderOptions } from "@microsoft/microsoft-graph-client/lib/src/MSALAuthenticationProviderOptions";
import { Client } from "@microsoft/microsoft-graph-client";

export default class AuthManager {
    constructor({ clientId, redirectUri }) {
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
    }

    getAccount() {
        return JSON.parse(window.sessionStorage.getItem(this.accountKey));
    }

    getToken() {
        return JSON.parse(window.sessionStorage.getItem(this.tokenKey));
    }

    watchAndRefreshToken() {
        // check it every 2 minutes
        setInterval(checkToken.bind(this), 120000);
        function checkToken() {
            const token = JSON.parse(
                window.sessionStorage.getItem(this.tokenKey)
            );
            if (token) {
                const timeLeft =
                    Date.parse(token.expiresOn).valueOf() -
                    new Date().valueOf();
                // refresh if less than 5 minutes left
                if (timeLeft < 360000) {
                    console.log("refreshing access token");
                    this.refreshToken();
                }
            }
        }
    }

    async refreshToken() {
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
