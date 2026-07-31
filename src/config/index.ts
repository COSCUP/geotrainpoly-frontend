import { createRouter, createWebHistory, RouteRecordRaw } from 'vue-router'
import PhaserGame from '../components/PhaserGame.vue'
import BoothsList from '../components/BoothsList.vue'
import MyQRcode from '../components/QRCode.vue'
import MyProfile from '../components/MyProfile.vue'
import Room from '../components/Room.vue'

const routes: Array<RouteRecordRaw> = [
  {
    path: '/',
    name: 'game',
    component: PhaserGame
  },
  {
    path: '/booths',
    name: 'booths',
    component: BoothsList
  },
  {
    path: '/my-qrcode',
    name: 'my-qrcode',
    component: MyQRcode,
  },
  {
    path: '/profile',
    name: 'profile',
    component: MyProfile
  },
  {
    path: '/room',
    name: 'room',
    component: Room
  }
]

const router = createRouter({
  history: createWebHistory(),
  routes
})

export default router
