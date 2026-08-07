<script setup lang="ts">
import { ref, computed, onMounted } from 'vue'
import { useRouter, useRoute } from 'vue-router'
import { Icon } from '@iconify/vue'
import { getUserProfile } from '../api/get_profiles'
import { read_ad, redeem_coffee } from '../api/lottery'

const router = useRouter()
const route = useRoute()

type CoffeeInfo = {
  win: boolean | null
  reward: boolean
}

type PlayerProfile = {
  avatar: string
  nickname: string
  points: number
  reward: boolean
  coffee: CoffeeInfo | null
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
  points: 0,
  reward: false,
  coffee: null
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
      player.value.reward = user.reward ?? false
      player.value.coffee = user.coffee ?? null
    }
  } catch (err) {
    console.error('Failed to load user profile:', err)
  }

  if (route.query.coffee) {
    showAdModal.value = true
    adClicked.value = false
    router.replace({ path: '/profile', query: { token: route.query.token } })
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

const discountAmount = computed(() => player.value.points)

const showAdModal = ref(false)
const adClicked = ref(false)

const LOTTERY_START = new Date('2026-08-08T09:00:00+08:00')
const LOTTERY_END = new Date('2026-08-09T17:00:00+08:00')

const lotteryStatus = computed(() => {
  const now = new Date()
  if (now < LOTTERY_START) return 'before'
  if (now > LOTTERY_END) return 'after'
  return 'active'
})

const goToLottery = () => {
  showAdModal.value = true
  adClicked.value = false
}

const onAdLinkClick = () => {
  read_ad()
  adClicked.value = true
}

const closeAdModal = () => {
  showAdModal.value = false
}

const proceedToLottery = () => {
  showAdModal.value = false
  router.push({ path: '/lottery', query: { token: route.query.token } })
}

const showCoffeeModal = ref(false)

const openCoffeeModal = () => {
  if (player.value.coffee?.reward) return
  showCoffeeModal.value = true
}

const closeCoffeeModal = () => {
  showCoffeeModal.value = false
}

const confirmRedeem = async () => {
  try {
    await redeem_coffee()
    if (player.value.coffee) {
      player.value.coffee.reward = true
    }
    showCoffeeModal.value = false
  } catch (err) {
    console.error('Redeem failed:', err)
  }
}

const goToQRCode = () => {
  router.push({ path: '/my-qrcode', query: { token: route.query.token } })
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

    <div class="coupon-section">
      <h3 class="coupon-title">票卷清單</h3>
      <div class="coupon-card" :class="{ 'coupon-redeemed': player.reward }" @click="goToQRCode">
        <div class="coupon-left">
          <div class="coupon-discount">NTD {{ discountAmount }}</div>
          <div class="coupon-off">OFF</div>
        </div>
        <div class="coupon-right">
          <div class="coupon-name">紀念品折價卷</div>
          <div class="coupon-desc-en">Souvenir Discount Coupon</div>
          <div v-if="player.reward" class="coupon-redeemed-badge">已兌換 Redeemed</div>
        </div>
      </div>
      <div v-if="player.coffee?.win === true" class="coupon-card coupon-coffee" :class="{ 'coupon-redeemed': player.coffee.reward }" @click="openCoffeeModal">
        <div class="coupon-left coupon-left-coffee">
          <div class="coupon-discount">FREE</div>
        </div>
        <div class="coupon-right">
          <div class="coupon-name">實體咖啡卷兌換</div>
          <div class="coupon-desc-en">Coffee Coupon Redemption</div>
          <div class="coupon-desc">前往 TR 1F 兌換 Redeem at TR 1F booth</div>
          <div v-if="player.coffee.reward" class="coupon-redeemed-badge">已兌換 Redeemed</div>
        </div>
      </div>
      <div v-if="player.coffee === null && lotteryStatus === 'before'" class="lottery-cta" @click="goToLottery">
        🎰 抽獎尚未開放 Lottery not yet available
      </div>
      <div v-if="player.coffee === null && lotteryStatus === 'active'" class="lottery-cta" @click="goToLottery">
        🎰 點我抽咖啡卷！Try your luck for a free coffee!
      </div>
      <div v-if="player.coffee !== null && player.coffee.win === null && lotteryStatus === 'before'" class="lottery-cta" @click="goToLottery">
        🎰 抽獎尚未開放 Lottery not yet available
      </div>
      <div v-if="player.coffee !== null && player.coffee.win === null && lotteryStatus === 'active'" class="lottery-cta" @click="goToLottery">
        🎰 點我抽咖啡卷！Try your luck for a free coffee!
      </div>
      <div v-if="player.coffee !== null && player.coffee.win !== null" class="ad-banner" @click="goToLottery">
        📢 Grafana & Friends Taipei — Join us!
      </div>
    </div>

    <div v-if="showCoffeeModal" class="avatar-modal-overlay" @click.self="closeCoffeeModal">
      <div class="avatar-modal-content coffee-modal">
        <button class="popup-close" @click="closeCoffeeModal">x</button>
        <h3>☕ 咖啡兌換 Coffee Redemption</h3>
        <div class="coffee-warning">
          ⚠️ 請在工作人員指示下操作<br>
          Please operate under staff guidance
        </div>
        <p class="coffee-modal-desc">
          點擊下方按鈕完成兌換，兌換後無法復原。<br>
          Press the button below to redeem. This action cannot be undone.
        </p>
        <button class="coffee-redeem-btn" @click="confirmRedeem">兌換 Redeem</button>
      </div>
    </div>

    <div v-if="showAdModal" class="avatar-modal-overlay" @click.self="closeAdModal">
      <div class="avatar-modal-content ad-modal">
        <button class="popup-close" @click="closeAdModal">x</button>
        <h3>Grafana & Friends Taipei</h3>
        <p class="ad-text">
          This Grafana & Friends meetup group hosts events focused on open source monitoring and observability using Grafana and related technologies. Some meetups feature formal presentations, while others are more relaxed and discussion-driven. Every event is designed to encourage learning, connection, and community. Snacks and stickers included!
        </p>
        <a
          v-if="lotteryStatus === 'after'"
          href="https://www.facebook.com/groups/25864461313213600/"
          target="_blank"
          rel="noopener noreferrer"
          class="ad-link-btn ad-link-fb"
          @click="onAdLinkClick"
        >
          <Icon icon="mdi:facebook" class="fb-icon" /> Grafana & Friends Taipei
        </a>
        <a
          href="https://www.meetup.com/grafana-friends-taipei/?src=event&camp=coscup-2026"
          target="_blank"
          rel="noopener noreferrer"
          class="ad-link-btn"
          @click="onAdLinkClick"
        >
          Join Meetup ↗
        </a>
        <div v-if="lotteryStatus === 'before'" class="lottery-not-open">抽獎尚未開放 Lottery not yet available</div>
        <button v-else-if="player.coffee === null" class="modal-confirm-button" :class="{ 'btn-disabled': !adClicked }" :disabled="!adClicked" @click="proceedToLottery">開始抽獎 Start Lottery</button>
        <button v-else-if="player.coffee?.win === null" class="modal-confirm-button" @click="proceedToLottery">開始抽獎 Start Lottery</button>
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

.coupon-section {
  width: 100%;
  max-width: 400px;
  flex-shrink: 0;
}

.coupon-title {
  font-size: 18px;
  font-family: 'Zen Maru Gothic', sans-serif;
  font-weight: bold;
  color: #333;
  margin: 0 0 12px 0;
}

.coupon-card {
  display: flex;
  border-radius: 12px;
  overflow: hidden;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
  background-color: #fff;
  cursor: pointer;
}

.coupon-left {
  background-color: #E8707E;
  color: white;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 20px 16px;
  min-width: 100px;
  border-right: 2px dashed #fbfaf2;
}

.coupon-discount {
  font-size: 20px;
  font-family: 'M PLUS Rounded 1c', sans-serif;
  font-weight: bold;
  white-space: nowrap;
}

.coupon-off {
  font-size: 20px;
  font-family: 'M PLUS Rounded 1c', sans-serif;
  font-weight: bold;
  margin-top: 2px;
}

.coupon-right {
  flex: 1;
  padding: 16px 20px;
  display: flex;
  flex-direction: column;
  justify-content: center;
}

.coupon-name {
  font-size: 16px;
  font-family: 'Zen Maru Gothic', sans-serif;
  font-weight: bold;
  color: #333;
  margin-bottom: 4px;
}

.coupon-desc {
  font-size: 13px;
  font-family: 'Zen Maru Gothic', sans-serif;
  color: #888;
}

.coupon-desc-en {
  font-size: 12px;
  font-family: 'M PLUS Rounded 1c', sans-serif;
  color: #aaa;
  margin-top: 2px;
}

.coupon-redeemed {
  opacity: 0.6;
}

.coupon-redeemed .coupon-left {
  background-color: #bbb;
}

.coupon-coffee {
  margin-top: 10px;
}

.coupon-left-coffee {
  background-color: #6B4226;
}

.coffee-modal {
  text-align: center;
}

.coffee-warning {
  background-color: #fff3cd;
  border: 2px solid #ffc107;
  border-radius: 10px;
  padding: 14px;
  font-size: 16px;
  font-family: 'Zen Maru Gothic', sans-serif;
  font-weight: bold;
  color: #856404;
  margin: 12px 0;
  line-height: 1.6;
}

.coffee-modal-desc {
  font-size: 14px;
  font-family: 'M PLUS Rounded 1c', sans-serif;
  color: #666;
  line-height: 1.6;
  margin: 12px 0 16px;
}

.coffee-redeem-btn {
  background-color: #6B4226;
  color: white;
  border: none;
  padding: 12px 30px;
  border-radius: 20px;
  cursor: pointer;
  font-size: 18px;
  font-family: 'Zen Maru Gothic', sans-serif;
  font-weight: bold;
}

.ad-modal {
  text-align: left;
}

.ad-text {
  font-size: 14px;
  font-family: 'M PLUS Rounded 1c', sans-serif;
  color: #444;
  line-height: 1.6;
  margin: 12px 0 16px;
}

.ad-link-btn {
  display: block;
  text-align: center;
  background-color: #F05A28;
  color: white;
  text-decoration: none;
  font-weight: bold;
  font-size: 15px;
  font-family: 'Zen Maru Gothic', sans-serif;
  padding: 10px 20px;
  border-radius: 20px;
  margin-bottom: 12px;
}

.ad-link-fb {
  background-color: #1877F2;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 6px;
}

.fb-icon {
  font-size: 22px;
  vertical-align: middle;
}

.lottery-cta {
  margin-top: 14px;
  padding: 14px;
  text-align: center;
  font-size: 16px;
  font-family: 'Zen Maru Gothic', sans-serif;
  font-weight: bold;
  color: #fff;
  background: linear-gradient(135deg, #f7971e, #ffd200);
  border-radius: 12px;
  cursor: pointer;
  box-shadow: 0 3px 8px rgba(247, 151, 30, 0.4);
  animation: lottery-pulse 2s ease-in-out infinite;
}

.ad-banner {
  margin-top: 14px;
  padding: 12px;
  text-align: center;
  font-size: 14px;
  font-family: 'Zen Maru Gothic', sans-serif;
  font-weight: bold;
  color: #5b2873;
  background-color: #f4e8fb;
  border: 2px solid #c48add;
  border-radius: 12px;
  cursor: pointer;
}

.lottery-not-open {
  text-align: center;
  font-size: 14px;
  font-family: 'Zen Maru Gothic', sans-serif;
  font-weight: bold;
  color: #999;
  padding: 10px;
}

@keyframes lottery-pulse {
  0%, 100% { transform: scale(1); }
  50% { transform: scale(1.03); }
}

.coupon-redeemed-badge {
  font-size: 12px;
  font-family: 'Zen Maru Gothic', sans-serif;
  font-weight: bold;
  color: #ff5f5f;
  margin-top: 4px;
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
  background-color: #E8707E;
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

.modal-confirm-button.btn-disabled {
  background-color: #ccc;
  color: #999;
  cursor: not-allowed;
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
