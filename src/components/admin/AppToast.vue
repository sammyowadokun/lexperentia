<script setup>
import { computed } from 'vue'
import { useToastStore } from '../../stores/useToastStore'

const toastStore = useToastStore()

const toastClass = computed(() => {
  if (toastStore.type === 'error') {
    return 'border-red-200 bg-red-50 text-red-700'
  }

  if (toastStore.type === 'warning') {
    return 'border-yellow-200 bg-yellow-50 text-yellow-700'
  }

  return 'border-green-200 bg-green-50 text-green-700'
})
</script>

<template>
  <transition
    enter-active-class="transition duration-300 ease-out"
    enter-from-class="translate-y-2 opacity-0"
    enter-to-class="translate-y-0 opacity-100"
    leave-active-class="transition duration-200 ease-in"
    leave-from-class="translate-y-0 opacity-100"
    leave-to-class="translate-y-2 opacity-0"
  >
    <div
        v-if="toastStore.show"
        class="fixed right-6 top-6 z-1000 min-w-260px rounded-xl border px-4 py-3 shadow-lg flex items-center gap-2"
        :class="toastClass"
        >
        <span class="text-lg">✔</span>
        <p class="text-sm font-medium">{{ toastStore.message }}</p>
    </div>
  </transition>
</template>