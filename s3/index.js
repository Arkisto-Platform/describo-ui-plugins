import S3AuthenticatorComponent from "./s3.component.vue";
import S3FilePreviewComponent from "./preview.component.vue";
import AuthManager from "./auth-manager.service";

export default {
    install(app, options) {
        let log = options.log;
        log.debug("instantiate s3 plugin");
        app.config.globalProperties.s3AuthenticationManager = new AuthManager({
            log: options.log,
            httpService: options.$http,
            configuration: options.configuration,
        });
        app.component("S3AuthenticatorComponent", S3AuthenticatorComponent);
        app.component("S3FilePreviewComponent", S3FilePreviewComponent);
    },
};
