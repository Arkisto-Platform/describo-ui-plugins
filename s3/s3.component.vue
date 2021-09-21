<template>
    <div class="flex flex-col space-y-2">
        <div>
            <el-button type="primary" @click.prevent="getCurrentSession" :disabled="loggingIn">
                login to S3
            </el-button>
        </div>
        <div v-if="showInputForm" class="flex flex-row space-x-2 p-4 border rounded">
            <div>
                <el-button size="small" @click.prevent="close">
                    <i class="fas fa-times"></i>
                </el-button>
            </div>
            <div class="flex-grow">
                <el-select
                    v-model="selectedServer"
                    placeholder="Select a server to use"
                    class="w-full"
                    size="small"
                >
                    <el-option
                        v-for="server in servers"
                        :key="server.id"
                        :label="server.name"
                        :value="server.id"
                    >
                        <div>
                            {{ server.name }} <span v-if="server.url">({{ server.url }})</span>
                        </div>
                    </el-option>
                </el-select>
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
            servers: [],
            selectedServer: undefined,
            loggingIn: false,
        };
    },
    methods: {
        async getCurrentSession() {
            this.loggingIn = true;

            let { configuration } = await this.s3AuthenticationManager.getConfiguration();
            this.servers = configuration.map((s, i) => ({ ...s, id: i }));
            if (this.servers.length === 1) {
                this.selectedServer = this.servers[0];
                this.login();
            } else {
                this.showInputForm = true;
            }
        },
        async login() {
            const server = this.servers.filter((s) => s.id === this.selectedServer)[0];
            delete server.id;

            await this.s3AuthenticationManager.setServer({ server });
            this.showInputForm = false;
            this.loggingIn = false;
            this.$store.commit("setTargetResource", {
                resource: "s3",
            });
        },
        close() {
            this.loggingIn = false;
            this.showInputForm = false;
            this.selectedServer = undefined;
        },
    },
};
</script>
