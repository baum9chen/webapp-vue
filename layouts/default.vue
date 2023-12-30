<template>
	<div>
		<Navi />
		<nuxt /> <!-- 個別要素 -->
	</div>
</template>

<script>
import Navi from '~/components/Navi.vue'

export default {
	components: {
		Navi
	}
}
</script>
