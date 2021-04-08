import RevaLoginComponent from './RevaLogin.component';

export default {
    install(Vue, options) {
        Vue.mixin({});

        let log = options.log;

        Vue.component("RevaLoginComponent", RevaLoginComponent);
    }
}
