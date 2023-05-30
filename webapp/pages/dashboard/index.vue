<template>
  <VContainer fluid class="fill-height justify-center">
    <div>
      <VSwitch name="relay1" v-model="relay1" @click="toggle" label="Relay 1"></VSwitch>
      <VSwitch name="relay2" v-model="relay2" @click="toggle" label="Relay 2"></VSwitch>
      <VSwitch name="relay3" v-model="relay3" @click="toggle" label="Relay 3"></VSwitch>
      <VSwitch name="relay4" v-model="relay4" @click="toggle" label="Relay 4"></VSwitch>
    </div>
  </VContainer>
</template>

<script setup>

const relay1 = ref(false);
const relay2 = ref(false);
const relay3 = ref(false);
const relay4 = ref(false);

const relayO = {
    relay1: {
        state: relay1,
        pin: 46,
    },
    relay2: {
        state: relay2,
        pin: 47,
    },
    relay3: {
        state: relay3,
        pin: 48,
    },
    relay4: {
        state: relay4,
        pin: 49,
    }
}

const toggle = async (e) => {
    const relay = relayO[e.target.name];
    relaySwitch(relay.pin, !relay.state.value);
};
</script>
