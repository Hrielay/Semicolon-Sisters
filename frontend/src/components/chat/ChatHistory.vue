<script setup lang="ts">
import {
  VList,
  VListItem,
  VListItemTitle,
  VListItemSubtitle,
  VIcon,
  VBtn,
} from 'vuetify/components'
import { mdiDeleteOutline } from '@mdi/js'
import type { ChatSession } from '@/types/chat'

defineProps<{
  sessions: ChatSession[]
  currentSessionId: string | null
}>()

const emit = defineEmits<{
  select: [sessionId: string]
  delete: [sessionId: string]
  create: []
}>()
</script>

<template>
  <VList class="flex-grow-1 overflow-y-auto" density="compact">
    <template v-if="sessions.length === 0">
      <div class="text-center pa-8 text-medium-emphasis">
        <VIcon :icon="mdiDeleteOutline" size="32" class="mb-2 opacity-50" />
        <div class="text-caption">No recent chats</div>
      </div>
    </template>

    <VListItem
      v-for="session in sessions"
      :key="session.id"
      :active="session.id === currentSessionId"
      :color="session.id === currentSessionId ? 'primary' : undefined"
      rounded="xl"
      @click="emit('select', session.id)"
      class="mb-2"
    >
      <VListItemTitle class="text-body-2 font-weight-medium">
        {{ session.title }}
      </VListItemTitle>
      <VListItemSubtitle class="text-xs mt-1 opacity-70">
        {{
          new Intl.DateTimeFormat('en-US', {
            month: 'short',
            day: 'numeric',
            hour: 'numeric',
            minute: 'numeric',
          }).format(session.updatedAt)
        }}
      </VListItemSubtitle>

      <template #append>
        <VBtn
          icon
          variant="text"
          size="x-small"
          color="error"
          @click.stop="emit('delete', session.id)"
          class="opacity-0 hover-opacity-100"
        >
          <VIcon :icon="mdiDeleteOutline" size="x-small" />
        </VBtn>
      </template>
    </VListItem>
  </VList>
</template>

<style scoped>
.overflow-y-auto {
  overflow-y: auto;
}

.hover-opacity-100 {
  transition: opacity 0.2s ease;
}

.v-list-item:hover .hover-opacity-100 {
  opacity: 1 !important;
}

/* Custom scrollbar - Dark theme */
.overflow-y-auto::-webkit-scrollbar {
  width: 4px;
}

.overflow-y-auto::-webkit-scrollbar-track {
  background: transparent;
}

.overflow-y-auto::-webkit-scrollbar-thumb {
  background: rgba(124, 92, 255, 0.3);
  border-radius: 2px;
}

/* Light theme scrollbar */
.v-theme--light .overflow-y-auto::-webkit-scrollbar-thumb {
  background: rgba(244, 114, 182, 0.3);
}
</style>
