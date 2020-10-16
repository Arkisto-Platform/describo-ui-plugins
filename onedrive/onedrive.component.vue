<template>
    <div class="flex flex-col">
        <div v-if="!account && !loggingIn && !loggedIn">
            <el-button type="primary" @click.prevent="login"
                >login to Microsoft OneDrive</el-button
            >
        </div>
        <div v-else>
            <div v-if="loggingIn">
                Please wait a moment whilst you're logged in...
                <el-select
                    v-if="drives && drives.length"
                    v-model="selectedDrive"
                    placeholder="Select the OneDrive to work with"
                    @change="emitRcloneConfigurationData"
                >
                    <el-option
                        v-for="drive in drives"
                        :key="drive.id"
                        :label="driveLabel(drive)"
                        :value="drive.id"
                    >
                        <span style="float: left">{{ drive.driveType }}</span>
                        <span
                            style="
                                float: right;
                                color: #8492a6;
                                font-size: 13px;
                            "
                            >{{ drive.id }}</span
                        >
                    </el-option>
                </el-select>
            </div>
            <div v-if="loggedIn">You are logged in to your OneDrive!</div>
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
            const user = await userAgentApplication.loginPopup({ scopes });
            if (userAgentApplication.getAccount()) {
                // console.log(userAgentApplication.getAccount());
                // get user token
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
                        .api(`/users/${user.accountIdentifier}/drives`)
                        .get()
                ).value;

                if (drives.length > 1) this.drives = drives;
                if (drives.length === 1) this.selectedDrive = drives[0];
                this.account = account;
                this.token = token;
                // let drive = await client.api("/me/drive").get();
                // console.log(drive);
                this.loggingIn = false;
                this.loggedIn = true;
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
        },
    },
};
</script>
