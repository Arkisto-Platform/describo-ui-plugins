<template>
    <div class="flex flex-col text-center space-y-4 p-10">
        <div>Unfortunately file previews from owncloud are not possible at this time.</div>
        <!-- <div>
            <a :href="link" target="_blank" class="text-yellow-600"
                >open the owncloud folder in another window</a
            >
        </div> -->
    </div>
</template>

<script>
export default {
    data() {
        return {
            link: undefined,
        };
    },
    mounted() {
        this.getOwncloudPath();
    },
    methods: {
        async getOwncloudPath() {
            let server = await this.owncloudAuthenticationManager.getServerInformation();
            this.link = `${server.url}/apps/files/?dir=${this.$store.state.target.folder.path}`;
        },
    },
};
</script>
