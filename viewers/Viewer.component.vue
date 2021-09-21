<template>
    <div>
        <div v-if="link">
            <image-viewer-component :link="link" v-if="type === 'image'" />
            <audio-viewer-component :link="link" v-else-if="type === 'audio'" />
            <video-viewer-component :link="link" v-else-if="type === 'video'" />
            <document-viewer-component :link="link" v-else />
        </div>
    </div>
</template>

<script>
export default {
    props: {
        link: {
            type: String | undefined,
            required: true,
        },
        entity: {
            type: Object | undefined,
            required: true,
        },
    },
    data() {
        return {};
    },
    computed: {
        type: function () {
            if (!this.link) return;
            let type = this.entity.forwardProperties?.["encodingFormat"][0].value;
            return type.split("/")[0];
        },
    },
};
</script>
