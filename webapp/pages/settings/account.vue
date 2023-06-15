<template>
    <VContainer fluid class="justify-center">
    <VCard fluid>
      <VCardText>
        <v-avatar size="100" class="d-flex mx-auto" color="surface-variant">
          <v-icon size="56">fluent:person-24-regular</v-icon>
        </v-avatar>
        <h2 class="d-flex justify-center mt-10">{{username}}</h2>
        <h5 class="d-flex justify-center grey-italic">{{userslug}}</h5>
        <VBtn color="primary" @click="changeprofile = true" class="d-flex mx-auto mt-10">Customize Profile</VBtn>
        <VBtn color="primary" @click="changepass = true" class="d-flex mx-auto mt-10">Change Password</VBtn>
        <VBtn color="red" @click="logout" class="d-flex mx-auto mt-10">Logout</VBtn>
      </VCardText>
    </VCard>
  </VContainer>
  <changepassword @emittedEvent="onChangedPassword" :model="changepass"></changepassword>
  <changeProfile @emittedEvent="onChangedProfile" :model="changeprofile"></changeProfile>
</template>

<script setup>

useHead({
  title: 'Account',
})

definePageMeta({
    layout: "appbar"
})

let username = ref("");
let userslug = ref("");
const router = useRouter();
const changepass = ref(false);
const changeprofile = ref(false);

onMounted(() => {
    username.value = localStorage.getItem("name");
    userslug.value = localStorage.getItem("slug");
})

function logout() {
    localStorage.clear();
    router.push("/");
}

function onChangedPassword() {
    changepass.value = false;
}

function onChangedProfile() {
    changeprofile.value = false;
    username.value = localStorage.getItem("name");
}

</script>

<style scoped>

.grey-italic {
    font-style: italic;
    color: grey;
}

</style>