<script setup lang="ts">
import { onMounted, computed } from 'vue'
import { useRouter, useRoute } from 'vue-router'
import { useI18n } from 'vue-i18n'

const { t } = useI18n()

const router = useRouter()
const route = useRoute()
const token = computed(() => route.query.token)

onMounted(() => {
  if (token.value) {
    router.replace({ path: '/profile', query: { token: token.value, coffee: '1' } })
  }
})
</script>

<template>
  <div class="coffee-landing">
    <div class="landing-card">
      <div class="landing-icon">☕</div>
      <h2>{{ t('coffee.title') }}</h2>
      <p class="landing-desc">
        {{ t('coffee.notLoggedIn') }}<br>
        {{ t('coffee.notLoggedInEn') }}
      </p>
      <div class="landing-hint">
        {{ t('coffee.useOPass') }}<br>
        {{ t('coffee.useOPassEn') }}
      </div>
    </div>
  </div>
</template>

<style scoped>
.coffee-landing {
  width: 100%;
  height: 100%;
  background-color: #fbfaf2;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 20px;
  box-sizing: border-box;
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
}

.landing-card {
  text-align: center;
  max-width: 400px;
  width: 100%;
}

.landing-icon {
  font-size: 60px;
  margin-bottom: 16px;
}

.landing-card h2 {
  font-size: 22px;
  font-family: 'Zen Maru Gothic', sans-serif;
  font-weight: bold;
  color: #333;
  margin-bottom: 16px;
}

.landing-desc {
  font-size: 16px;
  font-family: 'M PLUS Rounded 1c', sans-serif;
  color: #666;
  line-height: 1.6;
  margin-bottom: 20px;
}

.landing-hint {
  background-color: #fff3cd;
  border: 2px solid #ffc107;
  border-radius: 12px;
  padding: 16px;
  font-size: 15px;
  font-family: 'Zen Maru Gothic', sans-serif;
  font-weight: bold;
  color: #856404;
  line-height: 1.6;
}
</style>
