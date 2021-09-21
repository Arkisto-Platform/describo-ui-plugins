import ViewerComponent from "./Viewer.component.vue";
import AudioViewerComponent from "./AudioViewer.component.vue";
import DocumentViewerComponent from "./DocumentViewer.component.vue";
import ImageViewerComponent from "./ImageViewer.component.vue";
import VideoViewerComponent from "./VideoViewer.component.vue";

export default {
    install(Vue, options) {
        Vue.mixin({});
        Vue.component("ViewerComponent", ViewerComponent);
        Vue.component("AudioViewerComponent", AudioViewerComponent);
        Vue.component("DocumentViewerComponent", DocumentViewerComponent);
        Vue.component("ImageViewerComponent", ImageViewerComponent);
        Vue.component("VideoViewerComponent", VideoViewerComponent);
    },
};
