<script setup lang="ts">
import { ref, onMounted, nextTick } from 'vue'
import { useRouter } from 'vue-router'
import { useTheme } from 'vuetify'
import {
  VContainer,
  VRow,
  VCol,
  VSheet,
  VCard,
  VCardText,
  VBtn,
  VIcon,
  VChip,
  VAppBar,
  VSpacer,
  VTextField,
  VForm,
  VExpansionPanels,
  VExpansionPanel,
  VExpansionPanelTitle,
  VExpansionPanelText,
  VAvatar,
  VDivider,
  VList,
  VListItem,
} from 'vuetify/components'
import {
  mdiBrain,
  mdiAccountOutline,
  mdiMessageTextOutline,
  mdiMapMarker,
  mdiAccountGroup,
  mdiClockOutline,
  mdiEmoticonSadOutline,
  mdiChip,
  mdiMap,
  mdiLightbulbOutline,
  mdiNavigation,
  mdiUpdate,
  mdiTune,
  mdiStar,
  mdiEmailOutline,
  mdiCity,
  mdiSendOutline,
  mdiHelpCircleOutline,
  mdiSend,
  mdiShieldCheckOutline,
  mdiEmail,
  mdiCopyright,
  mdiWhiteBalanceSunny,
  mdiWeatherNight,
  mdiMenu,
  mdiArrowRight,
} from '@mdi/js'

const theme = useTheme()
const router = useRouter()
const drawer = ref(false)
const email = ref('')
const city = ref('')
let observer: IntersectionObserver | null = null

const faqItems = [
  {
    question: 'Это бесплатно?',
    answer:
      'Да! Базовый функционал полностью бесплатен. Мы также планируем премиум-тариф с расширенными возможностями: неограниченное количество планов, приоритетная поддержка и эксклюзивные рекомендации.',
  },
  {
    question: 'Он бронирует места за меня?',
    answer:
      'AI-агент предоставляет прямые ссылки на бронирование и интеграцию с популярными сервисами. Вы можете забронировать место в один клик, перейдя по ссылке из плана.',
  },
  {
    question: 'Работает ли в моем городе?',
    answer:
      'Наш агент работает по всему миру! Мы поддерживаем все крупные города России и СНГ, а также продолжаем расширять базу заведений и мероприятий globally.',
  },
  {
    question: 'Безопасны ли мои данные?',
    answer:
      'Абсолютно! Мы используем современное шифрование и не передаем ваши данные третьим лицам. Ваша конфиденциальность — наш приоритет.',
  },
]

const examplePlans = [
  {
    title: 'Свидание в Москве',
    description: 'Ужин, прогулка, кино',
    budget: 'Средний',
    color: 'pink',
  },
  {
    title: 'Семейный день в СПб',
    description: 'Детские площадки, кафе, музеи',
    budget: 'Семейный',
    color: 'blue',
  },
  {
    title: 'Соло-перезагрузка',
    description: 'СПА, книга в кофейне, тихий парк',
    budget: 'Релакс',
    color: 'purple',
  },
]

const problemCards = [
  {
    icon: mdiClockOutline,
    title: 'Часами листаешь карты',
    description: 'И отзывы, но так и не решил, куда пойти',
  },
  {
    icon: mdiAccountGroup,
    title: 'Очередь на 2 часа',
    description: 'Пришел в популярное место, а там толпа',
  },
  {
    icon: mdiEmoticonSadOutline,
    title: 'Выходной прошел',
    description: 'А ощущения отдыха так и нет',
  },
]

const steps = [
  {
    icon: mdiMessageTextOutline,
    title: 'Расскажи о желаниях',
    description: 'Просто напиши, что хочешь: «Хочу активный отдых с детьми»',
  },
  {
    icon: mdiChip,
    title: 'AI анализирует 1000+ факторов',
    description: 'Погода, рейтинги, расстояние, цены, очереди',
  },
  {
    icon: mdiMap,
    title: 'Получи готовый маршрут',
    description: 'Тайминг, брони, ссылки — всё готово',
  },
]

