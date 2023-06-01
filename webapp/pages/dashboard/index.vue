<template>
  <VContainer fluid class="fill-height justify-center">
    <relayToggler/>
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
