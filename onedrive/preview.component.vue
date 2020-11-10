<template>
    <div class="flex flex-col">
        <!-- <div><el-button @click="getFilePreview">get preview</el-button></div> -->
        <iframe :src="link" title="" v-if="link" class="flex-grow"></iframe>
    </div>
</template>

<script>
export default {
    props: {
        path: {
            type: String,
            required: true,
        },
    },
    data() {
        return {
            link: undefined,
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
            let link = `/me/drive/root:${this.path}:/preview`;
            try {
                link = await client.api(link).post({
                    viewer: "onedrive",
                    chromeless: true,
                    allowEdit: false,
                });
                this.link = link.getUrl;
            } catch (error) {
                console.log(error);
            }
        },
    },
};
</script>