const features = [
  {
    icon: mdiLightbulbOutline,
    title: 'Контекстное понимание',
    description:
      'Он поймет, что «романтическое место» — это не шумный бар, а тихая крыша с видом на закат',
  },
  {
    icon: mdiNavigation,
    title: 'Умная логистика',
    description:
      'Строит маршрут так, чтобы ты не метался по городу, а наслаждался каждым моментом',
  },
  {
    icon: mdiUpdate,
    title: 'Актуальность',
    description:
      'Проверяет актуальные часы работы и наличие мест в реальном времени',
  },
  {
    icon: mdiTune,
    title: 'Гибкость',
    description:
      'Передумал? Напиши «Давай заменим музей на парк», и план обновится за секунды',
  },
]

const toggleTheme = () => {
  const scrollPos = window.scrollY
  const newTheme = theme.global.current.value.dark ? 'light' : 'dark'
  theme.global.name.value = newTheme
  localStorage.setItem('theme', newTheme)
  
  // Re-trigger animations after theme change
  nextTick(() => {
    window.scrollTo(0, scrollPos)
    initAnimations()
  })
}

const navigateToChat = () => {
  router.push('/chat')
}

const smoothScrollToSection = (e: Event, sectionId: string) => {
  e.preventDefault()
  const element = document.getElementById(sectionId)
  if (element) {
    element.scrollIntoView({
      behavior: 'smooth',
      block: 'start',
    })
    drawer.value = false
  }
}

const initAnimations = () => {
  // Clean up existing observer
  if (observer) {
    observer.disconnect()
  }

  // Intersection Observer for scroll animations
  const observerOptions = {
    root: null,
    rootMargin: '0px',
    threshold: 0.1,
  }

  observer = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        entry.target.classList.add('section-visible')
      }
    })
  }, observerOptions)

  const animatedElements = document.querySelectorAll('.animate-on-scroll')
  animatedElements.forEach((el) => observer!.observe(el))
}

onMounted(() => {
  const savedTheme = localStorage.getItem('theme')
  if (savedTheme) {
    theme.global.name.value = savedTheme
  } else {
    const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches
    theme.global.name.value = prefersDark ? 'dark' : 'light'
  }

  // Initialize animations
  initAnimations()
})
</script>

