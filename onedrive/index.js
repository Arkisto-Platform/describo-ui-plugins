import OnedriveAuthenticatorComponent from "./onedrive.component.vue";
import OnedriveFilePreviewComponent from "./preview.component.vue";
import AuthManager from "./auth-manager.service";
export default {
    install(app, options) {
        let log = options.log;
        log.debug("instantiate onedrive auth manager and attach to prototype");
        app.config.globalProperties.onedriveAuthenticationManager = new AuthManager({
            configuration: options.configuration,
            clientId: options.clientId,
            redirectUri: options.redirectUri,
            tenantId: options.tenantId,
            log: options.log,
            httpService: options.$http,
        });
        app.component("OnedriveAuthenticatorComponent", OnedriveAuthenticatorComponent);
        app.component("OnedriveFilePreviewComponent", OnedriveFilePreviewComponent);
    },
};
