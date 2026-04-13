<script setup>
import { computed, ref } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { useUserStore } from '../../../stores/useUserStore'
import StatusBadge from '../../../components/admin/StatusBadge.vue'
import ConfirmModal from '../../../components/admin/ConfirmModal.vue'

const route = useRoute()
const router = useRouter()
const userStore = useUserStore()

const disableReason = ref('')
const disableNote = ref('')

const isDisableModalOpen = ref(false)

const userId = computed(() => Number(route.params.id))

const user = computed(() => {
  return userStore.users.find((item) => item.id === userId.value)
})

const resetDisableForm = () => {
  disableReason.value = ''
  disableNote.value = ''
}

const goBack = () => {
  router.push('/admin/users')
}

const openDisableModal = () => {
  isDisableModalOpen.value = true
}

const closeDisableModal = () => {
  isDisableModalOpen.value = false
  resetDisableForm()
}

const confirmDisableAccess = () => {
  userStore.disableUserAccess(userId.value, disableReason.value, disableNote.value)
  isDisableModalOpen.value = false
  resetDisableForm()
}

const handleReEnableAccess = () => {
  userStore.reEnableUserAccess(userId.value)
}
</script>

<template>
  <section class="space-y-6 p-6">
    <div class="flex items-center justify-between">
      <div>
        <button
          @click="goBack"
          class="mb-3 text-sm font-bold text-indigo-600 hover:underline"
        >
          ← Back to Users
        </button>

        <h1 class="text-2xl font-bold text-gray-900">User Profile</h1>
        <p class="mt-1 text-sm text-gray-500">
          View user details, payment status, attendance, and admin actions.
        </p>
      </div>
    </div>

    <div
      v-if="user"
      class="grid gap-6 lg:grid-cols-3"
    >
      <div class="space-y-6 lg:col-span-2">
        <div class="rounded-xl border border-gray-200 bg-white p-6 shadow-sm">
          <h2 class="text-lg font-semibold text-gray-900">Profile Details</h2>

          <div class="mt-4 grid gap-4 sm:grid-cols-2">
            <div>
              <p class="text-xs font-medium uppercase tracking-wide text-gray-500">Full Name</p>
              <p class="mt-1 text-sm text-gray-900">{{ user.name }}</p>
            </div>

            <div>
              <p class="text-xs font-medium uppercase tracking-wide text-gray-500">Email</p>
              <p class="mt-1 text-sm text-gray-900">{{ user.email }}</p>
            </div>

            <div>
              <p class="text-xs font-medium uppercase tracking-wide text-gray-500">Role</p>
              <p class="mt-1 text-sm capitalize text-gray-900">{{ user.role }}</p>
            </div>

            <div>
              <p class="text-xs font-medium uppercase tracking-wide text-gray-500">Programme</p>
              <p class="mt-1 text-sm text-gray-900">{{ user.programme }}</p>
            </div>

            <div>
              <p class="text-xs font-medium uppercase tracking-wide text-gray-500">Cohort</p>
              <p class="mt-1 text-sm text-gray-900">{{ user.cohort }}</p>
            </div>

            <div>
              <p class="text-xs font-medium uppercase tracking-wide text-gray-500">Date Registered</p>
              <p class="mt-1 text-sm text-gray-900">{{ user.dateRegistered || '—' }}</p>
            </div>
          </div>
        </div>

        <div class="rounded-xl border border-gray-200 bg-white p-6 shadow-sm">
          <h2 class="text-lg font-semibold text-gray-900">Payment History</h2>

          <div class="mt-4 grid gap-4 sm:grid-cols-2">
            <div>
              <p class="text-xs font-medium uppercase tracking-wide text-gray-500">Instalment 1</p>
              <p class="mt-1 text-sm text-gray-900">{{ user.instalment1Amount || '—' }}</p>
            </div>

            <div>
              <p class="text-xs font-medium uppercase tracking-wide text-gray-500">Instalment 1 Date</p>
              <p class="mt-1 text-sm text-gray-900">{{ user.instalment1Date || '—' }}</p>
            </div>

            <div>
              <p class="text-xs font-medium uppercase tracking-wide text-gray-500">Instalment 2</p>
              <p class="mt-1 text-sm text-gray-900">{{ user.instalment2Amount || '—' }}</p>
            </div>

            <div>
              <p class="text-xs font-medium uppercase tracking-wide text-gray-500">Instalment 2 Date</p>
              <p class="mt-1 text-sm text-gray-900">{{ user.instalment2Date || '—' }}</p>
            </div>

            <div>
              <p class="text-xs font-medium uppercase tracking-wide text-gray-500">Total Paid</p>
              <p class="mt-1 text-sm text-gray-900">{{ user.totalPaid || '—' }}</p>
            </div>

            <div>
              <p class="text-xs font-medium uppercase tracking-wide text-gray-500">Outstanding Balance</p>
              <p class="mt-1 text-sm text-gray-900">{{ user.outstandingBalance || '—' }}</p>
            </div>
          </div>
        </div>

        <div class="rounded-xl border border-gray-200 bg-white p-6 shadow-sm">
          <h2 class="text-lg font-semibold text-gray-900">Attendance & Certificate</h2>

          <div class="mt-4 grid gap-4 sm:grid-cols-2">
            <div>
              <p class="text-xs font-medium uppercase tracking-wide text-gray-500">Attendance</p>
              <p class="mt-1 text-sm text-gray-900">
                {{ user.sessionsAttended || 0 }} / {{ user.totalSessions || 0 }} sessions
              </p>
            </div>

            <div>
              <p class="text-xs font-medium uppercase tracking-wide text-gray-500">Certificate Status</p>
              <p class="mt-1 text-sm text-gray-900">{{ user.certificateStatus || 'Not started' }}</p>
            </div>

            <div class="sm:col-span-2">
              <p class="text-xs font-medium uppercase tracking-wide text-gray-500">Referral Record</p>
              <p class="mt-1 text-sm text-gray-900">
                Referred by: {{ user.referredBy || '—' }} |
                Referrals made: {{ user.referralsMade || 0 }}
              </p>
            </div>
          </div>
        </div>
      </div>

      <div class="space-y-6">
        <div class="rounded-xl border border-gray-200 bg-white p-6 shadow-sm">
          <h2 class="text-lg font-semibold text-gray-900">Status Summary</h2>

          <div class="mt-4 space-y-4">
            <div>
              <p class="mb-2 text-xs font-medium uppercase tracking-wide text-gray-500">Payment Status</p>
              <StatusBadge :status="user.paymentStatus" />
            </div>

            <div>
              <p class="mb-2 text-xs font-medium uppercase tracking-wide text-gray-500">Enrolment Status</p>
              <StatusBadge :status="user.enrolmentStatus" />
            </div>
          </div>
        </div>

        <div
            v-if="user.enrolmentStatus === 'disabled'"
            class="rounded-xl border border-red-200 bg-red-50 p-4"
        >
            <h3 class="text-sm font-semibold text-red-700">Access Disabled Info</h3>

            <p class="mt-2 text-sm text-gray-700">
                <span class="font-medium">Reason:</span>
                {{ user.accessDisabledReason || '—' }}
            </p>

            <p class="mt-1 text-sm text-gray-700">
                <span class="font-medium">Note:</span>
                {{ user.accessDisabledNote || '—' }}
            </p>
        </div>

        <div class="rounded-xl border border-gray-200 bg-white p-6 shadow-sm">
          <h2 class="text-lg font-semibold text-gray-900">Admin Actions</h2>

          <div class="mt-4 space-y-3">
            <button
              @click="openDisableModal"
              class="w-full rounded-lg bg-red-600 px-4 py-2 text-sm font-medium text-white hover:bg-red-700"
            >
              Disable Access
            </button>

            <button
              @click="handleReEnableAccess"
              class="w-full rounded-lg border border-gray-300 px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50"
            >
              Re-enable Access
            </button>

            <button class="w-full rounded-lg border border-gray-300 px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50">
              Mark Payment Received
            </button>

            <button class="w-full rounded-lg border border-gray-300 px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50">
              Approve Certificate
            </button>

            <button class="w-full rounded-lg border border-red-300 px-4 py-2 text-sm font-medium text-red-600 hover:bg-red-50">
              Delete Account
            </button>
          </div>
        </div>
      </div>
    </div>

    <div
      v-else
      class="rounded-xl border border-dashed border-gray-300 bg-white p-8 text-center"
    >
      <h3 class="text-lg font-semibold text-gray-800">User not found</h3>
      <p class="mt-2 text-sm text-gray-500">This user does not exist in the current data.</p>
    </div>

    <ConfirmModal
        :open="isDisableModalOpen"
        title="Disable User Access"
        message="Complete the details below before disabling access."
        confirmText="Disable Access"
        cancelText="Cancel"
        @close="closeDisableModal"
        @confirm="confirmDisableAccess"
    >
        <div class="space-y-4">
            <div>
            <label class="mb-1 block text-sm font-medium text-gray-700">Reason</label>
            <select
                v-model="disableReason"
                class="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm"
            >
                <option value="">Select reason</option>
                <option value="Incomplete Payment">Incomplete Payment</option>
                <option value="Other">Other</option>
            </select>
            </div>

            <div>
            <label class="mb-1 block text-sm font-medium text-gray-700">Note (optional)</label>
            <textarea
                v-model="disableNote"
                rows="3"
                class="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm"
                placeholder="Add an admin note..."
            />
            </div>
        </div>
    </ConfirmModal>
  </section>
</template> 