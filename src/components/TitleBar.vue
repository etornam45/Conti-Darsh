<script setup>

defineProps({
    title: String,
})

</script>


<template>
<header>
    {{ title }}
</header>
</template>

<style>

header{
    /* text-align: ; */
    /* padding: 40px; */
    height: 60px;
    padding: 10px 30px;
    background: gray;
    display: flex;
    align-items: center;
    font-size: 20px;
    font-weight: bolder;
}
</style>