<template>
  <VDialog v-model="modelValue" width="auto">
    <VCard>
      <VCardText>
        <VForm @submit.prevent="submit" class="mt-7">
          <VTextField
            v-model="newpassword"
            :rules="[ruleRequired, minimalPass]"
            prepend-inner-icon="fluent:password-24-regular"
            id="newpass"
            name="newpass"
            type="newpass"
            label="New Password"
          />
          <VTextField
            v-model="confirmpass"
            :rules="[ruleRequired, passwordMatch]"
            prepend-inner-icon="fluent:password-24-regular"
            id="confirmpass"
            name="confirmpass"
            type="confirmpass"
            label="Confirm Password"
          />
          <VBtn @click="cancel">Cancel</VBtn>
          <VBtn type="submit">Save</VBtn>
        </VForm>
      </VCardText>
    </VCard>
  </VDialog>
  <Loading :model="loading"></Loading>
</template>

<script setup lang="ts">
const changepass = ref(false);
const newpassword = ref("");
const confirmpass = ref("");
const loading = ref(false);
const emit = defineEmits(["emittedEvent"]);

const ruleRequired = (v: string) => !!v || "This field is required";
const minimalPass = (v: string) =>
  v.length >= 8 || "Password must be at least 8 characters";

const passwordMatch = computed(() => newpassword.value === confirmpass.value || "Passwords do not match");

const props = defineProps(["model"]);

const modelValue = computed(() => {
  if (props.model) return true;
});

function submit() {
    if (newpassword.value != confirmpass.value || newpassword.length < 8)
        return false;
  loading.value = true;

  //TODO : send request to server
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
