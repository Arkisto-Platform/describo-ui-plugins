import OktaLoginComponent from './OktaLogin.component';
import OktaLoginCallbackComponent from './OktaLoginCallback.component'

export default {
    install(Vue, options) {
        Vue.mixin({});

        let log = options.log;

        Vue.component("OktaLoginComponent", OktaLoginComponent);
        Vue.component("OktaLoginCallbackComponent", OktaLoginCallbackComponent);
    }
}

export {OktaLoginComponent, OktaLoginCallbackComponent};
