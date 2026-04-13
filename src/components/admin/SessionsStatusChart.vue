<script setup>
import { computed } from 'vue'
import {
  Chart as ChartJS,
  Title,
  Tooltip,
  Legend,
  ArcElement,
} from 'chart.js'
import { Doughnut } from 'vue-chartjs'

ChartJS.register(Title, Tooltip, Legend, ArcElement)

const props = defineProps({
  sessions: {
    type: Array,
    default: () => [],
  },
})

const chartData = computed(() => {
  const counts = {
    scheduled: 0,
    live: 0,
    completed: 0,
    cancelled: 0,
  }

  props.sessions.forEach((session) => {
    const status = session.status?.toLowerCase()
    if (counts[status] !== undefined) {
      counts[status]++
    }
  })

  return {
    labels: ['Scheduled', 'Live', 'Completed', 'Cancelled'],
    datasets: [
      {
        data: [
          counts.scheduled,
          counts.live,
          counts.completed,
          counts.cancelled,
        ],
        backgroundColor: ['#6366f1', '#22c55e', '#06b6d4', '#ef4444'],
        borderWidth: 0,
      },
    ],
  }
})

const chartOptions = {
  responsive: true,
  maintainAspectRatio: false,
  plugins: {
    legend: {
      position: 'bottom',
    },
  },
}
</script>

<template>
  <div class="rounded-2xl border border-gray-200 bg-white p-6 shadow-sm">
    <div class="mb-4">
      <h3 class="text-lg font-semibold text-gray-900">Sessions by Status</h3>
      <p class="mt-1 text-sm text-gray-500">
        Monitor current live session activity
      </p>
    </div>

    <div class="h-80">
      <Doughnut :data="chartData" :options="chartOptions" />
    </div>
  </div>
</template>