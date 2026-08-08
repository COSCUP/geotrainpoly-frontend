<script setup lang="ts">
import type Phaser from 'phaser'
import { onMounted, onUnmounted, ref, computed } from 'vue'
import { marked } from 'marked'
import { EventBus } from '../game/EventBus'
import { GameData } from '../data/GameData.ts'
import StartGame from '../game/main'
import { get_hextiles_booth } from '../api/get_hextiles.ts'
import Tutorial from './Tutorial.vue'
import { useRoute, useRouter } from 'vue-router'
import SessionCard from './SessionCard.vue'
import { QrcodeStream } from 'vue-qrcode-reader'

const emit = defineEmits(['current-active-scene'])
// Save the current scene instance
const scene = ref()
const game = ref()
const showPopup = ref(false)
const popupData = ref()
const renderer = new marked.Renderer()
const tutorialRef = ref()
const route = useRoute()
const router = useRouter()
const token = computed(() => route.query.token)
const linkButtons = ref([
  { label: '連結一', url: 'https://coscup-tw.kktix.cc/events/preregist' },
  { label: '連結二', url: 'https://coscup-tw.kktix.cc/events/preregist' },
  { label: '連結三', url: 'https://coscup-tw.kktix.cc/events/preregist' }
])

const showManualInput = ref(false)
const showScanner = ref(false)
const manualToken = ref('')
const tokenError = ref('')
const tokenLoading = ref(false)

async function validateAndSaveToken(inputToken: string) {
  tokenError.value = ''
  tokenLoading.value = true
  try {
    const res = await fetch(`${GameData.apiBaseUrl}/profiles`, {
      method: 'GET',
      headers: {
        'Authorization': `Bearer ${inputToken}`,
        'Content-Type': 'application/json',
      },
    })
    if (!res.ok) {
      tokenError.value = 'Token 無效，請重新輸入 / Invalid token'
      return
    }
    localStorage.setItem('userToken', inputToken)
    router.replace({ query: { ...route.query, token: inputToken } })
  } catch {
    tokenError.value = '網路錯誤，請稍後再試 / Network error'
  } finally {
    tokenLoading.value = false
  }
}

function onSubmitToken() {
  const t = manualToken.value.trim()
  if (!t) return
  validateAndSaveToken(t)
}

function onScanDetect(result: any) {
  const payload = result[0].rawValue
  let scannedToken = payload
  if (payload.startsWith('http')) {
    const url = new URL(payload)
    scannedToken = url.searchParams.get('token') || payload
  }
  showScanner.value = false
  validateAndSaveToken(scannedToken)
}

renderer.link = function ({href, text}) {
  return `<a href="${href}" target="_blank">${text}</a>`
}
marked.setOptions({ renderer })

onMounted(async () => {
  game.value = await StartGame('game-container')

  EventBus.removeAllListeners()

  EventBus.on('current-scene-ready', (sceneInstance: Phaser.Scene) => {
    emit('current-active-scene', sceneInstance)
    scene.value = sceneInstance

    const boothId = route.query.booth as string
    if (boothId) {
      scene.value.addNextHexTile(boothId)
      router.replace({ path: '/', query: { token: token.value } })
    }
  })

  EventBus.on('tile-clicked', async (data:{ type: string, ID: string }) => {
    if (data.type === 'BASE') {
      popupData.value = { booth: { type: 'BASE' } }
    } else {
      popupData.value = await get_hextiles_booth(data.ID)
    }
    showPopup.value = true
  })

  EventBus.on('add-new-hextile', (boothId: string) => {
    scene.value.addNextHexTile(boothId);
  })

  EventBus.on('show-tutorial', () => {
    tutorialRef.value?.startTutorial()
  })
})

onUnmounted(() => {
  if (game.value) {
    game.value.destroy(true)
    game.value = null
  }
})

defineExpose({ scene, game })

function closePopup() {
  showPopup.value = false
  GameData.popupOpen = false
}

function markedIntro(intro: string) {
  const res = computed(() => marked(intro))
  return res.value
}
</script>

