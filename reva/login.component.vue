<template>
    <div class="flex flex-row self-stretch justify-center items-center h-64 mt-32">
        <div class="w-full md:w-3/5 lg:w-1/3 p-10 flex flex-col space-y-4 bg-white">
            <div class="text-xl text-center">{{ siteName }}</div>
            <div class="text-lg text-center">Login with Reva</div>
            <div class="mt-10">
                <el-select
                    v-model="selectedServer"
                    placeholder="Select a server to use"
                    class="w-full"
                    size="small"
                >
                    <el-option
                        v-for="server in reva"
                        :key="server.id"
                        :label="server.name"
                        :value="server.id"
                    >
                        <div>
                            {{ server.name }}
                            ({{ server.mode }})
                        </div>
                    </el-option>
                </el-select>
            </div>
            <div>
                <el-input placeholder="Username" v-model="username" size="small"></el-input>
            </div>
            <div class="flex flex-row">
                <el-input
                    placeholder="Password"
                    :type="passwordFieldType"
                    v-model="password"
                    size="small"
                ></el-input>
                <el-button @click="passwordFieldType = 'text'" size="small">
                    <div v-show="passwordFieldType === 'password'">
                        <i class="fas fa-eye-slash"></i>
                    </div>
                    <div v-show="passwordFieldType === 'text'">
                        <i class="fas fa-eye"></i>
                    </div>
                </el-button>
            </div>
            <el-button @click.prevent="login" size="small">
                <!-- <i class="fas fa-arrow-right"></i> -->
                login
            </el-button>
        </div>
    </div>
</template>

<script>
import { setToken } from "@/components/http.service";

export default {
    data() {
        return {
            siteName: this.$store.state.configuration.siteName,
            showInputForm: false,
            username: undefined,
            password: undefined,
            passwordFieldType: "password",
            servers: [],
            selectedServer: undefined,
            loggingIn: false,
            reva: this.$store.state.configuration.services.reva.map((s) => ({
                ...s,
                id: (Math.random() + 1).toString(36).substring(2),
            })),
        };
    },
    methods: {
        async getCurrentSession() {
            this.loggingIn = true;
            this.showInputForm = true;
        },
        async login() {
            let service = this.reva.filter((s) => s.id === this.selectedServer)[0];
            let { token, user } = await this.revaAuthenticationManager.authenticate({
                gateway: service.gateway,
                username: this.username,
                password: this.password,
                createSession: true,
            });
            setToken({ token });
            let response = await this.$http.post({
                route: "/session/reva",
                body: {
                    gateway: service.gateway,
                    name: user.displayName,
                    email: user.mail,
                },
            });
            if (response.status !== 200) {
                // unable to log in to reva
                return;
            }
            let describoToken = (await response.json()).token;

            setToken({ token: describoToken });
            await this.revaAuthenticationManager.saveServiceConfiguration({
                mode: service.mode,
                gateway: service.mode === "api" ? service.gateway : service.webdav,
                username: service.mode !== "api" ? this.username : "",
                password: service.mode !== "api" ? this.password : "",
                token: service.mode === "api" ? token : "",
            });
            setToken({ token: describoToken });
            this.$store.commit("setTargetResource", {
                resource: "reva",
                folder: undefined,
            });
            this.$router.push("/");
        },
        close() {
            this.loggingIn = false;
            this.showInputForm = false;
            this.selectedServer = undefined;
            this.passwordFieldType = "password";
        },
    },
};
</script>
