<script setup>
defineProps({
  title: String,
  value: [String, Number],
  subtitle: String,
})
</script>

<template>
  <div
    class="rounded-2xl border border-gray-200 bg-white p-8 shadow-sm transition hover:-translate-y-0.5 hover:shadow-md"
  >
    <p class="text-base font-medium text-gray-500">{{ title }}</p>
    <h3 class="mt-4 text-3xl font-bold tracking-tight text-gray-900">{{ value }}</h3>
    <p v-if="subtitle" class="mt-3 text-sm text-gray-500">
      {{ subtitle }}
    </p>
  </div>
</template>