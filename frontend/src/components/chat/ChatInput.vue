<script setup lang="ts">
import { ref } from 'vue'
import { VTextField, VBtn, VIcon } from 'vuetify/components'
import { mdiSend, mdiStar } from '@mdi/js'

const emit = defineEmits<{
  send: [message: string]
}>()

const message = ref('')

const handleSubmit = () => {
  if (message.value.trim()) {
    emit('send', message.value.trim())
    message.value = ''
  }
}

const handleKeydown = (event: KeyboardEvent) => {
  if (event.key === 'Enter' && !event.shiftKey) {
    event.preventDefault()
    handleSubmit()
  }
}
</script>

<template>
  <div class="chat-input-container pa-2">
    <VTextField
      v-model="message"
      placeholder="Describe your dream holiday..."
      variant="outlined"
      density="comfortable"
      hide-details
      bg-color="transparent"
      class="chat-input-field"
      @keydown="handleKeydown"
    >
      <template #prepend-inner>
        <VIcon :icon="mdiStar" color="primary" class="mr-2" />
      </template>
      <template #append>
        <VBtn
          icon
          color="primary"
          :disabled="!message.trim()"
          size="large"
          variant="flat"
          @click="handleSubmit"
        >
          <VIcon :icon="mdiSend" />
        </VBtn>
      </template>
    </VTextField>
  </div>
</template>

<style scoped>
.chat-input-container {
  background: transparent;
}

.chat-input-field :deep(.v-field) {
  border-radius: 16px !important;
  border: 1px solid rgba(124, 92, 255, 0.3) !important;
  background: rgba(30, 27, 75, 0.5) !important;
  transition: all 0.3s ease;
}

/* Light theme input field */
.v-theme--light .chat-input-field :deep(.v-field) {
  border-color: rgba(244, 114, 182, 0.3) !important;
  background: rgba(255, 255, 255, 0.5) !important;
}

.chat-input-field :deep(.v-field:hover) {
  border-color: rgba(124, 92, 255, 0.5) !important;
}

/* Light theme hover */
.v-theme--light .chat-input-field :deep(.v-field:hover) {
  border-color: rgba(244, 114, 182, 0.5) !important;
}

.chat-input-field :deep(.v-field--focused) {
  border-color: #7C5CFF !important;
  box-shadow: 0 0 0 3px rgba(124, 92, 255, 0.1);
}

/* Light theme focused */
.v-theme--light .chat-input-field :deep(.v-field--focused) {
  border-color: #F472B6 !important;
  box-shadow: 0 0 0 3px rgba(244, 114, 182, 0.1);
}
</style>
