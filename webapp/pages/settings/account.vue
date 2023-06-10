<template>
    <VContainer fluid class="justify-center">
    <VCard fluid>
      <VCardText>
        <v-avatar size="100" class="d-flex mx-auto" color="surface-variant">
          <v-icon size="56">fluent:person-24-regular</v-icon>
        </v-avatar>
        <h2 class="d-flex justify-center mt-10">{{username}}</h2>
        <h5 class="d-flex justify-center grey-italic">{{userslug}}</h5>
        <VBtn color="red" @click="logout" class="d-flex mx-auto mt-10">Logout</VBtn>
      </VCardText>
    </VCard>
  </VContainer>
</template>

<script setup>

definePageMeta({
    layout: "appbar"
})

let username = ref("");
let userslug = ref("");
const router = useRouter();

onMounted(() => {
    username.value = localStorage.getItem("name");
    userslug.value = localStorage.getItem("slug");
})

function logout() {
    localStorage.clear();
    router.push("/");
}

</script>

<style scoped>

.grey-italic {
    font-style: italic;
    color: grey;
}

</style>