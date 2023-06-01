<template>
  <VContainer fluid class="fill-height">
    <VRow no-gutters align="center" justify="center" class="fill-height">
      <VCol cols="12" md="6" lg="5" sm="6">
        <VRow no-gutters align="center" justify="center">
          <VCol cols="12" md="6">
            <h1>Sign In</h1>
            <p class="text-medium-emphasis">Enter your details to get started</p>

            <VForm @submit.prevent="submit" class="mt-7">
              <div class="mt-1">
                <label class="label text-grey-darken-2" for="email">Username</label>
                <VTextField
                  :rules="[ruleRequired]"
                  v-model="username"
                  prepend-inner-icon="fluent:person-24-regular"
                  id="username"
                  name="username"
                  type="username"
                />
              </div>
              <div class="mt-1">
                <label class="label text-grey-darken-2" for="password">Password</label>
                <VTextField
                  :rules="[ruleRequired, wrongPass]"
                  v-model="password"
                  prepend-inner-icon="fluent:password-20-regular"
                  id="password"
                  name="password"
                  type="password"
                />
              </div>
              <div class="mt-5">
                <VBtn type="submit" block min-height="44" class="gradient primary">Sign In</VBtn>
              </div>
            </VForm>
          </VCol>
        </VRow>
      </VCol>
      <VCol class="hidden-md-and-down fill-height" md="6" lg="7">
        <VImg
          src="/wallpaper/home.png"
          cover
          class="h-100 rounded-xl d-flex align-center justify-center"
        >
        </VImg>
      </VCol>
    </VRow>
    <VDialog v-model="wrongPass" width="auto">
      <VCard>
        <VCardText>
          <p class="red">Wrong username or password !</p>
        </VCardText>
        <VCardActions>
          <v-btn color="primary" block @click="wrongPass = false" class="wrongPassOkButton"
            >Ok</v-btn
          >
        </VCardActions>
      </VCard>
    </VDialog>
  </VContainer>
</template>

<script setup lang="ts">
import { ref, onMounted } from "vue";
import { useRouter } from "vue-router";

import { AuthResponse } from "../types/auth.js";

onMounted(() => {
  if (localStorage.getItem("token") && localStorage.getItem("expUTC")) {
    router.push("/dashboard");
  }
});

const username = ref("");
const password = ref("");
const wrongPass = ref(false);

const router = useRouter();

const ruleRequired = (v: string) => !!v || "This field is required";

const submit = async () => {
  if (username.value === "" || password.value === "") return;

  try {
    let tokens: AuthResponse = await (
      await fetch("/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ username: username.value, password: password.value }),
      })
    ).json();
    if (!tokens.data.token || !tokens.data.expUTC) throw new Error("Access token not found");
    if (!tokens.data.refreshToken || !tokens.data.refreshExpUTC)
      throw new Error("Refresh token not found");
    localStorage.setItem("token", tokens.data.token);
    localStorage.setItem("expUTC", tokens.data.expUTC);
    localStorage.setItem("refreshToken", tokens.data.refreshToken);
    localStorage.setItem("refreshExpUTC", tokens.data.refreshExpUTC);
    await router.push("/dashboard");
  } catch (error) {
    password.value = "";
    wrongPass.value = true;
    console.error("Login Error: Wrong username or password", error);
  }
};
</script>

<style>
.red {
  color: red;
}
</style>
