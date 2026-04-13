<script setup>
defineProps({
  title: String,
  subtitle: String,
  buttonText: String,
  secondaryButtonText: String,
})

defineEmits(['action'])
</script>

<template>
  <div class="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
    <div>
      <h1 class="text-2xl font-bold text-gray-900">{{ title }}</h1>
      <p v-if="subtitle" class="mt-1 text-sm text-gray-500">
        {{ subtitle }}
      </p>
    </div>

    <div class="flex flex-wrap gap-3">
     <button
        v-if="secondaryButtonText"
        @click="$emit('secondaryAction')"
        class="rounded-lg bg-green-400 px-4 py-2 text-sm font-medium text-white hover:bg-green-600"
      >
        {{ secondaryButtonText }}
      </button>

      <button
        v-if="buttonText"
        @click="$emit('action')"
        class="rounded-lg bg-indigo-600 px-4 py-2 text-sm font-medium text-white hover:bg-indigo-700"
      >
        {{ buttonText }}
      </button>
    </div>
  </div>
</template>