<template>
  <VSheet class="landing-page">
    <!-- Header -->
    <VAppBar
      color="transparent"
      density="comfortable"
      class="landing-header"
      :elevation="0"
    >
      <VContainer class="d-flex align-center">
        <!-- Logo -->
        <div class="d-flex align-center ga-2">
          <VAvatar color="primary" size="40" class="logo-avatar">
            <VIcon :icon="mdiBrain" color="white" />
          </VAvatar>
          <span class="text-h6 font-weight-bold logo-text">PlanAI</span>
        </div>

        <VSpacer />

        <!-- Desktop Navigation -->
        <div class="d-none d-md-flex ga-4 align-center">
          <a href="#how-it-works" class="nav-link" @click="(e) => smoothScrollToSection(e, 'how-it-works')">Как это работает</a>
          <a href="#examples" class="nav-link" @click="(e) => smoothScrollToSection(e, 'examples')">Примеры планов</a>
          <a href="#reviews" class="nav-link" @click="(e) => smoothScrollToSection(e, 'reviews')">Отзывы</a>
          <a href="#faq" class="nav-link" @click="(e) => smoothScrollToSection(e, 'faq')">FAQ</a>
        </div>

        <VSpacer />

        <!-- Theme Toggle & CTA -->
        <div class="d-flex ga-2 align-center">
          <VBtn
            icon
            variant="text"
            size="small"
            @click="toggleTheme"
            class="theme-toggle"
          >
            <VIcon :icon="theme.global.current.value.dark ? mdiWhiteBalanceSunny : mdiWeatherNight" />
          </VBtn>

          <VBtn
            variant="tonal"
            color="primary"
            size="small"
            class="d-none d-sm-flex"
            @click="router.push('/login')"
          >
            <VIcon :icon="mdiAccountOutline" start />
            Войти
          </VBtn>

          <!-- Mobile Menu Button -->
          <VBtn
            icon
            variant="text"
            class="d-md-none"
            @click="drawer = !drawer"
          >
            <VIcon :icon="mdiMenu" />
          </VBtn>
        </div>
      </VContainer>
    </VAppBar>

    <!-- Mobile Drawer -->
    <VSheet
      v-if="drawer"
      class="mobile-drawer"
      position="fixed"
      style="top: 64px; right: 0; z-index: 1000;"
      width="280"
      elevation="8"
    >
      <VList>
        <VListItem @click="smoothScrollToSection($event, 'how-it-works'); drawer = false">
          <a href="#how-it-works" class="nav-link-mobile">Как это работает</a>
        </VListItem>
        <VDivider />
        <VListItem @click="smoothScrollToSection($event, 'examples'); drawer = false">
          <a href="#examples" class="nav-link-mobile">Примеры планов</a>
        </VListItem>
        <VDivider />
        <VListItem @click="smoothScrollToSection($event, 'reviews'); drawer = false">
          <a href="#reviews" class="nav-link-mobile">Отзывы</a>
        </VListItem>
        <VDivider />
        <VListItem @click="smoothScrollToSection($event, 'faq'); drawer = false">
          <a href="#faq" class="nav-link-mobile">FAQ</a>
        </VListItem>
      </VList>
    </VSheet>

    <!-- Hero Section -->
    <VSheet class="hero-section">
      <VContainer>
        <VRow align="center" class="hero-content">
          <VCol cols="12" md="6" class="text-center text-md-left">
            <h1 class="text-h3 text-md-h2 font-weight-bold mb-4 hero-title">
              Твой идеальный выходной за 30 секунд
            </h1>
            <p class="text-h6 text-md-body-1 mb-6 hero-subtitle">
              Доверь планирование AI-агенту. Просто напиши, куда хочешь пойти и во
              сколько. Мы учтем погоду, пробки, очереди и твои интересы.
            </p>

            <!-- CTA Button -->
            <VBtn
              color="primary"
              size="x-large"
              class="hero-cta-btn"
              elevation="4"
              @click="navigateToChat"
            >
              <VIcon :icon="mdiSendOutline" start />
              Составить план
              <VIcon :icon="mdiArrowRight" end />
            </VBtn>
          </VCol>

          <VCol cols="12" md="6" class="mt-8 mt-md-0">
            <!-- Chat Interface Animation -->
            <VCard class="chat-demo-card" elevation="8">
              <VCardText class="pa-4">
                <div class="chat-demo">
                  <!-- User Message -->
                  <div class="chat-message user-message mb-3">
                    <VChip color="primary" size="small" class="mb-2">
                      <VIcon :icon="mdiAccountOutline" start size="x-small" />
                      Пользователь
                    </VChip>
                    <p class="mb-0">
                      Хочу сходить на выставку и вкусно поесть в центре, бюджет 5000р
                    </p>
                  </div>

                  <!-- AI Response -->
                  <div class="chat-message ai-message">
                    <VChip color="secondary" size="small" class="mb-2">
                      <VIcon :icon="mdiBrain" start size="x-small" />
                      AI-Агент
                    </VChip>
                    <div class="plan-preview">
                      <div class="plan-item mb-2">
                        <VIcon :icon="mdiMapMarker" size="small" color="primary" />
                        <span>Выставка современного искусства — 14:00</span>
                      </div>
                      <div class="plan-item mb-2">
                        <VIcon :icon="mdiMapMarker" size="small" color="secondary" />
                        <span>Ужин в ресторане «Sky Lounge» — 17:00</span>
                      </div>
                      <div class="plan-item">
                        <VIcon :icon="mdiStar" size="small" color="accent" />
                        <span>Бюджет: 4800₽ ✅</span>
                      </div>
                    </div>
                  </div>
                </div>
              </VCardText>
            </VCard>
          </VCol>
        </VRow>
      </VContainer>
    </VSheet>

    <!-- Problem vs Solution -->
    <VSheet class="problem-section animate-on-scroll" id="problems">
      <VContainer>
        <div class="text-center mb-8">
          <h2 class="text-h4 font-weight-bold mb-2 section-title">Знакомо?</h2>
          <p class="text-body-1 text-medium-emphasis">
            Наш AI-агент берет рутину на себя
          </p>
        </div>

        <VRow>
          <VCol
            v-for="(card, index) in problemCards"
            :key="index"
            cols="12"
            sm="4"
            class="animate-on-scroll-item"
            :style="{ transitionDelay: `${index * 100}ms` }"
          >
            <VCard class="problem-card h-100" variant="elevated">
              <VCardText class="text-center pa-6">
                <VAvatar
                  :color="index === 0 ? 'error' : index === 1 ? 'warning' : 'info'"
                  size="60"
                  class="mb-4"
                  variant="flat"
                >
                  <VIcon :icon="card.icon" size="32" color="white" />
                </VAvatar>
                <h3 class="text-h6 font-weight-bold mb-2">{{ card.title }}</h3>
                <p class="text-body-2 text-medium-emphasis mb-0">
                  {{ card.description }}
                </p>
              </VCardText>
            </VCard>
          </VCol>
        </VRow>
      </VContainer>
    </VSheet>

    <!-- How It Works -->
    <VSheet class="steps-section animate-on-scroll" id="how-it-works">
      <VContainer>
        <div class="text-center mb-8">
          <h2 class="text-h4 font-weight-bold mb-2 section-title">План за 3 шага</h2>
        </div>

        <VRow>
          <VCol
            v-for="(step, index) in steps"
            :key="index"
            cols="12"
            md="4"
            class="animate-on-scroll-item"
            :style="{ transitionDelay: `${index * 150}ms` }"
          >
            <VCard class="step-card h-100" variant="outlined">
              <VCardText class="text-center pa-8">
                <div class="step-number mb-4">{{ index + 1 }}</div>
                <VAvatar color="primary" size="70" class="mb-4" variant="tonal">
                  <VIcon :icon="step.icon" size="36" />
                </VAvatar>
                <h3 class="text-h6 font-weight-bold mb-2">{{ step.title }}</h3>
                <p class="text-body-2 text-medium-emphasis mb-0">
                  {{ step.description }}
                </p>
              </VCardText>
            </VCard>
          </VCol>
        </VRow>
      </VContainer>
    </VSheet>

    <!-- Features -->
    <VSheet class="features-section animate-on-scroll">
      <VContainer>
        <div class="text-center mb-8">
          <h2 class="text-h4 font-weight-bold mb-2 section-title">
            Почему именно наш AI?
          </h2>
        </div>

        <VRow>
          <VCol
            v-for="(feature, index) in features"
            :key="index"
            cols="12"
            md="6"
            class="animate-on-scroll-item"
            :style="{ transitionDelay: `${index * 100}ms` }"
          >
            <VCard class="feature-card h-100" variant="elevated">
              <VCardText class="d-flex ga-4 pa-6">
                <VAvatar color="primary" size="50" variant="flat">
                  <VIcon :icon="feature.icon" size="28" color="white" />
                </VAvatar>
                <div>
                  <h3 class="text-h6 font-weight-bold mb-2">{{ feature.title }}</h3>
                  <p class="text-body-2 text-medium-emphasis mb-0">
                    {{ feature.description }}
                  </p>
                </div>
              </VCardText>
            </VCard>
          </VCol>
        </VRow>
      </VContainer>
    </VSheet>

    <!-- Example Plans -->
    <VSheet class="examples-section animate-on-scroll" id="examples">
      <VContainer>
        <div class="text-center mb-8">
          <h2 class="text-h4 font-weight-bold mb-2 section-title">
            Примеры сгенерированных планов
          </h2>
          <p class="text-body-1 text-medium-emphasis">
            Посмотри, что может создать наш AI
          </p>
        </div>

        <VRow>
          <VCol
            v-for="(plan, index) in examplePlans"
            :key="index"
            cols="12"
            md="4"
            class="animate-on-scroll-item"
            :style="{ transitionDelay: `${index * 150}ms` }"
          >
            <VCard class="example-card h-100" variant="elevated">
              <VSheet height="200" :color="plan.color" class="d-flex align-center justify-center">
                <VIcon :icon="mdiMapMarker" size="64" color="white" />
              </VSheet>
              <VCardText class="pa-4">
                <VChip :color="plan.color" size="small" class="mb-2">
                  {{ plan.budget }}
                </VChip>
                <h3 class="text-h6 font-weight-bold mb-1">{{ plan.title }}</h3>
                <p class="text-body-2 text-medium-emphasis mb-0">
                  {{ plan.description }}
                </p>
              </VCardText>
            </VCard>
          </VCol>
        </VRow>
      </VContainer>
    </VSheet>

    <!-- Lead Magnet -->
    <VSheet class="lead-magnet-section animate-on-scroll">
      <VContainer>
        <VCard class="lead-magnet-card" variant="elevated">
          <VCardText class="pa-8 pa-md-12">
            <VRow align="center" justify="center">
              <VCol cols="12" md="6" class="text-center text-md-left mb-6 mb-md-0 animate-on-scroll-item">
                <h2 class="text-h4 font-weight-bold mb-2">
                  Попробуй прямо сейчас
                </h2>
                <p class="text-body-1 text-medium-emphasis mb-0">
                  Оставь почту, и мы пришлем тебе 3 готовых плана на ближайшие
                  выходные в твоем городе бесплатно
                </p>
              </VCol>
              <VCol cols="12" md="5" offset-md="1" class="animate-on-scroll-item" style="transition-delay: 200ms;">
                <VForm @submit.prevent class="lead-form">
                  <VRow>
                    <VCol cols="12">
                      <VTextField
                        v-model="email"
                        label="Email"
                        type="email"
                        variant="outlined"
                        :prepend-inner-icon="mdiEmailOutline"
                        hide-details
                        class="mb-3"
                      />
                    </VCol>
                    <VCol cols="12">
                      <VTextField
                        v-model="city"
                        label="Город"
                        variant="outlined"
                        :prepend-inner-icon="mdiCity"
                        hide-details
                        class="mb-3"
                      />
                    </VCol>
                    <VCol cols="12">
                      <VBtn color="primary" block size="large" type="submit">
                        <VIcon :icon="mdiSendOutline" start />
                        Получить планы
                      </VBtn>
                    </VCol>
                  </VRow>
                </VForm>
              </VCol>
            </VRow>
          </VCardText>
        </VCard>
      </VContainer>
    </VSheet>

    <!-- Reviews / Early Access -->
    <VSheet class="reviews-section animate-on-scroll" id="reviews">
      <VContainer>
        <div class="text-center mb-8">
          <h2 class="text-h4 font-weight-bold mb-2 section-title">
            Ранний доступ
          </h2>
          <p class="text-body-1 text-medium-emphasis mb-6">
            Присоединяйся к 500+ пользователям, которые уже тестируют нашего агента
          </p>

          <VRow justify="center">
            <VCol cols="auto" v-for="i in 6" :key="i" class="animate-on-scroll-item" :style="{ transitionDelay: `${i * 80}ms` }">
              <VAvatar color="primary" size="50" variant="tonal">
                <VIcon :icon="mdiAccountOutline" />
              </VAvatar>
            </VCol>
          </VRow>
          <p class="text-body-2 text-medium-emphasis mt-4">
            +494 других пользователя
          </p>
        </div>
      </VContainer>
    </VSheet>

    <!-- FAQ -->
    <VSheet class="faq-section animate-on-scroll" id="faq">
      <VContainer>
        <div class="text-center mb-8">
          <h2 class="text-h4 font-weight-bold mb-2 section-title">
            Вопросы и ответы
          </h2>
        </div>

        <VRow justify="center">
          <VCol cols="12" md="8" class="animate-on-scroll-item">
            <VExpansionPanels variant="accordion">
              <VExpansionPanel
                v-for="(item, index) in faqItems"
                :key="index"
                class="animate-on-scroll-item"
                :style="{ transitionDelay: `${index * 100}ms` }"
              >
                <VExpansionPanelTitle class="font-weight-bold">
                  <VIcon :icon="mdiHelpCircleOutline" start class="me-2" />
                  {{ item.question }}
                </VExpansionPanelTitle>
                <VExpansionPanelText>
                  {{ item.answer }}
                </VExpansionPanelText>
              </VExpansionPanel>
            </VExpansionPanels>
          </VCol>
        </VRow>
      </VContainer>
    </VSheet>

    <!-- Footer -->
    <VSheet class="footer-section">
      <VContainer>
        <VRow>
          <VCol cols="12" md="4" class="mb-6 mb-md-0">
            <div class="d-flex align-center ga-2 mb-4">
              <VAvatar color="primary" size="40">
                <VIcon :icon="mdiBrain" color="white" />
              </VAvatar>
              <span class="text-h6 font-weight-bold">PlanAI</span>
            </div>
            <p class="text-body-2 text-medium-emphasis mb-4">
              Твой персональный AI-агент для планирования идеального отдыха
            </p>
            <div class="d-flex ga-2">
              <VBtn icon variant="text" size="small">
                <VIcon :icon="mdiSend" />
              </VBtn>
            </div>
          </VCol>

          <VCol cols="6" md="2">
            <h4 class="text-subtitle-1 font-weight-bold mb-3">Продукт</h4>
            <VList density="compact" class="bg-transparent pa-0">
              <VListItem class="px-0">
                <a href="#how-it-works" class="footer-link">Как это работает</a>
              </VListItem>
              <VListItem class="px-0">
                <a href="#examples" class="footer-link">Примеры</a>
              </VListItem>
              <VListItem class="px-0">
                <a href="#faq" class="footer-link">FAQ</a>
              </VListItem>
            </VList>
          </VCol>

          <VCol cols="6" md="2">
            <h4 class="text-subtitle-1 font-weight-bold mb-3">Компания</h4>
            <VList density="compact" class="bg-transparent pa-0">
              <VListItem class="px-0">
                <a href="#" class="footer-link">О нас</a>
              </VListItem>
              <VListItem class="px-0">
                <a href="#" class="footer-link">Контакты</a>
              </VListItem>
              <VListItem class="px-0">
                <a href="#" class="footer-link">Блог</a>
              </VListItem>
            </VList>
          </VCol>

          <VCol cols="12" md="4">
            <h4 class="text-subtitle-1 font-weight-bold mb-3">Юридическая информация</h4>
            <VList density="compact" class="bg-transparent pa-0">
              <VListItem class="px-0">
                <a href="#" class="footer-link">Политика конфиденциальности</a>
              </VListItem>
              <VListItem class="px-0">
                <a href="#" class="footer-link">Условия использования</a>
              </VListItem>
              <VListItem class="px-0">
                <div class="d-flex align-center ga-1 text-body-2 text-medium-emphasis">
                  <VIcon :icon="mdiShieldCheckOutline" size="small" />
                  <span>Ваши данные в безопасности</span>
                </div>
              </VListItem>
            </VList>
          </VCol>
        </VRow>

        <VDivider class="my-6" />

        <VRow align="center">
          <VCol cols="12" md="6" class="text-center text-md-left">
            <div class="d-flex align-center ga-1 text-body-2 text-medium-emphasis">
              <VIcon :icon="mdiCopyright" size="small" />
              <span>2024 PlanAI. Все права защищены.</span>
            </div>
          </VCol>
          <VCol cols="12" md="6" class="text-center text-md-right">
            <div class="d-flex align-center ga-1 text-body-2 text-medium-emphasis justify-center justify-md-end">
              <VIcon :icon="mdiEmail" size="small" />
              <span>support@planai.com</span>
            </div>
          </VCol>
        </VRow>
      </VContainer>
    </VSheet>
  </VSheet>
