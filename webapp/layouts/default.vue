<template>
  <div>
    <VApp>
      <VMain>
        <slot />
      </VMain>
	  <VDialog v-model="networkError" width="auto" persistent>
          <VCard>
            <VCardText>
              <p class="red">Network Error !</p>
            </VCardText>
			<VCardActions>
          <v-btn color="primary" block @click="retry"
            >Retry</v-btn>
        </VCardActions>
          </VCard>
        </VDialog>
    </VApp>
  </div>
</template>

<script setup lang="ts">

const retry = () => {
  window.location.reload();
};

const networkError = ref(false);

</script>
