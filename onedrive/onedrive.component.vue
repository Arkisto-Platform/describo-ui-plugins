<template>
    <div class="flex flex-row">
        <div class="mr-2">
            <el-button
                type="primary"
                @click.prevent="login"
                :disabled="loggedIn || loggingIn"
            >
                login to Microsoft OneDrive
            </el-button>
        </div>
        <div v-if="loggingIn" class="flex-grow">
            <el-select
                v-if="drives && drives.length"
                class="w-full"
                v-model="selectedDrive"
                placeholder="Select the OneDrive to work with"
                @change="emitRcloneConfigurationData"
            >
                <el-option
                    v-for="drive of drives"
                    :key="drive.id"
                    :label="drive.id"
                    :value="drive.id"
                >
                    <span class="text-left">{{ drive.driveType }}</span>
                    <span class="text-right text-gray-600">
                        {{ drive.id }}
                    </span>
                </el-option>
            </el-select>
        </div>
    </div>
</template>

<script>
export default {
    data() {
        return {
            loggingIn: false,
            loggedIn: false,
            account: undefined,
            token: undefined,
            drives: undefined,
            selectedDrive: undefined,
        };
    },
    methods: {
        async login() {
            this.loggingIn = true;
            this.loggedIn = false;
            let { drives } = await this.$onedriveAuthenticationManager.login();
            if (drives.length > 1) this.drives = drives;
            if (drives.length === 1) this.selectedDrive = drives[0];
            if (this.selectedDrive) {
                this.emitRcloneConfigurationData();
            }
        },
        emitRcloneConfigurationData() {
            const drive = this.drives.filter(
                (d) => d.id === this.selectedDrive
            )[0];
            this.$emit("rclone-configuration", {
                type: "onedrive",
                token: {
                    access_token: this.$onedriveAuthenticationManager.getToken()
                        .accessToken,
                },
                drive_id: drive.id,
                drive_type: drive.driveType,
            });
            this.loggingIn = false;
            this.loggedIn = true;
        },
    },
};
</script>
