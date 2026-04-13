<script setup>
import { computed } from 'vue'
import {
  Chart as ChartJS,
  Title,
  Tooltip,
  Legend,
  BarElement,
  CategoryScale,
  LinearScale,
} from 'chart.js'
import { Bar } from 'vue-chartjs'

ChartJS.register(
  Title,
  Tooltip,
  Legend,
  BarElement,
  CategoryScale,
  LinearScale
)

const props = defineProps({
  users: {
    type: Array,
    default: () => [],
  },
})

const chartData = computed(() => {
  const cohortTotals = {}

  props.users.forEach((user) => {
    const cohort = user.cohort || 'Unknown'
    const amount = Number(String(user.totalPaid || '0').replace(/[₦,]/g, ''))

    if (!cohortTotals[cohort]) {
      cohortTotals[cohort] = 0
    }

    cohortTotals[cohort] += amount
  })

  return {
    labels: Object.keys(cohortTotals),
    datasets: [
      {
        label: 'Revenue',
        data: Object.values(cohortTotals),
        backgroundColor: [
          '#6366f1',
          '#8b5cf6',
          '#06b6d4',
          '#14b8a6',
        ],
        borderRadius: 8,
      },
    ],
  }
})

const chartOptions = {
  responsive: true,
  maintainAspectRatio: false,
  plugins: {
    legend: {
      display: true,
      position: 'top',
    },
    title: {
      display: false,
    },
  },
}
</script>

<template>
  <div class="rounded-2xl border border-gray-200 bg-white p-6 shadow-sm">
    <div class="mb-4">
      <h3 class="text-lg font-semibold text-gray-900">Revenue Overview</h3>
      <p class="mt-1 text-sm text-gray-500">
        Revenue grouped by cohort
      </p>
    </div>

    <div class="h-80">
      <Bar :data="chartData" :options="chartOptions" />
    </div>
  </div>
</template>