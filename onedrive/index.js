import OnedriveAuthenticatorComponent from "./onedrive.component.vue";
import OnedriveFilePreviewComponent from "./preview.component.vue";
import AuthManager from "./auth-manager.service";
export default {
    install(Vue, options) {
        Vue.mixin({});

        let log = options.log;
        log.debug("instantiate onedrive auth manager and attach to prototype");
        Vue.prototype.onedriveAuthenticationManager = new AuthManager({
            clientId: options.clientID,
            redirectUri: options.redirectURI,
            log: options.log,
        });
        Vue.component(
            "OnedriveAuthenticatorComponent",
            OnedriveAuthenticatorComponent
        );
        Vue.component(
            "OnedriveFilePreviewComponent",
            OnedriveFilePreviewComponent
        );
    },
};
