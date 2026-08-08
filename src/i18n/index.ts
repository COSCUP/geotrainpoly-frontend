import { createI18n } from 'vue-i18n'
import zhTW from './zh-TW'
import en from './en'

const savedLocale = localStorage.getItem('locale') || 'zh-TW'

const i18n = createI18n({
  legacy: false,
  locale: savedLocale,
  fallbackLocale: 'zh-TW',
  messages: {
    'zh-TW': zhTW,
    'en': en,
  },
})

export function setLocale(locale: string) {
  ;(i18n.global.locale as any).value = locale
  localStorage.setItem('locale', locale)
}

export default i18n
