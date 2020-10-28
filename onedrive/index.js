import OneDriveAuthenticatorComponent from "./onedrive.component.vue";
import AuthManager from "./auth-manager.service";
export default {
    // called by Vue.use(FirstPlugin)
    install(Vue, options) {
        Vue.mixin({
            beforeDestroy() {
                delete Vue.prototype.$onedriveAuthenticationManager;
            },
        });

        Vue.prototype.$onedriveAuthenticationManager = new AuthManager({
            clientId: options.clientID,
            redirectUri: options.redirectURI,
        });
        Vue.prototype.$onedriveAuthenticationManager.watchAndRefreshToken();
        Vue.component(
            "OnedriveAuthenticatorComponent",
            OneDriveAuthenticatorComponent
        );
    },
};