</template>

<style scoped>
.landing-page {
  min-height: 100vh;
  overflow-x: hidden;
}

/* Scroll Animation Styles */
.animate-on-scroll {
  opacity: 0;
  transform: translateY(40px);
  transition: opacity 0.8s cubic-bezier(0.4, 0, 0.2, 1), transform 0.8s cubic-bezier(0.4, 0, 0.2, 1);
}

.animate-on-scroll.section-visible {
  opacity: 1;
  transform: translateY(0);
}

.animate-on-scroll-item {
  opacity: 0;
  transform: translateY(30px);
  transition: opacity 0.6s cubic-bezier(0.4, 0, 0.2, 1), transform 0.6s cubic-bezier(0.4, 0, 0.2, 1);
}

.section-visible .animate-on-scroll-item {
  opacity: 1;
  transform: translateY(0);
}

/* Stagger animation for cards */
.problem-section.section-visible .animate-on-scroll-item,
.steps-section.section-visible .animate-on-scroll-item,
.features-section.section-visible .animate-on-scroll-item,
.examples-section.section-visible .animate-on-scroll-item {
  transition-delay: var(--transition-delay, 0ms);
}

/* Header Styles */
.landing-header {
  backdrop-filter: blur(10px);
  border-bottom: 1px solid rgba(124, 92, 255, 0.1);
}

