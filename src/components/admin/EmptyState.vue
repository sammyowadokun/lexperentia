<script setup>
defineProps({
  title: {
    type: String,
    default: 'No data found',
  },
  message: {
    type: String,
    default: 'There is nothing to display right now.',
  },
})
</script>

<template>
  <div class="rounded-xl border border-dashed border-gray-300 bg-white p-8 text-center">
    <h3 class="text-lg font-semibold text-gray-800">{{ title }}</h3>
    <p class="mt-2 text-sm text-gray-500">{{ message }}</p>
  </div>
</template>