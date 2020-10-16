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
        <div v-if="loggingIn">
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
import { UserAgentApplication } from "msal";
import { ImplicitMSALAuthenticationProvider } from "@microsoft/microsoft-graph-client/lib/src/ImplicitMSALAuthenticationProvider";
import { MSALAuthenticationProviderOptions } from "@microsoft/microsoft-graph-client/lib/src/MSALAuthenticationProviderOptions";
import { Client } from "@microsoft/microsoft-graph-client";
const scopes = [
    "Files.Read",
    "Files.ReadWrite",
    "Files.Read.All",
    "Files.ReadWrite.All",
    "offline_access",
    "Sites.Read.All",
];

export default {
    props: {
        clientId: {
            type: String,
            required: true,
        },
        redirectUri: {
            type: String,
            required: true,
        },
    },
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
            const config = {
                auth: {
                    clientId: this.clientId,
                    redirectUri: this.redirectUri,
                },
            };

            // log user in
            const userAgentApplication = new UserAgentApplication(config);
            if (!userAgentApplication.getAccount()) {
                await userAgentApplication.loginPopup({ scopes });
            }
            // get user account info and token
            const account = userAgentApplication.getAccount();
            const token = await userAgentApplication.acquireTokenSilent({
                scopes,
            });

            const msalApplication = new UserAgentApplication(config);
            const options = new MSALAuthenticationProviderOptions(scopes);
            const authProvider = new ImplicitMSALAuthenticationProvider(
                msalApplication,
                options
            );
            const client = Client.initWithMiddleware({ authProvider });

            // get user drive
            let drives = (
                await client
                    .api(`/users/${account.accountIdentifier}/drives`)
                    .get()
            ).value;

            if (drives.length > 1) this.drives = drives;
            if (drives.length === 1) this.selectedDrive = drives[0];
            this.account = account;
            this.token = token;
            this.$emit("account", account);
            this.$emit("token", token);
            if (this.selectedDrive) {
                this.emitRcloneConfigurationData();
            }
        },
        emitRcloneConfigurationData() {
            this.$emit("rclone-configuration", {
                type: "onedrive",
                token: { access_token: this.token.accessToken },
                drive_id: this.selectedDrive.id,
                drive_type: this.selectedDrive.driveType,
            });
            this.loggingIn = false;
            this.loggedIn = true;
        },
    },
};
</script>
