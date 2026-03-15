import { VueQueryPlugin, type VueQueryPluginOptions } from '@tanstack/vue-query'
import type { App } from 'vue'

/**
 * VueQuery plugin configuration
 * @see https://tanstack.com/query/v5/docs/vue/reference/VueQueryPlugin
 */
const vueQueryOptions: VueQueryPluginOptions = {
  queryClientConfig: {
    defaultOptions: {
      queries: {
        // Retry on network errors or 5xx status codes
        retry: (failureCount, error) => {
          if (error instanceof Error && error.name === 'AbortError') {
            return false
          }
          return failureCount < 3
        },
        // Time in ms that query stays in cache before becoming stale
        staleTime: 1000 * 60 * 5, // 5 minutes
        // Time in ms before inactive queries are garbage collected
        gcTime: 1000 * 60 * 30, // 30 minutes
        // Prevent multiple components from fetching same data simultaneously
        refetchOnWindowFocus: false,
        // Refetch when data is stale and component mounts
        refetchOnMount: 'always',
      },
      mutations: {
        retry: false,
      },
    },
  },
  // Enable devtools integration
  enableDevtoolsV6Plugin: true,
}

/**
 * Install VueQuery plugin
 */
export function setupVueQuery(app: App) {
  app.use(VueQueryPlugin, vueQueryOptions)
}
