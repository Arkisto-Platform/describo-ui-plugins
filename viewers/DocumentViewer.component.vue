<template>
    <div class="flex flex-col">
        <div class="text-center flex flex-col space-y-4" v-if="!useGoogleViewer">
            <div>
                A preview of this file can be displayed using the Google document viewer. By using
                the viewer you understand that Google will have access to this file.
            </div>
            <div>
                <el-button @click="useGoogleViewer = !useGoogleViewer">
                    Use Google Document Viewer
                </el-button>
            </div>
        </div>
        <div v-if="useGoogleViewer">
            <iframe :src="file" class="style-file-view">
                <p>Your browser does not support iframes.</p>
            </iframe>
        </div>
        <!-- <iframe
    src="https://docs.google.com/viewer?url=http://infolab.stanford.edu/pub/papers/google.pdf&embedded=true"
    style="width:600px; height:500px;"
    frameborder="0"
        ></iframe>-->
    </div>
</template>

<script>
export default {
    props: {
        link: {
            type: String,
            required: true,
        },
    },
    data() {
        return {
            useGoogleViewer: false,
        };
    },
    computed: {
        file: function () {
            if (!this.link) return;
            return `https://docs.google.com/viewer?url=${encodeURIComponent(
                this.link
            )}&embedded=true`;
        },
    },
};
</script>

<style lang="scss" scoped>
.style-file-view {
    height: 500px;
    width: 100%;
}
</style>
