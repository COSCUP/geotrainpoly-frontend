export default {
  // App.vue
  app: {
    logoutConfirm: '確定要登出嗎？',
    logoutConfirmEn: 'Are you sure you want to logout?',
    cancel: '取消',
    logout: '登出',
    boothList: '攤位列表',
    gameScreen: '遊戲畫面',
    showQRCode: '顯示 QR Code',
    profile: '個人頁面',
  },

  // PhaserGame.vue
  game: {
    completeServey: '請先完成參與者大調查！',
    participantSurvey: '參與者大調查',
    or: '或 / OR',
    manualInput: '手動輸入 Token',
    scanQRCode: '掃描 QR Code',
    readFromImage: '從圖片讀取',
    enterToken: '請輸入 Token',
    verifying: '驗證中...',
    submit: '送出',
    selectImage: '選擇圖片 / Select Image',
    selectImageHint: '選擇含有 QR Code 的圖片',
    invalidToken: 'Token 無效，請重新輸入 / Invalid token',
    networkError: '網路錯誤，請稍後再試 / Network error',
    noQRCodeInImage: '無法從圖片中讀取 QR Code / No QR code found in image',
    imageReadFailed: '圖片讀取失敗 / Failed to read image',
  },

  // MyProfile.vue
  profile: {
    points: '分',
    couponList: '票卷清單',
    souvenirCoupon: '紀念品折價卷',
    souvenirCouponEn: 'Souvenir Discount Coupon',
    redeemed: '已兌換 Redeemed',
    coffeeCoupon: '實體咖啡卷兌換',
    coffeeCouponEn: 'Coffee Coupon Redemption',
    coffeeRedeemLocation: '前往 TR 1F 兌換 Redeem at TR 1F booth',
    lotteryNotYet: '🎰 抽獎尚未開放 Lottery not yet available',
    lotteryTryLuck: '🎰 點我抽咖啡卷！Try your luck for a free coffee!',
    adBanner: '📢 Grafana & Friends Taipei — Join us!',
    coffeeRedemption: '☕ 咖啡兌換 Coffee Redemption',
    staffWarning: '⚠️ 請在工作人員指示下操作',
    staffWarningEn: 'Please operate under staff guidance',
    redeemDesc: '點擊下方按鈕完成兌換，兌換後無法復原。',
    redeemDescEn: 'Press the button below to redeem. This action cannot be undone.',
    redeem: '兌換 Redeem',
    lotteryNotOpen: '抽獎尚未開放 Lottery not yet available',
    startLottery: '開始抽獎 Start Lottery',
    chooseAvatar: '選擇喜歡的頭像',
    confirm: '確定',
  },

  // Lottery.vue
  lottery: {
    title: '☕ 咖啡抽獎 Coffee Lottery',
    quotaFull: '今日抽獎名額已滿，請明天再來！',
    quotaFullEn: "Today's lottery quota is full. Please try again tomorrow!",
    win: '🎉 恭喜中獎！Congratulations!',
    winDesc: '你獲得一杯免費咖啡！You won a free coffee!',
    lose: '😢 很可惜沒有中獎',
    loseEn: 'Better luck next time!',
    back: '返回 Back to Profile',
  },

  // CoffeeLanding.vue
  coffee: {
    title: '咖啡抽獎 Coffee Lottery',
    notLoggedIn: '你尚未登入或沒有身份驗證。',
    notLoggedInEn: 'You are not logged in or not authenticated.',
    useOPass: '請使用 OPass 的「開源巔峰挑戰」掃描器掃描此 QR Code 來參加抽獎。',
    useOPassEn: 'Please use the OPass "Open Source Summit Challenge" scanner to scan this QR Code to join the lottery.',
  },

  // QRCode.vue
  qrcode: {
    scan: '掃描 QR Code',
    show: '顯示 QR Code',
  },

  // SessionCard.vue
  session: {
    noTime: '暫無時間資訊',
    officialWebsite: '議程連結 (Official Website)',
    coWrite: '共筆 (Co-write)',
    survey: '議程問卷 (Survey)',
    interpretation: '即時口譯 (Interpretation)',
    time: '時間',
    timeEn: 'Time',
    speaker: '講者',
    speakerEn: 'Speaker',
    language: '語言',
    languageEn: 'Language',
  },

  // Room.vue
  room: {
    loading: '資料載入中...',
  },

  // Tutorial.vue
  tutorial: {
    clickToContinue: '點擊繼續',
  },

  // Game.ts
  gameScene: {
    alreadyCollected: '已搜集過此板塊了',
    collectSuccess: '成功收集到{booth}的板塊',
  },
}
