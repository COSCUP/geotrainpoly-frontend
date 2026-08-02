<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { Icon } from '@iconify/vue'
import { getUserProfile } from '../api/get_profiles'

type PlayerProfile = {
  avatar: string
  nickname: string
  points: number
}

const avatarMap = {
  '/assets/人類小啄頭像1.png': '/assets/人類小啄1.png',
  '/assets/人類小啄頭像2.png': '/assets/人類小啄2.png',
  '/assets/人類小啄頭像3.png': '/assets/人類小啄3.png'
}
const avatarList = Object.keys(avatarMap)
const player = ref<PlayerProfile>({
  avatar: avatarList[0],
  nickname: '',
  points: 0
})

onMounted(async () => {
  const savedAvatar = localStorage.getItem('playerAvatar')
  if (savedAvatar) {
    player.value.avatar = savedAvatar
  } else {
    player.value.avatar = avatarList[0]
  }

  try {
    const user = await getUserProfile()
    if (user) {
      player.value.nickname = user.name
      player.value.points = user.points
    }
  } catch (err) {
    console.error('Failed to load user profile:', err)
  }
})

const showAvatarModal = ref(false)
const selectedAvatar = ref<string | null>(null)

const openAvatarModal = () => {
  showAvatarModal.value = true
  selectedAvatar.value = player.value.avatar
}
const selectAvatar = (path: string) => {
  selectedAvatar.value = path
}
const confirmAvatar = () => {
  if (selectedAvatar.value) {
    player.value.avatar = selectedAvatar.value
    localStorage.setItem('playerAvatar', selectedAvatar.value)

    const characterPath = (avatarMap as Record<string, string>)[selectedAvatar.value]
    if (characterPath) {
      localStorage.setItem('playerCharacter', characterPath)
    }
  }
  closeAvatarModal()
}
const closeAvatarModal = () => {
  showAvatarModal.value = false
  selectedAvatar.value = null
}
</script>

<template>
  <div id="myProfile">
    <div class="avatar-section">
      <div class="avatar-container">
        <img :src="player.avatar" alt="Player Avatar" class="avatar-image" @click="openAvatarModal">
        <button class="edit-avatar-button" @click="openAvatarModal">
          <Icon icon="material-symbols:edit-outline" />
        </button>
      </div>
    </div>

    <div class="info-section">
      <div class="display-score">{{ player.points }} 分</div>
      <div class="nickname-container">
        <span class="display-nickname">{{ player.nickname }}</span>
      </div>
    </div>

    <div v-if="showAvatarModal" class="avatar-modal-overlay" @click.self="closeAvatarModal">
      <div class="avatar-modal-content">
        <button class="popup-close" @click="closeAvatarModal">x</button>
        <h3>選擇喜歡的頭像</h3>
        <div class="avatar-options">
          <div
            v-for="(avatarPath, index) in avatarList"
            :key="index"
            class="avatar-option"
            :class="{ 'selected': selectedAvatar === avatarPath }"
            @click="selectAvatar(avatarPath)"
          >
            <img :src="avatarPath" alt="Avatar Option" class="avatar-option-image">
          </div>
        </div>
        <button class="modal-confirm-button" @click="confirmAvatar">確定</button>
      </div>
    </div>
  </div>
</template>

<style scoped>
#myProfile {
  width: 100%;
  height: 100%;
  background-color: #fbfaf2;
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: 35px 20px 20px 20px;
  box-sizing: border-box;
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  z-index: 0;
}

.avatar-section {
  position: relative;
  display: flex;
  flex-direction: column;
  align-items: center;
  margin-bottom: 5px;
  flex-shrink: 0;
}

.avatar-container {
  width: 150px;
  height: 150px;
  border-radius: 50%;
  background-color: #e0e6ec;
  display: flex;
  justify-content: center;
  align-items: center;
  overflow: hidden;
  border: 4px solid #fff;
  box-shadow: 0 0 0 2px #c9d2da;
}

.edit-avatar-button {
  position: absolute;
  bottom: 5px;
  right: calc(50% - 70px);
  width: 30px;
  height: 30px;
  background-color: white;
  border-radius: 50%;
  border: 1px solid #ddd;
  display: flex;
  justify-content: center;
  align-items: center;
  cursor: pointer;
  padding: 0;
  font-size: 20px;
  color: #555;
  box-shadow: 0 1px 3px rgba(0,0,0,0.1);
  outline: none;
  -webkit-tap-highlight-color: transparent;
  user-select: none;
  z-index: 10;
}

.edit-avatar-button:hover {
  background-color: #f5f5f5;
}

.edit-avatar-button:active {
  background-color: white;
}

.avatar-image {
  width: 100%;
  height: 100%;
  object-fit: cover;
  border-radius: 50%;
}

.info-section {
  width: 100%;
  display: flex;
  flex-direction: column;
  gap: 10px;
  margin-bottom: 20px;
  flex-shrink: 0;
}

.display-score {
  font-size: 20px;
  font-family: 'M PLUS Rounded 1c', sans-serif;
  font-weight: bold;
  color: #4a4a4a;
  text-align: center;
  width: 100%;
}

.nickname-container {
  display: flex;
  justify-content: center;
  align-items: center;
  height: 25px;
}

.display-nickname {
  font-size: 20px;
  font-family: 'M PLUS Rounded 1c', sans-serif;
  font-weight: bold;
  color: #333;
}

.avatar-modal-overlay {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background-color: rgba(0, 0, 0, 0.5);
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 1000;
  overflow-y: auto;
}

.avatar-modal-content {
  position: relative;
  background-color: #fff;
  padding: 30px;
  border-radius: 10px;
  box-shadow: 0 4px 15px rgba(0, 0, 0, 0.2);
  text-align: center;
  width: 90%;
  max-width: 400px;
  box-sizing: border-box;
  padding: 20px;
}

.avatar-modal-content h3 {
  font-size: 22px;
  font-family: 'Zen Maru Gothic', sans-serif;
  font-weight: bold;
  color: #333;
  margin: 10px 0px;
}

.avatar-options {
  display: flex;
  flex-wrap: wrap;
  justify-content: center;
  gap: 20px;
  margin-bottom: 30px;
}

.avatar-option {
  width: 80px;
  height: 80px;
  border-radius: 50%;
  overflow: hidden;
  border: 3px solid transparent;
  cursor: pointer;
  transition: all 0.2s ease-in-out;
  box-shadow: 0 2px 5px rgba(0, 0, 0, 0.1);
  outline: none;
  -webkit-tap-highlight-color: transparent;
  user-select: none;
}

.avatar-option:hover {
  transform: translateY(-3px);
  box-shadow: 0 5px 15px rgba(0, 0, 0, 0.15);
}

.avatar-option.selected {
  border-color: #F8C0C8; 
  box-shadow: 0 0 0 3px #F8C0C8, 0 4px 10px rgba(0, 0, 0, 0.15);
}

.avatar-option:active {
  background-color: transparent;
}

.avatar-option-image {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.modal-confirm-button {
  background-color: #F8C0C8;
  color: white;
  border: none;
  padding: 10px 25px;
  border-radius: 20px;
  cursor: pointer;
  font-size: 16px;
  font-family: 'Zen Maru Gothic', sans-serif;
  transition: background-color 0.2s ease;
  outline: none;
  -webkit-tap-highlight-color: transparent;
  user-select: none;
}

.modal-confirm-button:active {
  background-color: #aaa;
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
  cursor: pointer;
  outline: none;
  -webkit-tap-highlight-color: transparent;
  user-select: none;
}

.popup-close:active {
  background-color: #ff5f5f;
}
</style>
