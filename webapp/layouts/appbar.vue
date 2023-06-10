<template>
    <div>
      <VApp>
        <VMain>
          <AppBar></AppBar>
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

onNuxtReady(async () => {
  const router = useRouter();

  try {
    await getAccessToken();
  } catch (error: any) {
    if (error.message == "Unknown error") {
      networkError.value = true;
    }
    if (error.message == "Invalid token") {
      localStorage.clear();
      await router.push("/");
    }
  }
});
</script>
