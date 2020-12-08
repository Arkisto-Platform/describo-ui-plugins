<template>
    <div class="flex flex-col">
        <!-- <div><el-button @click="getFilePreview">get preview</el-button></div> -->
        <iframe :src="link" title="" v-if="link" class="flex-grow"></iframe>
        <div class="flex flex-col justify-center items-center">
            <div v-if="error" class="flex flex-row">
                <!-- <div class="text-red-600 text-3xl mr-2">
                <i class="fas fa-exclamation-circle"></i>
            </div> -->
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
                this.error = "Preview not available at this time";
                console.log(error.message);
            }
        },
    },
};
</script>
