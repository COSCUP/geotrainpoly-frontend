<script setup lang="ts">
import { ref, onMounted, computed } from 'vue'
import { useRouter, useRoute } from 'vue-router'
import { get_lottery } from '../api/lottery'

const router = useRouter()
const route = useRoute()

const segments = [
  { label: '☕', color: '#6B4226' },
  { label: '✨', color: '#c48add' },
  { label: '☕', color: '#E8707E' },
  { label: '🌟', color: '#f7971e' },
  { label: '☕', color: '#6B4226' },
  { label: '💫', color: '#5b9bd5' },
  { label: '☕', color: '#E8707E' },
  { label: '🎯', color: '#2ecc71' },
]

const segmentCount = segments.length
const segmentAngle = 360 / segmentCount

const spinning = ref(false)
const finished = ref(false)
const rotation = ref(0)
const result = ref<{ win: boolean } | null>(null)

const wheelStyle = computed(() => ({
  transform: `rotate(${rotation.value}deg)`,
  transition: spinning.value ? 'transform 5s cubic-bezier(0.17, 0.67, 0.12, 0.99)' : 'none',
}))

function getSegmentPath(index: number): string {
  const cx = 150, cy = 150, r = 140
  const angle = segmentAngle
  const startAngle = (index * angle - 90) * (Math.PI / 180)
  const endAngle = ((index + 1) * angle - 90) * (Math.PI / 180)

  const x1 = cx + r * Math.cos(startAngle)
  const y1 = cy + r * Math.sin(startAngle)
  const x2 = cx + r * Math.cos(endAngle)
  const y2 = cy + r * Math.sin(endAngle)

  const largeArc = angle > 180 ? 1 : 0

  return `M${cx},${cy} L${x1},${y1} A${r},${r} 0 ${largeArc} 1 ${x2},${y2} Z`
}

function getTextTransform(index: number): string {
  const cx = 150, cy = 150, r = 90
  const angle = segmentAngle
  const midAngle = (index * angle + angle / 2 - 90) * (Math.PI / 180)

  const x = cx + r * Math.cos(midAngle)
  const y = cy + r * Math.sin(midAngle)
  const rotDeg = index * angle + angle / 2

  return `translate(${x}, ${y}) rotate(${rotDeg})`
}

onMounted(async () => {
  await startSpin()
})

async function startSpin() {
  if (spinning.value) return

  try {
    const res = await get_lottery()
    result.value = res

    const winIndices = [0, 2, 4, 6]
    const loseIndices = [1, 3, 5, 7]
    const candidates = res.win ? winIndices : loseIndices
    const pickedIndex = candidates[Math.floor(Math.random() * candidates.length)]
    const targetAngle = segmentAngle * pickedIndex + segmentAngle / 2

    const extraSpins = 360 * (5 + Math.floor(Math.random() * 3))
    const finalRotation = extraSpins + (360 - targetAngle)

    spinning.value = true
    rotation.value = finalRotation

    setTimeout(() => {
      spinning.value = false
      finished.value = true
    }, 5200)
  } catch (err) {
    console.error('Lottery failed:', err)
  }
}

const goBack = () => {
  router.push({ path: '/profile', query: { token: route.query.token } })
}
</script>

<template>
  <div class="lottery-page">
    <h2 class="lottery-title">☕ 咖啡抽獎 Coffee Lottery</h2>

    <div class="wheel-container">
      <div class="wheel-pointer">▼</div>
      <svg class="wheel" :style="wheelStyle" viewBox="0 0 300 300">
        <g v-for="(seg, i) in segments" :key="i">
          <path
            :d="getSegmentPath(i)"
            :fill="seg.color"
            stroke="#fff"
            stroke-width="1"
          />
          <text
            :transform="getTextTransform(i)"
            text-anchor="middle"
            dominant-baseline="middle"
            fill="white"
            font-size="28"
            font-weight="bold"
          >
            {{ seg.label }}
          </text>
        </g>
        <circle cx="150" cy="150" r="25" fill="#fff" stroke="#ddd" stroke-width="2" />
        <text x="150" y="150" text-anchor="middle" dominant-baseline="middle" font-size="10" font-weight="bold" fill="#333">SPIN</text>
      </svg>
    </div>

    <div v-if="finished" class="result-section">
      <div v-if="result?.win" class="result-win">
        🎉 恭喜中獎！Congratulations!<br>你獲得一杯免費咖啡！You won a free coffee!
      </div>
      <div v-else class="result-lose">
        😢 很可惜沒有中獎<br>Better luck next time!
      </div>
      <button class="back-btn" @click="goBack">返回 Back to Profile</button>
    </div>
  </div>
</template>

<style scoped>
.lottery-page {
  width: 100%;
  height: 100%;
  background-color: #fbfaf2;
  display: flex;
  flex-direction: column;
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

.lottery-title {
  font-size: 22px;
  font-family: 'Zen Maru Gothic', sans-serif;
  font-weight: bold;
  color: #333;
  margin-bottom: 24px;
}

.wheel-container {
  position: relative;
  width: 280px;
  height: 280px;
}

.wheel {
  width: 100%;
  height: 100%;
}

.wheel-pointer {
  position: absolute;
  top: -18px;
  left: 50%;
  transform: translateX(-50%);
  font-size: 30px;
  color: #E8707E;
  z-index: 10;
  filter: drop-shadow(0 2px 3px rgba(0,0,0,0.3));
}

.result-section {
  margin-top: 30px;
  text-align: center;
}

.result-win {
  font-size: 18px;
  font-family: 'Zen Maru Gothic', sans-serif;
  font-weight: bold;
  color: #6B4226;
  background-color: #fff3e0;
  border: 2px solid #6B4226;
  border-radius: 12px;
  padding: 16px 24px;
  margin-bottom: 16px;
}

.result-lose {
  font-size: 18px;
  font-family: 'Zen Maru Gothic', sans-serif;
  font-weight: bold;
  color: #666;
  background-color: #f5f5f5;
  border: 2px solid #ddd;
  border-radius: 12px;
  padding: 16px 24px;
  margin-bottom: 16px;
}

.back-btn {
  background-color: #E8707E;
  color: white;
  border: none;
  padding: 10px 25px;
  border-radius: 20px;
  cursor: pointer;
  font-size: 16px;
  font-family: 'Zen Maru Gothic', sans-serif;
  font-weight: bold;
}
</style>
