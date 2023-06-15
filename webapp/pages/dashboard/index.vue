<template>
  <VContainer fluid class="justify-center">
    <VRow>
      <VCol></VCol>
      <VCol cols="12" sm="6" md="4" lg="3">
        <VCard fluid>
          <VCardText>
            <h2>{{ welcome }} {{ username }} !</h2>
          </VCardText>
        </VCard>
      </VCol>
      <VCol></VCol>
    </VRow>
  </VContainer>
  <VContainer fluid class="justify-center">
    <relayToggler />
  </VContainer>
</template>

<script setup lang="ts">

useHead({
  title: 'Dashboard',
})

definePageMeta({
  layout: "appbar",
});

let username = ref("");
let welcome = ref("");

function setWelcome(): string {
  if (new Date().getHours() < 6) {
    return "Good night";
  } else if (new Date().getHours() < 12) {
    return "Good morning";
  } else if (new Date().getHours() < 18) {
    return "Good afternoon";
  }
  return "Good evening !";
}

onMounted(() => {
  username.value = localStorage.getItem("name");
  welcome.value = setWelcome();
});
</script>
