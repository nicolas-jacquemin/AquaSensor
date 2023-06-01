<template>
	<div>
		<VApp>
			<VMain>
				<div v-if="isLoading" class="loading">
					<Loading />
				</div>
				<slot />
			</VMain>
		</VApp>
	</div>
</template>

<script>
export default {
  computed: {
    isLoading() {
		console.log("computing...");
      	return this.$nuxt.isFetching || this.$nuxt.isPreview;
    },
  },
};

onNuxtReady( async () => {
	const router = useRouter();
	
	try {
		await getAccessToken();
	}
	catch (error) {
        if (error.message == "Invalid token") {
            localStorage.clear();
            await router.push("/");
        }
    }
})
</script>