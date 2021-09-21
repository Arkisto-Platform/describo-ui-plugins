<template>
    <div class="cursor-pointer flex flex-col items-center" @click="toggleFullScreen">
        <img :src="link" class="w-64 object-contain" />
    </div>
</template>

<script>
import "iv-viewer/dist/iv-viewer.css";
const { FullScreenViewer } = require("iv-viewer");

export default {
    props: {
        link: {
            type: String,
            required: true,
        },
    },
    data() {
        return {};
    },
    methods: {
        toggleFullScreen() {
            const viewer = new FullScreenViewer({});
            viewer.show(this.link);
        },
    },
};
</script>

<style lang="scss" scoped></style>
