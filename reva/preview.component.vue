<template>
    <div>
        <div class="flex flex-col text-center space-y-4">
            <div>Unfortunately file previews from reva are not possible at this time.</div>
        </div>
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
            // let response = await this.$http.post({
            //     route: `/reva/presigned-url`,
            //     body: { file: this.path },
            // });
            // if (response.status !== 200) {
            //     this.error = true;
            // }
            // this.link = (await response.json()).url;
        },
    },
};
</script>
