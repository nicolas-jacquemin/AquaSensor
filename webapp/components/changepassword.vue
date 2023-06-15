<template>
  <VDialog v-model="modelValue" max-width="600">
    <VCard>
      <VCardText>
        <VForm @submit.prevent="submit" class="mt-7">
          <VTextField
            v-model="newpassword"
            :rules="[ruleRequired, minimalPass]"
            prepend-inner-icon="fluent:password-24-regular"
            id="newpass"
            name="newpass"
            type="password"
            label="New Password"
          />
          <VTextField
            v-model="confirmpass"
            :rules="[ruleRequired, passwordMatch]"
            prepend-inner-icon="fluent:password-24-regular"
            id="confirmpass"
            name="confirmpass"
            type="password"
            label="Confirm Password"
          />
          <VBtn @click="cancel">Cancel</VBtn>
          <VBtn type="submit">Save</VBtn>
        </VForm>
      </VCardText>
    </VCard>
  </VDialog>
  <Loading :model="loading"></Loading>
  <Error
    :model="networkError"
    errorMsg="Network Error"
    @errorClosed="networkError = false"
  ></Error>
  <Error
    :model="unknownError"
    errorMsg="An Error Occurred"
    @errorClosed="unknownError = false"
  ></Error>
</template>

<script setup lang="ts">
const changepass = ref(false);
const newpassword = ref("");
const confirmpass = ref("");
const loading = ref(false);
const emit = defineEmits(["emittedEvent"]);

const router = useRouter();

const networkError = ref(false);
const unknownError = ref(false);

const ruleRequired = (v: string) => !!v || "This field is required";
const minimalPass = (v: string) =>
  v.length >= 8 || "Password must be at least 8 characters";

const passwordMatch = computed(
  () => newpassword.value === confirmpass.value || "Passwords do not match"
);

const props = defineProps(["model"]);

const modelValue = computed(() => {
  if (props.model) return true;
});

async function submit() {
  if (newpassword.value != confirmpass.value || newpassword.value.length < 8) return false;
  loading.value = true;

  let token: string = "";

  try {
    token = await getAccessToken();
  } catch (error: any) {
    if (error.message == "Unknown error") {
      networkError.value = true;
      return;
    }
    if (error.message == "Invalid token") {
      localStorage.clear();
      await router.push(`/?callback=${window.location.pathname}`);
      return;
    }
  }

  try {
    let updateReq = await fetch("/api/auth/update", {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({
        password: newpassword.value,
      }),
    });
    if (updateReq.status == 200) {
      emit("emittedEvent", true);
    } else {
      unknownError.value = true;
      loading.value = false;
      return;
    }
  } catch (error: any) {
    networkError.value = true;
  }

  emit("emittedEvent", true);
  loading.value = false;
  newpassword.value = "";
  confirmpass.value = "";
}

function cancel() {
  loading.value = false;
  newpassword.value = "";
  confirmpass.value = "";
  emit("emittedEvent", false);
}
</script>
