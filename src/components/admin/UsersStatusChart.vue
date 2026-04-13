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
  const paymentCounts = {
    'fully paid': 0,
    partial: 0,
    unpaid: 0,
  }

  props.users.forEach((user) => {
    const status = user.paymentStatus?.toLowerCase()
    if (paymentCounts[status] !== undefined) {
      paymentCounts[status]++
    }
  })

  return {
    labels: ['Fully Paid', 'Partial', 'Unpaid'],
    datasets: [
      {
        label: 'Users',
        data: [
          paymentCounts['fully paid'],
          paymentCounts.partial,
          paymentCounts.unpaid,
        ],
        backgroundColor: ['#22c55e', '#f59e0b', '#ef4444'],
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
      display: false,
    },
  },
}
</script>

<template>
  <div class="rounded-2xl border border-gray-200 bg-white p-6 shadow-sm">
    <div class="mb-4">
      <h3 class="text-lg font-semibold text-gray-900">Users by Payment Status</h3>
      <p class="mt-1 text-sm text-gray-500">
        Quick view of payment completion across users
      </p>
    </div>

    <div class="h-80">
      <Bar :data="chartData" :options="chartOptions" />
    </div>
  </div>
</template>