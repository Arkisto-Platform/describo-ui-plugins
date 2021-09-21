<template>
    <div>
        <audio controls class="block w-full">
            <source :src="link" />
            Your browser does not support the <code>audio</code> element.
        </audio>
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
