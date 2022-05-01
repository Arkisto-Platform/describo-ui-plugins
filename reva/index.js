import RevaAuthenticatorComponent from "./reva.component.vue";
import RevaFilePreviewComponent from "./preview.component.vue";
import RevaLoginComponent from "./login.component.vue";
import AuthManager from "./auth-manager.service";

export default {
    install(app, options) {
        let log = options.log;
        log.debug("instantiate reva plugin");
        app.config.globalProperties.revaAuthenticationManager = new AuthManager({
            log: options.log,
            httpService: options.$http,
            ...options,
        });
        app.component("RevaAuthenticatorComponent", RevaAuthenticatorComponent);
        app.component("RevaFilePreviewComponent", RevaFilePreviewComponent);
        app.component("RevaLoginComponent", RevaLoginComponent);
    },
};
