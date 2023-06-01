<template>
    <VDialog v-model="loading" width="auto">
      <VCard>
        <VCardText>
            <VProgressCircular indeterminate color="primary"></VProgressCircular>
        </VCardText>
      </VCard>
    </VDialog>
</template>

<script setup lang="ts">

const loading = ref(false);

onMounted(() => {
    loading.value = true;
})

</script>
