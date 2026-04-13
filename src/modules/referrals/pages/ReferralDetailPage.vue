<script setup>
import { computed, onMounted } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { useReferralStore } from '../../../stores/useReferralStore'
import StatusBadge from '../../../components/admin/StatusBadge.vue'

const route = useRoute()
const router = useRouter()
const referralStore = useReferralStore()

const referralId = computed(() => Number(route.params.id))

const referral = computed(() => {
  return referralStore.referrals.find((item) => item.id === referralId.value)
})

const goBack = () => {
  router.push('/admin/referrals')
}

onMounted(() => {
  if (!referralStore.referrals.length) {
    referralStore.fetchReferrals()
  }
})
</script>

<template>
  <section class="space-y-6 p-6">
    <button
      @click="goBack"
      class="text-sm font-bold text-indigo-600 hover:underline"
    >
      ← Back to Referrals
    </button>

    <div
      v-if="referral"
      class="space-y-6"
    >
      <div class="rounded-xl border border-gray-200 bg-white p-6 shadow-sm">
        <h1 class="text-2xl font-bold text-gray-900">{{ referral.referrerName }}</h1>
        <p class="mt-2 text-sm text-gray-500">{{ referral.referrerEmail }}</p>

        <div class="mt-4">
          <StatusBadge :status="referral.paymentStatus" />
        </div>
      </div>

      <div class="grid gap-6 md:grid-cols-2">
        <div class="rounded-xl border border-gray-200 bg-white p-6 shadow-sm">
          <h2 class="text-lg font-semibold text-gray-900">Referral Summary</h2>

          <div class="mt-4 space-y-3 text-sm text-gray-700">
            <p><span class="font-medium">Cohort:</span> {{ referral.cohort }}</p>
            <p><span class="font-medium">Total Sign-ups:</span> {{ referral.totalSignUps }}</p>
            <p><span class="font-medium">Paid Referrals:</span> {{ referral.paidReferrals }}</p>
            <p><span class="font-medium">Unpaid Referrals:</span> {{ referral.unpaidReferrals }}</p>
            <p><span class="font-medium">Revenue Attributed:</span> {{ referral.totalRevenueAttributed }}</p>
          </div>
        </div>

        <div class="rounded-xl border border-gray-200 bg-white p-6 shadow-sm">
          <h2 class="text-lg font-semibold text-gray-900">Overview</h2>

          <div class="mt-4 space-y-3 text-sm text-gray-700">
            <p><span class="font-medium">Referrer:</span> {{ referral.referrerName }}</p>
            <p><span class="font-medium">Email:</span> {{ referral.referrerEmail }}</p>
            <p><span class="font-medium">Payment Mix:</span> {{ referral.paymentStatus }}</p>
          </div>
        </div>
      </div>

      <div class="rounded-xl border border-gray-200 bg-white p-6 shadow-sm">
        <h2 class="text-lg font-semibold text-gray-900">Referred Users</h2>

        <div v-if="referral.referredUsers?.length" class="mt-4 space-y-4">
          <div
            v-for="user in referral.referredUsers"
            :key="user.id"
            class="flex items-center justify-between rounded-lg border border-gray-200 p-4"
          >
            <div>
              <p class="font-medium text-gray-900">{{ user.name }}</p>
              <p class="text-sm text-gray-500">{{ user.email }}</p>
            </div>

            <StatusBadge :status="user.paymentStatus" />
          </div>
        </div>

        <div v-else class="mt-4 text-sm text-gray-500">
          No referred users found.
        </div>
      </div>
    </div>

    <div
      v-else
      class="rounded-xl border border-dashed border-gray-300 bg-white p-8 text-center"
    >
      <h3 class="text-lg font-semibold text-gray-800">Referral record not found</h3>
      <p class="mt-2 text-sm text-gray-500">This referral record does not exist in the current data.</p>
    </div>
  </section>
</template>