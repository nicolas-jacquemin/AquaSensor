<template>
  <VDialog v-model="modelValue" max-width="600">
    <VCard>
      <VCardText>
        <VForm @submit.prevent="submit" class="mt-7">
          <VTextField
            v-model="name"
            :rules="[ruleRequired, minimalLength]"
            prepend-inner-icon="fluent:person-24-regular"
            id="name"
            name="name"
            type="name"
            label="Name"
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
const name = ref("");
const loading = ref(false);
const emit = defineEmits(["emittedEvent"]);

const networkError = ref(false);
const unknownError = ref(false);

const router = useRouter();

const ruleRequired = (v: string) => !!v || "This field is required";
const minimalLength = (v: string) =>
  v.length >= 4 || "Must be at least 4 characters";

const props = defineProps(["model"]);

const modelValue = computed(() => {
  if (props.model) {
    name.value = localStorage.getItem("name");
    return true;
  }
});

async function submit() {
  if (name.value.length < 4) return false;
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
        name: name.value,
      }),
    });
    if (updateReq.status == 200) {
      localStorage.setItem("name", name.value);
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
  name.value = "";
}

function cancel() {
  loading.value = false;
  name.value = "";
  emit("emittedEvent", false);
}

</script>