<template>
  <div v-if="!token" class="no-token-message" @pointerdown.stop @pointerup.stop @touchstart.stop @touchend.stop @mousedown.stop @mouseup.stop>
      <p>請先完成參與者大調查！</p>
      <a href="https://coscup-tw.kktix.cc/events/preregist" target="_blank" class="survey-button">參與者大調查</a>

      <div class="token-divider">
        <span>或 / OR</span>
      </div>

      <div class="token-entry-buttons">
        <button class="survey-button" @click="showManualInput = true; showScanner = false">手動輸入 Token</button>
        <button class="survey-button" @click="showScanner = true; showManualInput = false">掃描 QR Code</button>
      </div>

      <div v-if="showManualInput" class="token-input-area">
        <input
          v-model="manualToken"
          type="text"
          placeholder="請輸入 Token"
          class="token-input"
          @keyup.enter="onSubmitToken"
        />
        <button class="survey-button token-submit" @click="onSubmitToken" :disabled="tokenLoading">
          {{ tokenLoading ? '驗證中...' : '送出' }}
        </button>
      </div>

      <div v-if="showScanner" class="token-scanner-area">
        <qrcode-stream @detect="onScanDetect"></qrcode-stream>
      </div>

      <p v-if="tokenError" class="token-error">{{ tokenError }}</p>
  </div>
  <Tutorial ref="tutorialRef" v-if="scene" :scene="scene" />
  <div id="game-container" :style="{ bottom: `${GameData.bottomBarHeight}px` }" />
  <div class="popup-overlay" id="popup" v-if="showPopup" @pointerdown.stop @pointerup.stop @touchstart.stop @touchend.stop @mousedown.stop @mouseup.stop>
    <div class="popup-content">
      <button class="popup-close" id="popupClose" @click="closePopup()">x</button>
      <div v-if="popupData.booth.type === 'BASE'">
        <img
          alt="COSCUP x RubyConf Taiwan 2025 banner"
          src="/assets/banner-mobile.webp"
        >
      </div>
      <div v-else-if="popupData.booth.type === 'BOOTHS'" class="Booths">
        <h2>{{ popupData.booth.name }}</h2>
        <img
          :alt="popupData.booth.name" 
          :src="popupData.booth.logo"
        >
        <div class="booths-content" v-html="markedIntro(popupData.booth.description)"></div>
      </div>
      <div v-else-if="popupData.booth.type === 'ROOMS'" class="Venue">
        <h2>{{ popupData.booth.name }}</h2>
        <div class="action-form">
          <SessionCard :session="popupData.session" />
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
#game-container {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  z-index: 0;
}

.popup-overlay {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  backdrop-filter: blur(4px);
  background-color: rgba(0, 0, 0, 0.3);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 999;
}

.popup-content {
  width: 90%;
  position: relative;
  background-color: white;
  color: black;
  border-radius: 16px;
  padding: 12px;
  box-shadow: 0 12px 24px rgba(0, 0, 0, 0.2);
  max-width: 90%;
  text-align: center;
}

.popup-close {
  position: absolute;
  top: -12px;
  right: -12px;
  width: 32px;
  height: 32px;
  border: none;
  border-radius: 50%;
  background-color: #ff5f5f;
  color: white;
  font-size: 20px;
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.2);
}

img {
  width: 100%;
}

.Booths {
  text-align: left;
}

.booths-content {
  max-height: 40vh;
  overflow-y: auto;
  padding-right: 4px;
}

.booths-content p {
  line-height: 1.6;
  margin-bottom: 12px;
}

.booths-content a {
  color: #007bff;
  text-decoration: underline;
  word-break: break-word;
}

.Venue h2 {
  text-align: left;
  max-height: 50vh;
  overflow-y: auto;
}

.action-form {
  display: flex;
  justify-content: center;
  gap: 12px;
  align-items: center;
  margin-top: 16px;
  flex-wrap: wrap;
}

.action-btn {
  flex: 1;
  min-width: 100px;
  padding: 10px 16px;
  background-color: #c48add;
  color: white;
  font-weight: bold;
  text-decoration: none;
  border-radius: 6px;
  text-align: center;
  transition: background-color 0.2s ease, transform 0.1s ease;
  display: inline-block;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
}

.action-btn:active {
  transform: scale(0.98);
}

.no-token-message {
  position: absolute;
  width: 100%;
  height: 100%;
  background-color: #111;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  z-index: 101;
  color: white;
  text-align: center;
}

.no-token-message p {
  font-size: 1.2em;
  margin-bottom: 20px;
}

.no-token-message a {
  color: white;
  text-decoration: underline;
  font-size: 1.1em;
}

.survey-button {
  background-color: gray;
  color: white;
  border: none;
  padding: 10px 25px;
  border-radius: 20px;
  cursor: pointer;
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.2);
  transition: background-color 0.3s ease;
  display: inline-block;
  text-decoration: none;
  font-size: 1em;
  gap: 5px;
  -webkit-tap-highlight-color: transparent;
}

.token-divider {
  margin: 24px 0 16px;
  color: #aaa;
  font-size: 0.9em;
}

.token-entry-buttons {
  display: flex;
  gap: 12px;
  margin-bottom: 16px;
}

.token-input-area {
  display: flex;
  gap: 8px;
  align-items: center;
  width: 80%;
  max-width: 400px;
}

.token-input {
  flex: 1;
  padding: 10px 14px;
  border: 2px solid #555;
  border-radius: 20px;
  background: #222;
  color: white;
  font-size: 1em;
  outline: none;
}

.token-input:focus {
  border-color: #aaa;
}

.token-submit {
  white-space: nowrap;
}

.token-submit:disabled {
  opacity: 0.5;
  cursor: not-allowed;
}

.token-scanner-area {
  width: 80%;
  max-width: 300px;
  aspect-ratio: 1;
  border-radius: 12px;
  overflow: hidden;
  border: 3px solid #f30000;
}

.token-error {
  color: #ff5f5f;
  margin-top: 12px;
  font-size: 0.9em;
}
</style>
