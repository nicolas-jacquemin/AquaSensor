<template>
  <VDialog v-model="modelValue" max-width="600">
    <VCard>
      <VCardText>
        <VForm @submit.prevent="submit" class="mt-7">
          <VTextField
            v-model="relayName"
            :rules="[ruleRequired]"
            prepend-inner-icon="fluent:brain-circuit-24-regular"
            id="relayName"
            name="relayName"
            type="relayName"
            label="Name"
          />
          <VTextField
            v-model="relayPin"
            :rules="[ruleRequired]"
            prepend-inner-icon="fluent:password-24-regular"
            id="relayPin"
            name="relayPin"
            type="relayPin"
            label="Pin"
            disabled
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
  <Error
    :model="customError"
    :errorMsg="customErrorMessage"
    @errorClosed="customError = false"
  ></Error>
</template>

<script setup lang="ts">
const loading = ref(false);
const emit = defineEmits(["emittedEvent"]);
const relayName = ref("");
const relayPin = ref("");

const router = useRouter();

const networkError = ref(false);
const unknownError = ref(false);
const customError = ref(false);
const customErrorMessage = ref("");

const ruleRequired = (v: string) => !!v || "This field is required";

const props = defineProps(["model", "pin", "name"]);

const modelValue = computed(() => {
  return props.model;
});

watch(() => props.model, () => {
  if (props.model) {
    relayName.value = props.name;
    relayPin.value = props.pin;
  }
});

async function submit() {
  if (relayName.value == "" || relayPin.value == "") return false;
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
    let updateReq = await fetch(`/api/settings/relayConfig/${relayPin.value}`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({
        name: relayName.value,
        normallyOpen: false,
      }),
    });
    if (updateReq.status == 200) {
      emit("emittedEvent", true);
    } else {
      if (updateReq.status == 400) {
        loading.value = false;
        customError.value = true;
        customErrorMessage.value = (await updateReq.json()).message;
        return;
      }
      unknownError.value = true;
      loading.value = false;
      return;
    }
  } catch (error: any) {
    networkError.value = true;
  }

  emit("emittedEvent", true);
  loading.value = false;
  relayPin.value = "";
  relayName.value = "";
}

function cancel() {
  loading.value = false;
  relayPin.value = "";
  relayName.value = "";
  emit("emittedEvent", false);
}

</script>
