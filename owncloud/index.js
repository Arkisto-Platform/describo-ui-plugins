import OwncloudAuthenticatorComponent from "./owncloud.component.vue";
import OwncloudCallbackComponent from "./owncloud-callback.component.vue";
import OwncloudFilePreviewComponent from "./preview.component.vue";
import AuthManager from "./auth-manager.service";

export default {
    install(app, options) {
        let log = options.log;
        log.debug("instantiate owncloud plugin");
        app.config.globalProperties.owncloudAuthenticationManager = new AuthManager({
            log: options.log,
            httpService: options.$http,
            configuration: options.configuration,
            oauthToken: options.oauthToken,
        });
        app.component("OwncloudAuthenticatorComponent", OwncloudAuthenticatorComponent);
        app.component("OwncloudCallbackComponent", OwncloudCallbackComponent);
        app.component("OwncloudFilePreviewComponent", OwncloudFilePreviewComponent);

        options.router.addRoute([
            {
                path: "/owncloud-callback",
                component: OwncloudCallbackComponent,
            },
        ]);
    },
};
