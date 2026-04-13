<script setup>
import { computed } from 'vue'

const props = defineProps({
  status: {
    type: String,
    required: true,
  },
})

const badgeClass = computed(() => {
  switch (props.status?.toLowerCase()) {
    case 'active':
    case 'fully paid':
    case 'published':
    case 'issued':
    case 'completed':
      return 'bg-green-100 text-green-700'
    case 'partial':
    case 'pending':
    case 'draft':
    case 'in progress':
      return 'bg-yellow-100 text-yellow-700'
    case 'disabled':
    case 'unpaid':
    case 'revoked':
    case 'cancelled':
      return 'bg-red-100 text-red-700'
    default:
      return 'bg-gray-100 text-gray-700'
  }
})
</script>

<template>
  <span
    class="inline-flex rounded-full px-3 py-1 text-xs font-semibold capitalize"
    :class="badgeClass"
  >
    {{ status }}
  </span>
</template>