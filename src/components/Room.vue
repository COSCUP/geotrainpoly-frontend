<script setup lang="ts">
import { onMounted, ref, computed } from 'vue'
import { get_booth_info } from '../api/get_booths'
import { useRoute, useRouter } from 'vue-router'
import { GameData } from '../data/GameData.ts'

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

  try {
    const res = await get_booth_info(room.value as string)
    data.value = res

    if (res.session_id) {
      window.location.href = `${GameData.COSCUPBaseUrl}/session/${res.session_id}`
    }
  } catch (err) {
      console.error('Failed to load booth info:', err)
  }
})
</script>

<template>
  <div>
  </div>
</template>

