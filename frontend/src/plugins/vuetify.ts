import 'vuetify/styles'
import { createVuetify } from 'vuetify'
import { aliases, mdi } from 'vuetify/iconsets/mdi-svg'

export default createVuetify({
  icons: {
    defaultSet: 'mdi',
    aliases,
    sets: {
      mdi,
    },
  },
  theme: {
    defaultTheme: 'dark',
    themes: {
      light: {
        dark: false,
        colors: {
          primary: '#F472B6',
          secondary: '#FB923C',
          accent: '#FBCFE8',
          error: '#EF4444',
          info: '#3B82F6',
          success: '#10B981',
          warning: '#F59E0B',
          surface: '#FFF1F2',
          background: '#FFF5F7',
          'surface-variant': '#FFE4E8',
          'on-surface': '#1F2937',
          'on-primary': '#FFFFFF',
        },
      },
      dark: {
        dark: true,
        colors: {
          primary: '#7C5CFF',
          secondary: '#A78BFA',
          accent: '#C4B5FD',
          error: '#EF4444',
          info: '#3B82F6',
          success: '#10B981',
          warning: '#F59E0B',
          surface: '#1E1B4B',
          background: '#0F0A1F',
          'surface-variant': '#2D2560',
          'on-surface': '#FFFFFF',
          'on-primary': '#FFFFFF',
        },
      },
    },
  },
  defaults: {
    VBtn: {
      rounded: 'xl',
    },
    VCard: {
      rounded: 'xl',
      elevation: 0,
    },
    VChip: {
      rounded: 'xl',
    },
  },
})
