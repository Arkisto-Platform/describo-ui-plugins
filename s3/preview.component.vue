<template>
    <div>
        <viewer-component :link="link" :entity="entity" />
    </div>
</template>

<script>
export default {
    props: {
        path: {
            type: String,
        },
        entity: {
            type: Object,
        },
    },
    data() {
        return {
            link: undefined,
            error: false,
        };
    },
    mounted() {
        this.getPresignedUrl();
    },
    methods: {
        async getPresignedUrl() {
            let response = await this.$http.post({
                route: `/s3/presigned-url`,
                body: { file: this.path },
            });
            if (response.status !== 200) {
                this.error = true;
            }
            this.link = (await response.json()).url;
        },
    },
};
</script>
