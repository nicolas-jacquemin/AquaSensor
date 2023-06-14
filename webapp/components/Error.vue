<template>
    <VDialog v-model="modelValue" width="auto">
      <VCard>
        <VCardText>
          <p class="red">{{ errorMsg }}</p>
        </VCardText>
        <VCardActions>
          <v-btn color="primary" block @click="close"
            >Ok</v-btn>
        </VCardActions>
      </VCard>
    </VDialog>
</template>

<script setup lang="ts">

const loading = ref(false);

const props = defineProps([
    "model",
    "errorMsg",
]);

const emit = defineEmits(["errorClosed"]);

const modelValue = computed(() => {
    if (props.model)
        return true;
});

function close() {
    emit("errorClosed");
}

</script>
