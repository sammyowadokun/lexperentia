<script setup>
import { computed } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { useCohortStore } from '../../../stores/useCohortStore'
import StatusBadge from '../../../components/admin/StatusBadge.vue'

const route = useRoute()
const router = useRouter()
const cohortStore = useCohortStore()

const cohortId = computed(() => Number(route.params.id))

const cohort = computed(() => {
  return cohortStore.cohorts.find((item) => item.id === cohortId.value)
})

const goBack = () => {
  router.push('/admin/cohorts')
}
</script>

<template>
  <section class="space-y-6 p-6">
    <button
      @click="goBack"
      class="text-sm font-bold text-indigo-600 hover:underline"
    >
      ← Back to Cohorts
    </button>

    <div
      v-if="cohort"
      class="space-y-6"
    >
      <div class="rounded-xl border border-gray-200 bg-white p-6 shadow-sm">
        <h1 class="text-2xl font-bold text-gray-900">{{ cohort.name }}</h1>
        <p class="mt-2 text-sm text-gray-500">
          {{ cohort.programmeType }}
        </p>

        <div class="mt-4">
          <StatusBadge :status="cohort.status" />
        </div>
      </div>

      <div class="grid gap-6 md:grid-cols-2">
        <div class="rounded-xl border border-gray-200 bg-white p-6 shadow-sm">
          <h2 class="text-lg font-semibold text-gray-900">Cohort Details</h2>

          <div class="mt-4 space-y-3 text-sm text-gray-700">
            <p><span class="font-medium">Start Date:</span> {{ cohort.startDate }}</p>
            <p><span class="font-medium">End Date:</span> {{ cohort.endDate }}</p>
            <p><span class="font-medium">Capacity:</span> {{ cohort.capacity }}</p>
            <p><span class="font-medium">Students Count:</span> {{ cohort.studentsCount }}</p>
            <p><span class="font-medium">Revenue:</span> {{ cohort.revenue }}</p>
          </div>
        </div>

        <div class="rounded-xl border border-gray-200 bg-white p-6 shadow-sm">
          <h2 class="text-lg font-semibold text-gray-900">Summary</h2>

          <div class="mt-4 space-y-3 text-sm text-gray-700">
            <p><span class="font-medium">Scheduled Sessions:</span> 0</p>
            <p><span class="font-medium">Certificate Eligible:</span> 0</p>
            <p><span class="font-medium">Attendance Summary:</span> Coming next</p>
          </div>
        </div>
      </div>
    </div>

    <div
      v-else
      class="rounded-xl border border-dashed border-gray-300 bg-white p-8 text-center"
    >
      <h3 class="text-lg font-semibold text-gray-800">Cohort not found</h3>
      <p class="mt-2 text-sm text-gray-500">This cohort does not exist in the current data.</p>
    </div>
  </section>
</template>