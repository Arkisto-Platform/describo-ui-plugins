import OneDriveAuthenticatorComponent from "./onedrive.component.vue";
import AuthManager from "./auth-manager.service";
export default {
    // called by Vue.use(FirstPlugin)
    install(Vue, options) {
        Vue.mixin({
            beforeDestroy() {
                delete Vue.prototype.onedriveAuthenticationManager;
            },
        });

        let log = options.log;
        log.debug("instantiate onedrive auth manager and attach to prototype");
        Vue.prototype.onedriveAuthenticationManager = new AuthManager({
            clientId: options.clientID,
            redirectUri: options.redirectURI,
            log: options.log,
        });
        Vue.component(
            "OnedriveAuthenticatorComponent",
            OneDriveAuthenticatorComponent
        );
    },
};
