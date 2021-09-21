<template>
    <div>
        <div>
            <el-button @click="toggleFullScreen" size="small">
                <i class="fas fa-expand fa-fw"></i>
            </el-button>
        </div>
        <div class="mt-4">
            <div>
                <img :src="link" />
            </div>
        </div>
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
            console.log(viewer);
            viewer.show(this.link);
        },
    },
};
</script>

<style lang="scss" scoped></style>
