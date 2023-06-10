<template>
  <v-app-bar :elevation="2">
    <template v-slot:prepend>
      <v-btn class="d-block d-lg-none" icon="fluent:arrow-left-24-regular" @click="routerBack"></v-btn>
      <v-app-bar-nav-icon @click="nav = !nav"></v-app-bar-nav-icon>
    </template>

    <v-img class="app-bar-icon" src="/iconTransparent.png" />

    <template v-slot:append>
      <v-btn icon="fluent:person-24-regular" @click="account"></v-btn>
    </template>
  </v-app-bar>

  <v-navigation-drawer temporary v-model="nav">
    <v-list density="compact" nav :selected="navSelected">
      <v-list-item
        v-for="item in navItems" :key="item.title"
        :prepend-icon="item.icon"
        :title="item.title"
        :value="item.value"
        @click="
          router.push(`/${item.value}`);
          nav = false;
        "
      ></v-list-item>
    </v-list>
  </v-navigation-drawer>
</template>

<style scoped>
.app-bar-icon {
  height: 70%;
  width: auto;
}
</style>

<script setup>
let nav = ref(false);
let navSelected = ref(["dashboard"]);
let navItems = [
  {
    title: "Dashboard",
    icon: "fluent:home-24-regular",
    value: "dashboard",
  },
  {
    title: "Settings",
    icon: "fluent:settings-24-regular",
    value: "settings",
  },
];

onUpdated(() => {
    let pathname = window.document.location.pathname.split("/")[1];
    navSelected.value = [pathname];
})
const router = useRouter();

function account() {
  router.push("/settings/account");
}

function routerBack() {
  router.back();
}
</script>
