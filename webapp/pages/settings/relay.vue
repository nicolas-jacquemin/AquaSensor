<template>
  <VContainer fluid class="justify-center">
    <VRow>
      <VCol></VCol>
      <VCol cols="12" sm="10" md="8" lg="6">
        <VCard fluid>
          <VCardText>
            <h2 class="d-flex justify-center mt-10">Relay Table</h2>
            <v-table class="mt-10">
              <thead>
                <tr>
                  <th class="text-left">Name</th>
                  <th class="text-left">Pin</th>
                  <th class="text-left"></th>
                </tr>
              </thead>
              <tbody>
                <tr v-for="item in relays" :key="item.name">
                  <td>{{ item.name }}</td>
                  <td>{{ item.relayId }}</td>
                  <td class="edit-td">
                    <VBtn @click="editRelay(item)"
                      ><VIcon>fluent:edit-24-regular</VIcon></VBtn
                    >
                    <VBtn @click="deleteRelay(item)"
                      ><VIcon>fluent:delete-24-regular</VIcon></VBtn
                    >
                  </td>
                </tr>
                <tr>
                  <td>
                    <VBtn color="primary" class="mt-5" @click="addRelayDial = true"
                      >Add Relay</VBtn
                    >
                  </td>
                  <td></td>
                </tr>
              </tbody>
            </v-table>
          </VCardText>
        </VCard>
      </VCol>
      <VCol></VCol>
    </VRow>
  </VContainer>
  <addRelay :model="addRelayDial" @emittedEvent="viewRelay(); addRelayDial = false"></addRelay>
  <updateRelay :pin="relayPin" :name="relayName" :model="editRelayDial" @emittedEvent="viewRelay(); editRelayDial = false"></updateRelay>
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

useHead({
  title: 'Relay Table',
})

definePageMeta({
  layout: "appbar",
});

const router = useRouter();
const relays = ref([]);
const addRelayDial = ref(false);
const editRelayDial = ref(false);
const relayName = ref("");
const relayPin = ref("");
const loading = ref(false);

const networkError = ref(false);
const unknownError = ref(false);

async function viewRelay() {
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
    let relaysR = await getRelays(token);
    relays.value = relaysR;
  } catch (error: any) {
    if (error.message == "Invalid token") {
      localStorage.clear();
      await router.push(`/?callback=${window.location.pathname}`);
      return;
    } else if (error.message == "Network Error") {
      networkError.value = true;
    } else {
      unknownError.value = true;
    }
    return;
  }
}

onMounted(() => {
  viewRelay();
});

async function deleteRelay(item) {
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
    let relaysReq = await fetch(`/api/settings/relayConfig/${item.relayId}`, {
      method: "DELETE",
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    if (relaysReq.status !== 200) {
      throw new Error("Unknown error");
    }
    await viewRelay();
    loading.value = false;
  } catch (error: any) {
    networkError.value = true;
    loading.value = false;
    return;
  }
}

function editRelay(item) {
  relayName.value = item.name;
  relayPin.value = item.relayId;
  editRelayDial.value = true;
}
</script>

<style scoped>
.grey-italic {
  font-style: italic;
  color: grey;
}
.edit-td {
  width: 132px;
}
</style>
