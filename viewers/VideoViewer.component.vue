<template>
    <div>
        <video controls class="block w-full">
            <source :src="link" />
            Your browser does not support the <code>video</code> element.
        </video>
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
        return {};
    },
};
</script>

<style lang="scss" scoped></style>
