<script setup>
defineProps({
  open: Boolean,
  title: String,
  message: String,
  confirmText: {
    type: String,
    default: 'Confirm',
  },
  cancelText: {
    type: String,
    default: 'Cancel',
  },
})

defineEmits(['close', 'confirm'])
</script>

<template>
  <div
    v-if="open"
    class="fixed inset-0 z-50 flex items-center justify-center bg-black/50 px-4"
  >
    <div class="w-full max-w-md rounded-xl bg-white p-6 shadow-lg">
      <h2 class="text-lg font-bold text-gray-900">{{ title }}</h2>
      <p class="mt-2 text-sm text-gray-600">{{ message }}</p>

      <div class="mt-6 flex justify-end gap-3">
        <button
          @click="$emit('close')"
          class="rounded-lg border border-gray-300 px-4 py-2 text-sm text-gray-700 hover:bg-gray-50"
        >
          {{ cancelText }}
        </button>

        <button
          @click="$emit('confirm')"
          class="rounded-lg bg-red-600 px-4 py-2 text-sm font-medium text-white hover:bg-red-700"
        >
          {{ confirmText }}
        </button>
      </div>
    </div>
  </div>
</template>