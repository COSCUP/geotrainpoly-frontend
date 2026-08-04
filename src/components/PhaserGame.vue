<script setup lang="ts">
import type Phaser from 'phaser'
import { onMounted, onUnmounted, ref, computed } from 'vue'
import { marked } from 'marked'
import { EventBus } from '../game/EventBus'
import { GameData } from '../data/GameData.ts'
import StartGame from '../game/main'
import { get_hextiles_booth } from '../api/get_hextiles.ts'
import Tutorial from './Tutorial.vue'
import { useRoute } from 'vue-router'
import SessionCard from './SessionCard.vue'

const emit = defineEmits(['current-active-scene'])
// Save the current scene instance
const scene = ref()
const game = ref()
const showPopup = ref(false)
const popupData = ref()
const renderer = new marked.Renderer()
const tutorialRef = ref()
const route = useRoute()
const token = computed(() => route.query.token)
const linkButtons = ref([
  { label: '連結一', url: 'https://coscup-tw.kktix.cc/events/preregist' },
  { label: '連結二', url: 'https://coscup-tw.kktix.cc/events/preregist' },
  { label: '連結三', url: 'https://coscup-tw.kktix.cc/events/preregist' }
])

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
  <div v-if="!token" class="no-token-message">
      <p>請先去推倒售票亭！</p>
      <a href="https://coscup-tw.kktix.cc/events/preregist" target="_blank" class="survey-button">點此前往</a>
  </div>
  <Tutorial ref="tutorialRef" v-if="scene" :scene="scene" />
  <div id="game-container" :style="{ bottom: `${GameData.bottomBarHeight}px` }" />
  <div class="popup-overlay" id="popup" v-if="showPopup">
    <div class="popup-content">
      <button class="popup-close" id="popupClose" @click="closePopup()">x</button>
      <div v-if="popupData.booth.type === 'BASE'">
        <img
          alt="COSCUP x RubyConf Taiwan 2025 banner"
          src="/assets/banner-mobile.png"
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
  width: 80%;
  position: relative;
  background-color: white;
  color: black;
  border-radius: 16px;
  padding: 24px;
  box-shadow: 0 12px 24px rgba(0, 0, 0, 0.2);
  max-width: 70%;
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
</style>
