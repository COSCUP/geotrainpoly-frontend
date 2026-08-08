export default {
  // App.vue
  app: {
    logoutConfirm: 'Are you sure you want to logout?',
    logoutConfirmEn: 'Are you sure you want to logout?',
    cancel: 'Cancel',
    logout: 'Logout',
    boothList: 'Booth List',
    gameScreen: 'Game',
    showQRCode: 'Show QR Code',
    profile: 'Profile',
  },

  // PhaserGame.vue
  game: {
    completeServey: 'Please complete the participant survey first!',
    participantSurvey: 'Participant Survey',
    or: 'OR',
    manualInput: 'Enter Token Manually',
    scanQRCode: 'Scan QR Code',
    readFromImage: 'Read from Image',
    enterToken: 'Enter your Token',
    verifying: 'Verifying...',
    submit: 'Submit',
    selectImage: 'Select Image',
    selectImageHint: 'Select an image with a QR Code',
    invalidToken: 'Invalid token, please try again',
    networkError: 'Network error, please try again later',
    noQRCodeInImage: 'No QR code found in image',
    imageReadFailed: 'Failed to read image',
  },

  // MyProfile.vue
  profile: {
    points: 'pts',
    couponList: 'Coupon List',
    souvenirCoupon: 'Souvenir Discount Coupon',
    souvenirCouponEn: 'Souvenir Discount Coupon',
    redeemed: 'Redeemed',
    coffeeCoupon: 'Coffee Coupon Redemption',
    coffeeCouponEn: 'Coffee Coupon Redemption',
    coffeeRedeemLocation: 'Redeem at TR 1F booth',
    lotteryNotYet: '🎰 Lottery not yet available',
    lotteryTryLuck: '🎰 Try your luck for a free coffee!',
    adBanner: '📢 Grafana & Friends Taipei — Join us!',
    coffeeRedemption: '☕ Coffee Redemption',
    staffWarning: '⚠️ Please operate under staff guidance',
    staffWarningEn: 'Please operate under staff guidance',
    redeemDesc: 'Press the button below to redeem. This action cannot be undone.',
    redeemDescEn: 'Press the button below to redeem. This action cannot be undone.',
    redeem: 'Redeem',
    lotteryNotOpen: 'Lottery not yet available',
    startLottery: 'Start Lottery',
    chooseAvatar: 'Choose your favorite avatar',
    confirm: 'Confirm',
  },

  // Lottery.vue
  lottery: {
    title: '☕ Coffee Lottery',
    quotaFull: "Today's lottery quota is full.",
    quotaFullEn: 'Please try again tomorrow!',
    win: '🎉 Congratulations!',
    winDesc: 'You won a free coffee!',
    lose: '😢 Better luck next time!',
    loseEn: 'Better luck next time!',
    back: 'Back to Profile',
  },

  // CoffeeLanding.vue
  coffee: {
    title: 'Coffee Lottery',
    notLoggedIn: 'You are not logged in or not authenticated.',
    notLoggedInEn: 'You are not logged in or not authenticated.',
    useOPass: 'Please use the OPass "Open Source Summit Challenge" scanner to scan this QR Code to join the lottery.',
    useOPassEn: 'Please use the OPass "Open Source Summit Challenge" scanner to scan this QR Code to join the lottery.',
  },

  // QRCode.vue
  qrcode: {
    scan: 'Scan QR Code',
    show: 'Show QR Code',
  },

  // SessionCard.vue
  session: {
    noTime: 'No time information',
    officialWebsite: 'Official Website',
    coWrite: 'Co-write',
    survey: 'Survey',
    interpretation: 'Interpretation',
    time: 'Time',
    timeEn: 'Time',
    speaker: 'Speaker',
    speakerEn: 'Speaker',
    language: 'Language',
    languageEn: 'Language',
  },

  // Room.vue
  room: {
    loading: 'Loading...',
  },

  // Tutorial.vue
  tutorial: {
    clickToContinue: 'Click to continue',
  },

  // Game.ts
  gameScene: {
    alreadyCollected: 'Already collected this tile',
    collectSuccess: 'Successfully collected tile from {booth}',
  },
}
