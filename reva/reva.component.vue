<template>
    <div class="flex flex-col space-y-2 style-input-form">
        <div>
            <el-button type="primary" @click.prevent="getCurrentSession" :disabled="loggingIn">
                Reva
            </el-button>
        </div>
        <div v-if="showInputForm">
            <Teleport to="#teleport-target-selection">
                <div class="flex flex-row space-x-2 p-4 border rounded">
                    <div>
                        <el-button size="small" @click.prevent="close">
                            <i class="fas fa-times"></i>
                        </el-button>
                    </div>
                    <div class="flex-grow flex flex-col space-y-2">
                        <div>
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
                            <el-input
                                placeholder="Username"
                                v-model="username"
                                size="small"
                            ></el-input>
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
                    </div>
                    <div>
                        <el-button
                            @click.prevent="login"
                            size="small"
                            :disabled="!selectedServer || !username || !password"
                        >
                            <i class="fas fa-arrow-right"></i>
                        </el-button>
                    </div>
                </div>
            </Teleport>
        </div>
    </div>
</template>

<script>
export default {
    data() {
        return {
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
            let { token } = await this.revaAuthenticationManager.authenticate({
                gateway: service.gateway,
                username: this.username,
                password: this.password,
            });

            await this.revaAuthenticationManager.saveServiceConfiguration({
                mode: service.mode,
                gateway: service.mode === "api" ? service.gateway : service.webdav,
                username: service.mode !== "api" ? this.username : "",
                password: service.mode !== "api" ? this.password : "",
                token: service.mode === "api" ? token : "",
            });

            this.showInputForm = false;
            this.loggingIn = false;
            this.$store.commit("setTargetResource", {
                resource: "reva",
            });
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

<style lang="scss" scoped>
.style-input-form {
    width: 700px;
}
</style>
