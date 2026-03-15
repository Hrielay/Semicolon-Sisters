# Template frontend project

This template should help get you started developing with Vue 3 in Vite.

## Recommended IDE Setup

[VS Code](https://code.visualstudio.com/) + [Vue (Official)](https://marketplace.visualstudio.com/items?itemName=Vue.volar) (and disable Vetur).

## Recommended Browser Setup

- Chromium-based browsers (Chrome, Edge, Brave, etc.):
  - [Vue.js devtools](https://chromewebstore.google.com/detail/vuejs-devtools/nhdogjmejiglipccpnnnanhbledajbpd)
  - [Turn on Custom Object Formatter in Chrome DevTools](http://bit.ly/object-formatters)
- Firefox:
  - [Vue.js devtools](https://addons.mozilla.org/en-US/firefox/addon/vue-js-devtools/)
  - [Turn on Custom Object Formatter in Firefox DevTools](https://fxdx.dev/firefox-devtools-custom-object-formatters/)

## Type Support for `.vue` Imports in TS

TypeScript cannot handle type information for `.vue` imports by default, so we replace the `tsc` CLI with `vue-tsc` for type checking. In editors, we need [Volar](https://marketplace.visualstudio.com/items?itemName=Vue.volar) to make the TypeScript language service aware of `.vue` types.

## Customize configuration

See [Vite Configuration Reference](https://vite.dev/config/).

## Project Setup

```sh
yarn
```

### Compile and Hot-Reload for Development

```sh
yarn dev
```

### Type-Check, Compile and Minify for Production

```sh
yarn build
```

### Run Unit Tests with [Vitest](https://vitest.dev/)

```sh
yarn test:unit
```

### Lint with [ESLint](https://eslint.org/)

```sh
yarn lint
```

## AI Setup

Project use Qwen CLI for help in development

### Skills

Skills taken from https://github.com/vuejs-ai/skills

This project includes specialized skills for Vue.js development:

| Skill | Description |
|-------|-------------|
| **vue-best-practices** | Vue 3 best practices with Composition API, `<script setup>`, and TypeScript. Use for any Vue, `.vue` files, Vue Router, Pinia, or Vite with Vue work. |
| **vue-pinia-best-practices** | Pinia stores, state management patterns, store setup, and reactivity with stores. |
| **vue-router-best-practices** | Vue Router 4 patterns, navigation guards, route params, and route-component lifecycle interactions. |
| **vue-testing-best-practices** | Vue.js testing with Vitest, Vue Test Utils, component testing, mocking, testing patterns, and Playwright for E2E testing. |
| **vue-debug-guides** | Vue 3 debugging and error handling for runtime errors, warnings, async failures, and SSR/hydration issues. |
| **create-adaptable-composable** | Create library-grade Vue composables with `MaybeRef`/`MaybeRefOrGetter` inputs for flexible reactive behavior. |

### Usage

Skills are automatically available when working with relevant files. For example:

- Editing a `.vue` file → `vue-best-practices` is applied
- Working with Pinia stores → `vue-pinia-best-practices` is loaded
- Writing tests → `vue-testing-best-practices` provides guidance

For best result use in prompt: "Use vue skill, <Your Prompt>"
