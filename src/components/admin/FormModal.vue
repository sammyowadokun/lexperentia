<script setup>
defineProps({
  open: Boolean,
  title: String,
  submitText: {
    type: String,
    default: 'Save',
  },
  cancelText: {
    type: String,
    default: 'Cancel',
  },
})

defineEmits(['close', 'submit'])
</script>

<template>
  <div
    v-if="open"
    class="fixed inset-0 z-50 flex items-center justify-center bg-black/50 px-4"
  >
    <div class="w-full max-w-2xl rounded-xl bg-white p-6 shadow-lg">
      <div class="flex items-center justify-between">
        <h2 class="text-lg font-bold text-gray-900">{{ title }}</h2>
        <button
          @click="$emit('close')"
          class="text-sm text-gray-500 hover:text-gray-700"
        >
          ✕
        </button>
      </div>

      <div class="mt-4">
        <slot />
      </div>

      <div class="mt-6 flex justify-end gap-3">
        <button
          @click="$emit('close')"
          class="rounded-lg border border-gray-300 px-4 py-2 text-sm text-gray-700 hover:bg-gray-50"
        >
          {{ cancelText }}
        </button>

        <button
          @click="$emit('submit')"
          class="rounded-lg bg-indigo-600 px-4 py-2 text-sm font-medium text-white hover:bg-indigo-700"
        >
          {{ submitText }}
        </button>
      </div>
    </div>
  </div>
</template>