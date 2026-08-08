import { createApp } from 'vue'
import App from './App.vue'
import router from './config'
import Toast from 'vue-toastification'
import 'vue-toastification/dist/index.css'
import i18n from './i18n'

const app = createApp(App)
app.use(router)
app.use(Toast)
app.use(i18n)
app.mount('#app')