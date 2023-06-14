<template>
  <VContainer fluid class="mx-auto justify-center">
    <VRow>
      <VCol></VCol>
      <VCol cols="12" sm="6" md="4" lg="3">
        <VCard>
          <VCardText>
            <VList>
              <VListItem
                v-for="item in items"
                :prepend-icon="item.icon"
                :title="item.text"
                :value="item.value"
                @click="router.push(`${item.to}`)"
                nav
              ></VListItem>
            </VList>
          </VCardText>
        </VCard>
      </VCol>
      <VCol></VCol>
    </VRow>
  </VContainer>
</template>

<script setup>
definePageMeta({
  layout: "appbar",
});

const router = useRouter();

const items = ref([
  {
    icon: "fluent:person-24-regular",
    text: "Account",
    to: "/settings/account",
  },
]);
</script>
