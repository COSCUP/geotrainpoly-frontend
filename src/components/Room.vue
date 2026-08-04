<script setup lang="ts">
import { onMounted, ref, computed } from 'vue'
import { get_booth_info } from '../api/get_booths'
import { useRoute, useRouter } from 'vue-router'
import { GameData } from '../data/GameData.ts'
import SessionCard from './SessionCard.vue'

const route = useRoute()
const router = useRouter()
const room = computed(() => route.query.room)
const token = computed(() => route.query.token)

const data = ref(null)
const boothData = ref<any>(null)
const isLoading = ref(true)

onMounted(async () => {
  if (!room.value) {
    router.push({ path: '/', query: { token: token.value } })
    return
  }

  try {
    isLoading.value = true
    const res = await get_booth_info(room.value as string)
    data.value = res
    boothData.value = res

    if (res.session) {
      data.value = res.session
    }
  } catch (err) {
    console.error('Failed to load booth info:', err)
  } finally {
    isLoading.value = false
  }
})
</script>

<template>
  <div class="room-page">
    <div class="room-content" v-if="!isLoading">
      <SessionCard :session="boothData?.session" :name="boothData?.name || (room as string)" />
    </div>

    <div v-else class="loading-state">
      <p>資料載入中...</p>
    </div>
  </div>
</template>

<style scoped>
.room-page {
  width: 100%;
  height: 100%;
  background-color: #fbfaf2;
  padding: 20px;
  box-sizing: border-box;
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  overflow-y: auto;
}

.room-content {
  max-width: 500px;
  margin: 0 auto;
}

.loading-state {
  padding: 40px;
  text-align: center;
  color: #666;
}
</style>
