import { createRouter, createWebHistory, RouteRecordRaw } from 'vue-router'
import PhaserGame from '../components/PhaserGame.vue'
import BoothsList from '../components/BoothsList.vue'
import MyQRcode from '../components/QRCode.vue'
import MyProfile from '../components/MyProfile.vue'
import Room from '../components/Room.vue'
import Lottery from '../components/Lottery.vue'
import CoffeeLanding from '../components/CoffeeLanding.vue'

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
  },
  {
    path: '/lottery',
    name: 'lottery',
    component: Lottery
  },
  {
    path: '/coffee',
    name: 'coffee',
    component: CoffeeLanding
  }
]

const router = createRouter({
  history: createWebHistory(),
  routes
})

router.beforeEach((to, _from, next) => {
  if (!to.query.token) {
    const savedToken = localStorage.getItem('userToken')
    if (savedToken) {
      next({ ...to, query: { ...to.query, token: savedToken } } as any)
      return
    }
  } else {
    localStorage.setItem('userToken', to.query.token as string)
  }
  next()
})

export default router
