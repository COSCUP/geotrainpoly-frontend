<script setup lang="ts">
import { computed, provide, ref } from 'vue';
import { useRouter, useRoute } from 'vue-router'
import { Icon } from '@iconify/vue'
import './style.css'

const router = useRouter()
const route = useRoute()

const token = computed(() => route.query.token)

const goToBoothsList = () => {
  router.push({ path: '/booths', query: { token: token.value } })
}

const showMyQrCode = () => {
  router.push({path: '/my-qrcode',query: { token: token.value } })
}

const goToProfile = () => {
  router.push({ path: '/profile', query: { token: token.value } })
}

const goToGameScene = () => {
  router.push({ path: '/', query: { token: token.value } })
}

const showLogoutConfirm = ref(false)

function confirmLogout() {
  localStorage.removeItem('userToken')
  showLogoutConfirm.value = false
  router.replace({ path: '/', query: {} })
}

provide('token', token)
</script>

<template>
  <router-view />

  <button v-if="token" class="logout-button" @click="showLogoutConfirm = true">
    <Icon icon="tabler:logout" class="logout-icon" />
  </button>

  <div v-if="showLogoutConfirm" class="logout-overlay" @click.self="showLogoutConfirm = false" @pointerdown.stop @pointerup.stop @touchstart.stop @touchend.stop @mousedown.stop @mouseup.stop>
    <div class="logout-dialog">
      <p>確定要登出嗎？</p>
      <p class="logout-sub">Are you sure you want to logout?</p>
      <div class="logout-actions">
        <button class="logout-cancel" @click="showLogoutConfirm = false">取消</button>
        <button class="logout-confirm" @click="confirmLogout">登出</button>
      </div>
    </div>
  </div>

  <div class="bottom-bar">
    <button class="button button-booths" @click="goToBoothsList">
       <Icon icon="tabler:building-store" class="icon" />
      <span>攤位列表</span>
    </button>

    <button class="button button-game" v-if="route.name !== 'game'" @click="goToGameScene">
       <Icon icon="ph:game-controller" class="icon" />
      <span>遊戲畫面</span>
    </button>

    <button class="button button-qrcode"  v-else @click="showMyQrCode">
      <Icon icon="tabler:qrcode" class="icon"></Icon>
      <span>顯示 QR Code</span>
    </button>

    <button class="button button-profile" @click="goToProfile">
       <Icon icon="mdi:user-circle-outline" class="icon" />
      <span>個人頁面</span>
    </button>
  </div>
</template>

<style scoped>
.bottom-bar {
  position: fixed;
  display: flex;
  bottom: 0;
  height: 70px;
  width: 100%;
  justify-content: space-around;
  align-items: center;
  background-color: #e0ecff;
  z-index: 100;
  box-shadow: 0 -2px 8px rgba(0, 0, 0, 0.2);
}

.button {
  flex: 1;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 5px;
  background: transparent;
  border: none;
  outline: none;
  font-size: 14px;
  font-weight: 600;
  color: #333;
  margin: 0;
  padding: 0;
  transition: transform 0.2s ease-in-out, color 0.2s ease-in-out;
}

.button-game,
.button-qrcode {
  transform: translateY(-10px);
}

.button-booths:hover,
.button-profile:hover {
  transform: translateY(-2px);
  color: #007bff;
}

.button-game:hover span,
.button-qrcode:hover span {
  color: #007bff;
}

.button .icon {
  width: 32px;
  height: 32px;
  border-radius: 8px;
  object-fit: contain;
}

.button-game .icon,
.button-qrcode .icon {
  width: 43px;
  height: 43px;
  background-color: #f9d33a; /* #E08C99 深粉色 #9A82B0 深紫色 #B9E3F5 淺藍色 */
  border-radius: 50%;
  padding: 5px;
  box-shadow: 0 3px 6px rgba(0, 0, 0, 0.2);
}

.logout-button {
  position: fixed;
  top: 10px;
  left: 10px;
  z-index: 100;
  background: rgba(0, 0, 0, 0.5);
  border: none;
  border-radius: 50%;
  width: 36px;
  height: 36px;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  -webkit-tap-highlight-color: transparent;
}

.logout-icon {
  width: 20px;
  height: 20px;
  color: white;
}

.logout-overlay {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background-color: rgba(0, 0, 0, 0.4);
  backdrop-filter: blur(4px);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 9999;
}

.logout-dialog {
  background: white;
  border-radius: 16px;
  padding: 24px 28px;
  text-align: center;
  box-shadow: 0 12px 24px rgba(0, 0, 0, 0.2);
}

.logout-dialog p {
  margin: 0;
  font-size: 1.1em;
  font-weight: bold;
  color: #333;
}

.logout-sub {
  font-size: 0.9em !important;
  font-weight: normal !important;
  color: #888 !important;
  margin-top: 4px !important;
}

.logout-actions {
  display: flex;
  gap: 12px;
  margin-top: 20px;
  justify-content: center;
}

.logout-cancel,
.logout-confirm {
  padding: 8px 24px;
  border: none;
  border-radius: 20px;
  font-size: 1em;
  cursor: pointer;
}

.logout-cancel {
  background: #eee;
  color: #333;
}

.logout-confirm {
  background: #ff5f5f;
  color: white;
}
</style>
