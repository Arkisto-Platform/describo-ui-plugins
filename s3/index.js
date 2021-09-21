import S3AuthenticatorComponent from "./s3.component.vue";
import S3FilePreviewComponent from "./preview.component.vue";
import AuthManager from "./auth-manager.service";

export default {
    install(Vue, options) {
        Vue.mixin({});

        let log = options.log;
        log.debug("instantiate s3 plugin");
        Vue.prototype.s3AuthenticationManager = new AuthManager({
            log: options.log,
            httpService: options.$http,
            configuration: options.configuration,
        });
        Vue.component("S3AuthenticatorComponent", S3AuthenticatorComponent);
        Vue.component("S3FilePreviewComponent", S3FilePreviewComponent);
    },
};
