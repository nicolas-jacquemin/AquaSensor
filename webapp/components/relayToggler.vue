<template>
  <VCard>
    <div v-for="relay in relays" :key="relay.id">
      <VSwitch
        :name="relay.name"
        v-model="relay.model"
        @click="toggle"
        :label="`${relay.label} ${relay.model ? 'ON' : 'OFF'}`"
      ></VSwitch>
    </div>
  </VCard>
</template>

<script setup lang="ts">

type Relay = {
    id: number;
    name: string;
    model: boolean;
    label: string;
}

const relays: Ref<Relay[]> = ref([]);

onMounted(() => {
    const getRelays = async () => {
        let accessToken: string | undefined;

        try {
            accessToken = await getAccessToken();
        } catch (error: any) {
            if (error.message == "Invalid token") {
                localStorage.clear();
                await router.push("/");
            }
            else {
                console.error(error);
            }
        }

        const response = await fetch("/api/relay", {
        method: "GET",
        headers: {
            Authorization: `Bearer ${accessToken}`,
        },
        });
        const data = await response.json();

        Object.keys(data.data).forEach((key) => {
            relays.value.push({
                id: data.data[key].id,
                name: `relay${data.data[key].id}`,
                model: data.data[key].state,
                label: data.data[key].label,
            })
        });
    };
    getRelays();
})

const router = useRouter();

const toggle = async (e: any) => {
  const relay = relays.value.find((r) => r.name === e.target.name);
  if (!relay) throw new Error("Relay not found");

  relay.model = !relay.model;
  const relayId = relay.id;
  const state = relay.model;

  let accessToken: string | undefined;

  try {
    accessToken = await getAccessToken();
  } catch (error: any) {
      if (error.message == "Invalid token") {
          localStorage.clear();
          await router.push("/");
      }
      else {
          console.error(error);
      }
  }

  fetch(`/api/relay/${relayId}/${state ? "on" : "off"}`, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${accessToken}`,
    },
  })
  .catch((error) => {
    relay.model = !relay.model;
  })
  .then((res) => {
    if (res.status != 200) {
      relay.model = !relay.model;
    }
  })
};
</script>
