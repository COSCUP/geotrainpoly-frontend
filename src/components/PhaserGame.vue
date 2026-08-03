<script setup lang="ts">
import type Phaser from 'phaser'
import { onMounted, onUnmounted, ref, watch, computed } from 'vue'
import { marked } from 'marked'
import { EventBus } from '../game/EventBus'
import { GameData } from '../data/GameData.ts'
import StartGame from '../game/main'
import { get_hextiles_booth } from '../api/get_hextiles.ts'
import Tutorial from './Tutorial.vue'
import { useRoute } from 'vue-router'

const emit = defineEmits(['current-active-scene'])
// Save the current scene instance
const scene = ref()
const game = ref()
const showPopup = ref(false)
const popupData = ref()
const comments = ref()
const newMessage = ref('')
const renderer = new marked.Renderer()
const tutorialRef = ref()
const route = useRoute()
const token = computed(() => route.query.token)
renderer.link = function ({href, title, text}) {
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
  comments.value = []
}

function formatTime(iso: string, timeZone: string = 'Asia/Taipei') {
  const date = new Date(iso + 'Z')
  const formatter = new Intl.DateTimeFormat('zh-TW', {
    timeZone,
    month: '2-digit',
    day: '2-digit',
    hour: '2-digit',
    minute: '2-digit',
    hourCycle: 'h23',
  })
  return formatter.format(date)
}

async function addComment(booth_name: string, booth_id: string) {
  try {
    await post_msg(booth_id, newMessage.value)
    newMessage.value = ''

    const data = await get_hextiles_booth(booth_name)
    if (data && data.msg) {
      comments.value = data.msg
    } else {
      console.warn('No messages found in response:', data)
    }
  } catch (error) {
    console.error('Error posting message or fetching comments:', error)
  }
}

function markedIntro(intro: string) {
  const res = computed(() => marked(intro))
  return res.value
}

const isButtonDisabled = computed(() => {
  return newMessage.value.trim() === ''
})

watch([showPopup, popupData], async ([isOpen, data]) => {
  if (isOpen && data.booth.type === 'ROOMS') {
    const booth_data = await get_hextiles_booth(data.booth.name)
    if (booth_data && booth_data.msg) {
      comments.value = data.msg
    } else {
      console.warn('No messages found in response:', data)
    }
  }
})
</script>

<template>
  <div v-if="!token" class="no-token-message">
      <p>尚未登入，請先填寫參與者大調查</p>
      <a href="https://coscup.org/2025-survey/" target="_blank" class="survey-button">點此前往問卷</a>
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
        <div class="comment-list">
        </div>
        <div class="comment-form">
          <button @click="addComment(popupData.booth.name, popupData.booth.booth_id)" :disabled="isButtonDisabled">送出留言</button>
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

.comment-list {
  max-height: 60vh;
  overflow-y: auto;
}

.comment-content {
  flex: 17;
}

.comment-item {
  border-bottom: 1px solid black;
  padding: 12px 8px;
  display: flex;
  justify-content: space-between;
  gap: 8px;
  align-items: center;
}

.comment-header {
  display: flex;
  justify-content: space-between;
  font-size: 14px;
  margin-bottom: 4px;
  color: #333;
}

.comment-user {
  font-weight: bold;
  text-align: left;
}

.comment-message {
  margin: 0;
  text-align: left;
}

.comment-form {
  display: flex;
  flex-direction: column;
  gap: 8px;
}

.comment-form textarea {
  margin-top: 12px;
  padding: 8px 12px;
  border: 1px solid #ccc;
  border-radius: 6px;
  font-size: 14px;
}

.comment-form button {
  align-self: flex-end;
  padding: 8px 16px;
  background-color: rgb(182, 105, 214);
  color: white;
  font-weight: bold;
  border: none;
  border-radius: 6px;
}

.comment-form button:disabled {
  background-color: #aaa;
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
  color: white;;
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
