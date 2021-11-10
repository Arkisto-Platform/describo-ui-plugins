<template>
    <div class="login flex flex-col">
        <div id="okta-signin-container"></div>
    </div>
</template>

<script>
import OktaSignIn from "@okta/okta-signin-widget";
import "@okta/okta-signin-widget/dist/css/okta-sign-in.min.css";
import { removeSessionSID, setToken } from "@/components/http.service";

export default {
    data() {
        return {
            widget: undefined,
        };
    },
    mounted() {
        this.init();
    },
    methods: {
        async init() {
            removeSessionSID();
            const okta = this.$store.state.configuration.services.okta;
            const signIn = new OktaSignIn({
                baseUrl: okta.domain,
                clientId: okta.clientId,
                redirectUri: okta.redirectUri,
                authParams: {
                    pkce: true,
                    issuer: okta.issuer,
                    display: "page",
                    // responseType: ['id_token', 'token'],
                    scopes: ["openid", "profile", "email"],
                },
                logo: this.$store.state.configuration.logo,
                i18n: {
                    en: {
                        "primaryauth.title":
                            this.$store.state.configuration.siteName ||
                            "Arkisto Platform - Describo",
                    },
                },
            });
            try {
                let tokens = await signIn.showSignInToGetTokens({
                    el: "#okta-signin-container",
                });
                await this.$oktaAuth.tokenManager.setTokens(tokens);
                const user = await this.$oktaAuth.getUser();
                let oktaToken = JSON.parse(window.localStorage.getItem("okta-token-storage"))
                    .accessToken.accessToken;
                let response = await this.$http.post({
                    route: "/session/okta",
                    body: {
                        name: user.name,
                        email: user.email,
                    },
                    headers: {
                        authorization: `Bearer ${oktaToken}`,
                        "Content-Type": "application/json",
                    },
                });
                if (response.status !== 200) {
                    console.log(`Unable to log in at this time`);
                    return;
                }
                let token = (await response.json()).token;
                setToken({ token });
                this.$router.push("/");
            } catch (error) {
                console.log(error);
                console.log(`Unable to log in at this time`);
            }
        },
    },
};
</script>
