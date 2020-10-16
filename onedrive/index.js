import OneDriveAuthenticatorComponent from "./onedrive.component.vue";
export default {
    // called by Vue.use(FirstPlugin)
    install(Vue, options) {
        Vue.mixin({
            mounted() {
                console.log("onedrive plugin mounted");
            },
        });

        Vue.component(
            "OnedriveAuthenticatorComponent",
            OneDriveAuthenticatorComponent
        );
    },
};
