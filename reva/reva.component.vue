<template>
    <div class="flex flex-col space-y-2 style-input-form">
        <div>
            <el-button type="primary" @click.prevent="getCurrentSession" :disabled="loggingIn">
                Reva
            </el-button>
        </div>
        <div v-if="showInputForm" class="flex flex-row space-x-2 p-4 border rounded">
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
                            :key="server.storageUrl"
                            :label="server.name"
                            :value="server"
                            :value-key="server.storageUrl"
                        >
                            <div>
                                {{ server.name }}
                                <span v-if="server.storageUrl">({{ server.storageUrl }})</span>
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
            </div>
            <div>
                <el-button @click.prevent="login" size="small">
                    <i class="fas fa-arrow-right"></i>
                </el-button>
            </div>
        </div>
    </div>
</template>

<script>
export default {
    data() {
        return {
            showInputForm: false,
            username: "",
            password: "",
            passwordFieldType: "password",
            servers: [],
            selectedServer: undefined,
            loggingIn: false,
            reva: this.$store.state.configuration.services.reva,
        };
    },
    methods: {
        async getCurrentSession() {
            this.loggingIn = true;
            this.showInputForm = true;
        },
        async login() {
            await this.revaAuthenticationManager.saveServiceConfiguration({
                username: this.username,
                password: this.password,
                url: this.selectedServer.url,
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
