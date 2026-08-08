<script setup lang="ts">
import { computed } from 'vue'
import { useI18n } from 'vue-i18n'

const { t } = useI18n()

const props = defineProps<{
  session: any
  name?: string
}>()

const formattedTime = computed(() => {
  const session = props.session
  if (!session?.start || !session?.end) return t('session.noTime')

  const startDate = new Date(session.start)
  const endDate = new Date(session.end)

  const dateStr = startDate.toLocaleDateString('zh-TW', {
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
  }).replace(/\//g, '-')

  const startTimeStr = startDate.toLocaleTimeString('zh-TW', {
    hour: '2-digit',
    minute: '2-digit',
    hour12: false,
  })

  const endTimeStr = endDate.toLocaleTimeString('zh-TW', {
    hour: '2-digit',
    minute: '2-digit',
    hour12: false,
  })

  return `${dateStr} ${startTimeStr}–${endTimeStr}`
})

const actionButtons = computed(() => {
  const session = props.session
  return [
    {
      label: t('session.officialWebsite'),
      url: session?.uri,
      enabled: !!session?.uri,
    },
    {
      label: t('session.coWrite'),
      url: session?.co_write || '',
      enabled: !!session?.co_write,
    },
    {
      label: t('session.survey'),
      url: `https://coscup.org/2026-feedback/?session=${session?.id}`,
      enabled: !!session?.id,
    },
    {
      label: t('session.interpretation'),
      url: session?.record || '',
      enabled: !!session?.record,
    },
  ]
})
</script>

<template>
  <div class="session-card">
    <div class="status-badge" v-if="name">
      <strong>{{ name }}</strong>
    </div>

    <div class="title-section">
      <h1 class="session-title-zh">
        {{ session?.zh?.title }}
      </h1>
      <h2
        v-if="session?.en?.title && session?.en?.title !== session?.zh?.title"
        class="session-title-en"
      >
        {{ session?.en?.title }}
      </h2>
    </div>

    <hr class="divider" />

    <div class="info-grid">
      <div class="info-row">
        <div class="info-label">
          <strong>{{ t('session.time') }}</strong>
          <small>{{ t('session.timeEn') }}</small>
        </div>
        <div class="info-value">
          {{ formattedTime }}
        </div>
      </div>

      <div class="info-row">
        <div class="info-label">
          <strong>{{ t('session.speaker') }}</strong>
          <small>{{ t('session.speakerEn') }}</small>
        </div>
        <div class="info-value">
          {{ session?.speakers?.join(', ') }}
        </div>
      </div>

      <div class="info-row" v-if="session?.language">
        <div class="info-label">
          <strong>{{ t('session.language') }}</strong>
          <small>{{ t('session.languageEn') }}</small>
        </div>
        <div class="info-value">
          {{ session?.language }}
        </div>
      </div>
    </div>

    <div class="action-buttons">
      <template v-for="(btn, index) in actionButtons" :key="index">
        <a
          v-if="btn.enabled"
          :href="btn.url"
          target="_blank"
          rel="noopener noreferrer"
          class="action-btn"
        >
          <span>{{ btn.label }}</span>
          <span class="icon">↗</span>
        </a>
        <button
          v-else
          disabled
          class="action-btn disabled"
        >
          <span>{{ btn.label }}</span>
          <span class="icon">-</span>
        </button>
      </template>
    </div>
  </div>
</template>

<style scoped>
.session-card {
  display: flex;
  flex-direction: column;
  gap: 14px;
  text-align: left;
}

.status-badge {
  display: inline-flex;
  align-self: flex-start;
  border: 2px solid #1e1e1e;
  border-radius: 10px;
  padding: 4px 10px;
  background-color: #f4e8fb;
  color: #5b2873;
}

.status-badge strong {
  font-size: 0.9em;
}

.title-section {
  display: flex;
  flex-direction: column;
  gap: 6px;
}

.session-title-zh {
  font-size: 1.2em;
  font-weight: 800;
  color: #1e1e1e;
  line-height: 1.35;
  margin: 0;
}

.session-title-en {
  font-size: 0.95em;
  font-weight: 600;
  color: #666;
  line-height: 1.3;
  margin: 0;
}

.divider {
  border: none;
  border-top: 1px solid #eee;
  margin: 0;
}

.info-grid {
  display: flex;
  flex-direction: column;
  gap: 10px;
}

.info-row {
  display: flex;
  justify-content: space-between;
  align-items: center;
  border-bottom: 1px dashed #eee;
  padding-bottom: 6px;
}

.info-row:last-child {
  border-bottom: none;
}

.info-label {
  display: flex;
  flex-direction: column;
  color: #555;
}

.info-label strong {
  font-size: 0.85em;
}

.info-label small {
  font-size: 0.65em;
  color: #888;
}

.info-value {
  font-size: 0.9em;
  font-weight: 600;
  color: #222;
  text-align: right;
  max-width: 70%;
  word-break: break-word;
}

.action-buttons {
  display: flex;
  flex-direction: column;
  gap: 8px;
  margin-top: 6px;
}

.action-btn {
  flex: 1;
  min-width: 120px;
  border: 2px solid #1e1e1e;
  border-radius: 12px;
  background-color: #c48add;
  color: white;
  padding: 10px 12px;
  display: flex;
  justify-content: space-between;
  align-items: center;
  text-decoration: none;
  font-weight: bold;
  font-size: 0.85em;
  box-shadow: 0 3px 0 #1e1e1e;
  transition: transform 0.1s ease;
  box-sizing: border-box;
}

.action-btn:active:not(.disabled) {
  transform: translateY(2px);
  box-shadow: 0 1px 0 #1e1e1e;
}

.action-btn.disabled {
  background-color: #e0e0e0;
  color: #888;
  border-color: #ccc;
  box-shadow: none;
  cursor: not-allowed;
}

.icon {
  font-size: 1.1em;
}
</style>
