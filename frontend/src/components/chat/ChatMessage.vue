<script setup lang="ts">
import { computed } from 'vue'
import { VAvatar, VCard, VCardText, VIcon } from 'vuetify/components'
import { mdiAccount, mdiRobot } from '@mdi/js'
import type { Message } from '@/types/chat'

const props = defineProps<{
  message: Message
}>()

const formattedTime = computed(() => {
  return new Intl.DateTimeFormat('en-US', {
    hour: 'numeric',
    minute: 'numeric',
  }).format(props.message.timestamp)
})

const isUser = computed(() => props.message.role === 'user')
</script>

<template>
  <div :class="['message-wrapper d-flex', isUser ? 'justify-end' : 'justify-start']">
    <VCard
      :class="['message-card', isUser ? 'user-message' : 'assistant-message']"
      max-width="70%"
      :variant="isUser ? 'tonal' : 'outlined'"
      :color="isUser ? 'primary' : 'secondary'"
    >
      <VCardText class="d-flex align-start ga-3 pa-4">
        <VAvatar :color="isUser ? 'primary' : 'secondary'" size="32" class="flex-shrink-0">
          <VIcon :icon="isUser ? mdiAccount : mdiRobot" size="small" />
        </VAvatar>
        <div class="flex-grow-1">
          <div class="text-body-1">{{ message.content }}</div>
          <div class="text-caption mt-2 opacity-70">{{ formattedTime }}</div>
        </div>
      </VCardText>
    </VCard>
  </div>
</template>

<style scoped>
.message-wrapper {
  margin-bottom: 1rem;
}

.message-card {
  border-radius: 16px !important;
  border: 1px solid rgba(124, 92, 255, 0.2);
  transition: all 0.3s ease;
}

/* Light theme message card */
.v-theme--light .message-card {
  border-color: rgba(244, 114, 182, 0.2);
}

.message-card:hover {
  transform: translateY(-2px);
  box-shadow: 0 8px 24px rgba(124, 92, 255, 0.2);
}

/* Light theme hover */
.v-theme--light .message-card:hover {
  box-shadow: 0 8px 24px rgba(244, 114, 182, 0.2);
}

.user-message {
  background: rgba(124, 92, 255, 0.15) !important;
  border-bottom-right-radius: 4px !important;
}

/* Light theme user message */
.v-theme--light .user-message {
  background: rgba(244, 114, 182, 0.15) !important;
}

.assistant-message {
  background: rgba(167, 139, 250, 0.1) !important;
  border-bottom-left-radius: 4px !important;
}

/* Light theme assistant message */
.v-theme--light .assistant-message {
  background: rgba(251, 146, 60, 0.1) !important;
}
</style>
