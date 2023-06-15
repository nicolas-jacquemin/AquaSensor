<template>
    <VDialog v-model="modelValue" width="auto">
    <VCard>
      <VCardText>
        <VProgressCircular indeterminate color="primary"></VProgressCircular>
      </VCardText>
    </VCard>
  </VDialog>
</template>

<script setup lang="ts">

const loading = ref(false);

const props = defineProps([
    "model"
]);

const modelValue = computed(() => {
    if (props.model)
        return true;
});

</script>
