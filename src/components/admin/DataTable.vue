<script setup>
import EmptyState from './EmptyState.vue'

defineProps({
  columns: {
    type: Array,
    default: () => [],
  },
  rows: {
    type: Array,
    default: () => [],
  },
  loading: Boolean,
})
</script>

<template>
  <div class="overflow-hidden rounded-xl border border-gray-200 bg-white shadow-sm">
    <div v-if="loading" class="p-6 text-sm text-gray-500">Loading...</div>

    <template v-else-if="rows.length">
      <div class="overflow-x-auto">
        <table class="min-w-full divide-y divide-gray-200">
          <thead class="bg-gray-50">
            <tr>
              <th
                v-for="column in columns"
                :key="column.key"
                class="px-6 py-3 text-left text-xs font-semibold uppercase tracking-wider text-gray-500"
              >
                {{ column.label }}
              </th>
            </tr>
          </thead>

          <tbody class="divide-y divide-gray-100 bg-white">
            <tr
              v-for="row in rows"
              :key="row.id"
              class="hover:bg-gray-50"
            >
              <td
                v-for="column in columns"
                :key="column.key"
                class="whitespace-nowrap px-6 py-4 text-sm text-gray-700"
              >
                <slot
                  :name="column.key"
                  :row="row"
                >
                  {{ row[column.key] }}
                </slot>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </template>

    <div v-else class="p-6">
      <EmptyState />
    </div>
  </div>
</template>