.v-theme--light .landing-header {
  background: rgba(255, 255, 255, 0.8) !important;
  border-bottom-color: rgba(244, 114, 182, 0.15);
}

.v-theme--dark .landing-header {
  background: rgba(15, 10, 31, 0.8) !important;
}

.logo-avatar {
  background: linear-gradient(135deg, #7c5cff, #a78bfa);
}

.v-theme--light .logo-avatar {
  background: linear-gradient(135deg, #f472b6, #fb923c);
}

.logo-text {
  background: linear-gradient(90deg, #7c5cff, #a78bfa);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
}

.v-theme--light .logo-text {
  background: linear-gradient(90deg, #f472b6, #fb923c);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
}

.nav-link {
  color: inherit;
  text-decoration: none;
  font-size: 0.9rem;
  transition: color 0.2s ease;
}

.nav-link:hover {
  color: #7c5cff;
}

.v-theme--light .nav-link:hover {
  color: #f472b6;
}

.nav-link-mobile {
  color: inherit;
  text-decoration: none;
  display: block;
  padding: 0.5rem 0;
}

.mobile-drawer {
  backdrop-filter: blur(10px);
}

.v-theme--light .mobile-drawer {
  background: rgba(255, 255, 255, 0.95) !important;
}

.v-theme--dark .mobile-drawer {
  background: rgba(15, 10, 31, 0.95) !important;
}

/* Hero Section */
.hero-section {
  background: linear-gradient(135deg, rgba(124, 92, 255, 0.15) 0%, transparent 50%, rgba(167, 139, 250, 0.1) 100%);
  padding: 4rem 0;
  min-height: 80vh;
  display: flex;
  align-items: center;
}

.v-theme--light .hero-section {
  background: linear-gradient(135deg, rgba(244, 114, 182, 0.15) 0%, transparent 50%, rgba(251, 146, 60, 0.1) 100%);
}

.hero-title {
  background: linear-gradient(90deg, #7c5cff, #a78bfa, #c4b5fd);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
}

.v-theme--light .hero-title {
  background: linear-gradient(90deg, #f472b6, #fb923c, #fca5a5);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
}

.hero-subtitle {
  opacity: 0.8;
}

/* Hero CTA Button */
.hero-cta-btn {
  font-size: 1.1rem;
  font-weight: 600;
  padding: 1.5rem 2.5rem;
  letter-spacing: 0.5px;
  transition: all 0.3s ease;
}

.hero-cta-btn:hover {
  transform: translateY(-3px);
  box-shadow: 0 12px 24px rgba(124, 92, 255, 0.4);
}

.v-theme--light .hero-cta-btn:hover {
  box-shadow: 0 12px 24px rgba(244, 114, 182, 0.4);
}

/* Chat Demo Card */
.chat-demo-card {
  background: rgba(30, 27, 75, 0.8);
  border: 1px solid rgba(124, 92, 255, 0.3);
}

.v-theme--light .chat-demo-card {
  background: rgba(255, 255, 255, 0.8);
  border: 1px solid rgba(244, 114, 182, 0.2);
}

.chat-message {
  padding: 0.75rem;
  border-radius: 12px;
}

.user-message {
  background: rgba(124, 92, 255, 0.15);
}

.v-theme--light .user-message {
  background: rgba(244, 114, 182, 0.1);
}

.ai-message {
  background: rgba(167, 139, 250, 0.15);
}

.v-theme--light .ai-message {
  background: rgba(251, 146, 60, 0.1);
}

.plan-preview {
  margin-top: 0.5rem;
}

.plan-item {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  font-size: 0.875rem;
}

/* Section Titles */
.section-title {
  background: linear-gradient(90deg, #7c5cff, #a78bfa);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
}

.v-theme--light .section-title {
  background: linear-gradient(90deg, #f472b6, #fb923c);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
}

/* Problem Section */
.problem-section {
  padding: 5rem 0;
}

.problem-card {
  transition: transform 0.3s ease, box-shadow 0.3s ease;
  background: rgba(124, 92, 255, 0.08);
}

.v-theme--light .problem-card {
  background: linear-gradient(135deg, rgba(244, 114, 182, 0.08), rgba(251, 146, 60, 0.05));
  box-shadow: 0 4px 20px rgba(244, 114, 182, 0.1);
}

.v-theme--dark .problem-card {
  box-shadow: 0 4px 20px rgba(124, 92, 255, 0.15);
}

.problem-card:hover {
  transform: translateY(-5px);
}

/* Steps Section */
.steps-section {
  padding: 5rem 0;
  background: rgba(124, 92, 255, 0.05);
}

.v-theme--light .steps-section {
  background: rgba(244, 114, 182, 0.05);
}

.step-number {
  font-size: 3rem;
  font-weight: bold;
  opacity: 0.1;
  background: linear-gradient(90deg, #7c5cff, #a78bfa);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
}

.v-theme--light .step-number {
  background: linear-gradient(90deg, #f472b6, #fb923c);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
}

.step-card {
  transition: transform 0.3s ease, box-shadow 0.3s ease;
  background: rgba(124, 92, 255, 0.05);
}

.v-theme--light .step-card {
  background: linear-gradient(135deg, rgba(244, 114, 182, 0.05), rgba(251, 146, 60, 0.03));
  box-shadow: 0 4px 15px rgba(244, 114, 182, 0.08);
}

.v-theme--dark .step-card {
  box-shadow: 0 4px 15px rgba(124, 92, 255, 0.1);
}

.step-card:hover {
  transform: translateY(-5px);
}

/* Features Section */
.features-section {
  padding: 5rem 0;
}

.feature-card {
  transition: transform 0.3s ease, box-shadow 0.3s ease;
  background: rgba(124, 92, 255, 0.08);
}

.v-theme--light .feature-card {
  background: linear-gradient(135deg, rgba(244, 114, 182, 0.08), rgba(167, 139, 250, 0.05));
  box-shadow: 0 4px 20px rgba(244, 114, 182, 0.1);
}

.v-theme--dark .feature-card {
  box-shadow: 0 4px 20px rgba(124, 92, 255, 0.15);
}

.feature-card:hover {
  transform: translateX(5px);
}

/* Examples Section */
.examples-section {
  padding: 5rem 0;
  background: rgba(124, 92, 255, 0.05);
}

.v-theme--light .examples-section {
  background: rgba(244, 114, 182, 0.05);
}

.example-card {
  transition: transform 0.3s ease, box-shadow 0.3s ease;
  overflow: hidden;
}

.example-card:hover {
  transform: translateY(-5px);
}

/* Lead Magnet Section */
.lead-magnet-section {
  padding: 5rem 0;
}

.lead-magnet-card {
  background: linear-gradient(135deg, rgba(124, 92, 255, 0.2), rgba(167, 139, 250, 0.1));
  border: 1px solid rgba(124, 92, 255, 0.3);
}

.v-theme--light .lead-magnet-card {
  background: linear-gradient(135deg, rgba(244, 114, 182, 0.2), rgba(251, 146, 60, 0.1));
  border: 1px solid rgba(244, 114, 182, 0.3);
}

/* Reviews Section */
.reviews-section {
  padding: 5rem 0;
}

/* FAQ Section */
.faq-section {
  padding: 5rem 0;
  background: rgba(124, 92, 255, 0.05);
}

.v-theme--light .faq-section {
  background: rgba(244, 114, 182, 0.05);
}

/* Footer Section */
.footer-section {
  padding: 3rem 0;
  border-top: 1px solid rgba(124, 92, 255, 0.1);
}

.v-theme--light .footer-section {
  border-top-color: rgba(244, 114, 182, 0.15);
}

.footer-link {
  color: inherit;
  text-decoration: none;
  font-size: 0.875rem;
  opacity: 0.8;
  transition: opacity 0.2s ease;
}

.footer-link:hover {
  opacity: 1;
}

/* Responsive adjustments */
@media (max-width: 768px) {
  .hero-section {
    padding: 2rem 0;
    min-height: auto;
  }

  .hero-title {
    font-size: 1.75rem !important;
  }

  .section-title {
    font-size: 1.5rem !important;
  }

  .problem-section,
  .steps-section,
  .features-section,
  .examples-section,
  .lead-magnet-section,
  .reviews-section,
  .faq-section {
    padding: 3rem 0;
  }

  .lead-magnet-card .pa-8.pa-md-12 {
    padding: 1.5rem !important;
  }
}
</style>
