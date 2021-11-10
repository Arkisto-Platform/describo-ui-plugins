import RevaAuthenticatorComponent from "./reva.component.vue";
import RevaFilePreviewComponent from "./preview.component.vue";
import RevaLoginComponent from "./login.component.vue";
import AuthManager from "./auth-manager.service";

export default {
    install(Vue, options) {
        Vue.mixin({});

        let log = options.log;
        log.debug("instantiate reva plugin");
        Vue.prototype.revaAuthenticationManager = new AuthManager({
            log: options.log,
            httpService: options.$http,
            ...options,
        });
        Vue.component("RevaAuthenticatorComponent", RevaAuthenticatorComponent);
        Vue.component("RevaFilePreviewComponent", RevaFilePreviewComponent);
        Vue.component("RevaLoginComponent", RevaLoginComponent);
    },
};
