<script setup>
import { ref, computed, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import PageHeader from '../../../components/admin/PageHeader.vue'
import SearchInput from '../../../components/admin/SearchInput.vue'
import FilterSelect from '../../../components/admin/FilterSelect.vue'
import DataTable from '../../../components/admin/DataTable.vue'
import StatusBadge from '../../../components/admin/StatusBadge.vue'
import { useReferralStore } from '../../../stores/useReferralStore'
import { exportToCSV } from '../../../utils/exportToCSV'

const referralStore = useReferralStore()

const search = ref('')
const cohortFilter = ref('')
const paymentFilter = ref('')
const router = useRouter()

const handleExportReferrals = () => {
  const rowsToExport = filteredReferrals.value.map((item) => ({
    ReferrerName: item.referrerName,
    ReferrerEmail: item.referrerEmail,
    Cohort: item.cohort,
    TotalSignUps: item.totalSignUps,
    PaidReferrals: item.paidReferrals,
    UnpaidReferrals: item.unpaidReferrals,
    RevenueAttributed: item.totalRevenueAttributed,
    PaymentStatus: item.paymentStatus,
  }))

  exportToCSV('referrals-report.csv', rowsToExport)
}

const cohortOptions = [
  { label: 'Cohort 1', value: 'Cohort 1' },
  { label: 'Cohort 2', value: 'Cohort 2' },
  { label: 'Cohort 3', value: 'Cohort 3' },
]

const paymentOptions = [
  { label: 'Paid', value: 'paid' },
  { label: 'Partial', value: 'partial' },
  { label: 'Mixed', value: 'mixed' },
]

const columns = [
  { label: 'Referrer Name', key: 'referrerName' },
  { label: 'Referrer Email', key: 'referrerEmail' },
  { label: 'Cohort', key: 'cohort' },
  { label: 'Total Referral Sign-ups', key: 'totalSignUps' },
  { label: 'Paid Referrals', key: 'paidReferrals' },
  { label: 'Unpaid Referrals', key: 'unpaidReferrals' },
  { label: 'Revenue Attributed', key: 'totalRevenueAttributed' },
  { label: 'Payment Status', key: 'paymentStatus' },
  { label: 'Actions', key: 'actions' },
]

const filteredReferrals = computed(() => {
  return referralStore.referrals.filter((item) => {
    const matchesSearch =
      item.referrerName.toLowerCase().includes(search.value.toLowerCase()) ||
      item.referrerEmail.toLowerCase().includes(search.value.toLowerCase())

    const matchesCohort =
      !cohortFilter.value || item.cohort === cohortFilter.value

    const matchesPayment =
      !paymentFilter.value || item.paymentStatus.toLowerCase() === paymentFilter.value

    return matchesSearch && matchesCohort && matchesPayment
  })
})

const handleViewReferral = (row) => {
  router.push(`/admin/referrals/${row.id}`)
}
  
onMounted(() => {
  if (!referralStore.referrals.length) {
    referralStore.fetchReferrals()
  }
})
</script>

<template>
  <section class="space-y-6 p-6">
    <PageHeader
      title="Referral Management"
      subtitle="Monitor referral sign-ups, paid conversions, and attributed revenue."
      buttonText="Export CSV"
      @action="handleExportReferrals"
      class="rounded-xl border border-gray-300 px-10 py-10 text-xs 
            font-medium text-gray-700 bg-slate-50 shadow-md"
      />

    <div class="grid gap-4 rounded-xl bg-white p-4 shadow-sm md:grid-cols-3">
      <SearchInput
        v-model="search"
        placeholder="Search by referrer name or email"
      />

      <FilterSelect
        v-model="cohortFilter"
        label="Cohort"
        :options="cohortOptions"
      />

      <FilterSelect
        v-model="paymentFilter"
        label="Payment Status"
        :options="paymentOptions"
      />
    </div>

    <DataTable
      :columns="columns"
      :rows="filteredReferrals"
      :loading="referralStore.loading"
    >
      <template #paymentStatus="{ row }">
        <StatusBadge :status="row.paymentStatus" />
      </template>

      <template #actions="{ row }">
        <button
          @click="handleViewReferral(row)"
          class="rounded-md border border-gray-300 px-3 py-1 text-xs font-medium text-gray-700 hover:bg-gray-50"
        >
          View
        </button>
      </template>
    </DataTable>
  </section>
</template>