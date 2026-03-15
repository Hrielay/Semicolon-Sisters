<script setup lang="ts">
import { VSheet, VProgressCircular } from 'vuetify/components'
</script>

<template>
  <VSheet class="loading-spinner" elevation="0">
    <div class="loading-spinner-content">
      <VProgressCircular
        indeterminate
        color="primary"
        size="64"
        width="4"
      />
    </div>
  </VSheet>
</template>

<style scoped>
.loading-spinner {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  display: flex;
  align-items: center;
  justify-content: center;
  background: transparent;
  z-index: 9999;
  pointer-events: none;
  opacity: 0;
  visibility: hidden;
  transition: opacity 0.2s ease, visibility 0.2s ease;
}

.loading-spinner.visible {
  opacity: 1;
  visibility: visible;
}

.loading-spinner-content {
  display: flex;
  align-items: center;
  justify-content: center;
}

/* Dark theme */
.v-theme--dark .loading-spinner {
  background: rgba(15, 10, 31, 0.85);
}

/* Light theme */
.v-theme--light .loading-spinner {
  background: rgba(255, 255, 255, 0.85);
}
</style>
