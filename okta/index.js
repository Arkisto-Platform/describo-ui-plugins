import OktaLoginComponent from "./okta-login.component.vue";
import { OktaAuth } from "@okta/okta-auth-js";

export default {
    install(app, options) {
        let log = options.log;
        log.debug("instantiate okta plugin");
        const oktaAuth = new OktaAuth({
            issuer: options.issuer,
            clientId: options.clientId,
            domain: options.domain,
            redirectUri: options.redirectUri,
            scopes: ["openid", "profile", "email"],
        });
        app.config.globalProperties.$oktaAuth = oktaAuth;
        app.component("OktaLoginComponent", OktaLoginComponent);
    },
};
