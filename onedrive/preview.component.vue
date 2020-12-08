<template>
    <div class="flex flex-col">
        <iframe :src="link" title="" v-if="link" class="flex-grow"></iframe>
        <div class="flex flex-col justify-center items-center h-64" v-if="!link">
            <div v-loading="loading" class="w-10 h-10"></div>
            <div v-if="error" class="flex flex-row">
                <div class="text-base pt-1">
                    {{ error }}
                </div>
            </div>
        </div>
    </div>
</template>

<script>
export default {
    props: {
        path: {
            type: String,
        },
        id: {
            type: String,
        },
    },
    data() {
        return {
            loading: false,
            link: undefined,
            error: undefined,
        };
    },
    mounted() {
        if (this.path) {
            this.getFilePreview();
        }
    },
    methods: {
        async getFilePreview() {
            this.loading = true;
            const client = this.onedriveAuthenticationManager.apiClient;
            let link;
            if (this.path) {
                link = `/me/drive/root:${this.path}:/preview`;
            } else if (this.id) {
                let id = this.id.match("#") ? this.id.split("#")[1] : this.id;
                link = `/me/drive/items/${id}/preview`;
            }
            try {
                link = await client.api(link).post({
                    viewer: "onedrive",
                    chromeless: true,
                    allowEdit: false,
                });
                this.link = link.getUrl;
            } catch (error) {
                this.error = `Preview not available at this time: ${error.message}`;
            }
            this.loading = false;
        },
    },
};
</script>
