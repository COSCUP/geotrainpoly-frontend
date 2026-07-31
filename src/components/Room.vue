<script setup lang="ts">
import { onMounted, ref, computed } from 'vue'
import { get_booth_info } from '../api/get_booths'
import { useRoute, useRouter } from 'vue-router'

const route = useRoute()
const router = useRouter()
const room = computed(() => route.query.room)
const token = computed(() => route.query.token)

const data = ref(null)


onMounted(async () => {
  if (!room.value) {
    router.push({ path: '/', query: { token: token.value } })
    return
  }

  data.value = await get_booth_info(room.value)
})
</script>

<template>
  <div>
    Room:
    <pre>{{ JSON.stringify(data, null, 2) }}</pre>
  </div>
</template>

