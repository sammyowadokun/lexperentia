<script setup>
import { ref, computed, onMounted } from 'vue'
import PageHeader from '../../../components/admin/PageHeader.vue'
import SearchInput from '../../../components/admin/SearchInput.vue'
import FilterSelect from '../../../components/admin/FilterSelect.vue'
import DataTable from '../../../components/admin/DataTable.vue'
import StatusBadge from '../../../components/admin/StatusBadge.vue'
import ConfirmModal from '../../../components/admin/ConfirmModal.vue'
import { useUserStore } from '../../../stores/useUserStore'
import { exportToCSV } from '../../../utils/exportToCSV'

const userStore = useUserStore()

const selectedRows = ref([])

const search = ref('')
const cohortFilter = ref('')
const paymentFilter = ref('')

const isModalOpen = ref(false)
const selectedUserId = ref(null)
const actionType = ref('')

const handleExportPayments = () => {
  const rowsToExport = filteredPayments.value.map((user) => ({
    UserName: user.name,
    Email: user.email,
    Programme: user.programme,
    Cohort: user.cohort,
    Instalment1Amount: user.instalment1Amount,
    Instalment1Date: user.instalment1Date,
    Instalment2Amount: user.instalment2Amount,
    Instalment2Date: user.instalment2Date,
    TotalPaid: user.totalPaid,
    BalanceOutstanding: user.outstandingBalance,
    PaymentStatus: user.paymentStatus,
    AccessStatus: user.enrolmentStatus,
  }))

  exportToCSV('payments-report.csv', rowsToExport)
}

const cohortOptions = [
  { label: 'Cohort 1', value: 'Cohort 1' },
  { label: 'Cohort 2', value: 'Cohort 2' },
  { label: 'Cohort 3', value: 'Cohort 3' },
]

const paymentOptions = [
  { label: 'Fully Paid', value: 'fully paid' },
  { label: 'Partial', value: 'partial' },
  { label: 'Unpaid', value: 'unpaid' },
]

const columns = [
  { label: '', key: 'select' },
  { label: 'User Name', key: 'name' },
  { label: 'Email', key: 'email' },
  { label: 'Programme', key: 'programme' },
  { label: 'Cohort', key: 'cohort' },
  { label: 'Instalment 1 Amount', key: 'instalment1Amount' },
  { label: 'Instalment 1 Date', key: 'instalment1Date' },
  { label: 'Instalment 2 Amount', key: 'instalment2Amount' },
  { label: 'Instalment 2 Date', key: 'instalment2Date' },
  { label: 'Total Paid', key: 'totalPaid' },
  { label: 'Balance Outstanding', key: 'outstandingBalance' },
  { label: 'Payment Status', key: 'paymentStatus' },
  { label: 'Access Status', key: 'enrolmentStatus' },
  { label: 'Actions', key: 'actions' },
]

const filteredPayments = computed(() => {
  return userStore.users.filter((user) => {
    const matchesSearch =
      user.name.toLowerCase().includes(search.value.toLowerCase()) ||
      user.email.toLowerCase().includes(search.value.toLowerCase())

    const matchesCohort =
      !cohortFilter.value || user.cohort === cohortFilter.value

    const matchesPayment =
      !paymentFilter.value || user.paymentStatus.toLowerCase() === paymentFilter.value

    return matchesSearch && matchesCohort && matchesPayment
  })
})

onMounted(() => {
  if (!userStore.users.length) {
    userStore.fetchUsers()
  }
})

const toggleRowSelection = (id) => {
  if (selectedRows.value.includes(id)) {
    selectedRows.value = selectedRows.value.filter((rowId) => rowId !== id)
  } else {
    selectedRows.value.push(id)
  }
}

const toggleSelectAll = () => {
  const currentIds = filteredPayments.value.map((user) => user.id)

  const allSelected = currentIds.every((id) => selectedRows.value.includes(id))

  if (allSelected) {
    selectedRows.value = selectedRows.value.filter((id) => !currentIds.includes(id))
  } else {
    selectedRows.value = [...new Set([...selectedRows.value, ...currentIds])]
  }
}

const isRowSelected = (id) => {
  return selectedRows.value.includes(id)
}

const openActionModal = (id, type) => {
  selectedUserId.value = id
  actionType.value = type
  isModalOpen.value = true
}

const closeModal = () => {
  isModalOpen.value = false
  selectedUserId.value = null
  actionType.value = ''
}

const confirmAction = () => {
  if (actionType.value === 'disable') {
    userStore.disableUserAccess(
      selectedUserId.value,
      'Incomplete Payment',
      'Disabled from payment page'
    )
  }

  if (actionType.value === 'markPaid') {
    userStore.markPaymentReceived(selectedUserId.value)
  }

  closeModal()
}

const handleReEnableAccess = (id) => {
  userStore.reEnableUserAccess(id)
}

const handleBulkDisable = () => {
  selectedRows.value.forEach((id) => {
    userStore.disableUserAccess(id, 'Incomplete Payment', 'Bulk disabled from payment page')
  })
  selectedRows.value = []
}

const handleBulkMarkPaid = () => {
  selectedRows.value.forEach((id) => {
    userStore.markPaymentReceived(id)
  })
  selectedRows.value = []
}
</script>

<template>
  <section class="space-y-6 p-6">
    <PageHeader
      title="Payment Management"
      subtitle="Track instalments, balances, and course access across all users."
      buttonText="Export CSV"
      @action="handleExportPayments"
      class="rounded-xl px-10 py-10 text-xs border border-gray-300
            font-medium text-gray-700 bg-slate-50 shadow-md"    
    />

    <div class="grid gap-4 rounded-xl bg-white p-4 shadow-sm md:grid-cols-3">
      <SearchInput
        v-model="search"
        placeholder="Search by user name or email"
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

    <div
        v-if="filteredPayments.length"
        class="flex flex-col gap-3 rounded-xl border border-gray-200 bg-white p-4 shadow-sm md:flex-row md:items-center md:justify-between"
    >
        <div class="flex items-center gap-3">
            <label class="flex items-center gap-2 text-sm text-gray-700">
            <input
                type="checkbox"
                @change="toggleSelectAll"
                :checked="filteredPayments.length > 0 && filteredPayments.every(user => selectedRows.includes(user.id))"
                class="h-4 w-4 rounded border-gray-300"
            />
            <span>Select all visible</span>
            </label>

            <span class="text-sm text-gray-500">
            {{ selectedRows.length }} selected
            </span>
        </div>

        <div class="flex flex-wrap gap-2">
            <button
                @click="handleBulkDisable"
                class="rounded-lg bg-red-600 px-4 py-2 text-sm font-medium text-white hover:bg-red-700"
            >
                Bulk Disable
            </button>

            <button
                @click="handleBulkMarkPaid"
                class="rounded-lg border border-indigo-300 px-4 py-2 text-sm font-medium text-indigo-700 hover:bg-indigo-50"
            >
                Bulk Mark Paid
            </button>
        </div>
    </div>

    <DataTable
      :columns="columns"
      :rows="filteredPayments"
      :loading="userStore.loading"
    >
        <template #select="{ row }">
            <input
                type="checkbox"
                :checked="isRowSelected(row.id)"
                @change="toggleRowSelection(row.id)"
                class="h-4 w-4 rounded border-gray-300 text-indigo-600 focus:ring-indigo-500"
            />
        </template>

        <template #paymentStatus="{ row }">
            <StatusBadge :status="row.paymentStatus" />
        </template>

        <template #enrolmentStatus="{ row }">
            <StatusBadge :status="row.enrolmentStatus" />
        </template>

        <template #actions="{ row }">
            <div class="flex flex-wrap gap-2">
                <button
                    @click="openActionModal(row.id, 'disable')"
                    class="rounded-md bg-red-600 px-3 py-1 text-xs text-white"
                >
                    Disable
                </button>

                <button
                    @click="handleReEnableAccess(row.id)"
                    class="rounded-md border px-3 py-1 text-xs"
                >
                    Re-enable
                </button>

                <button
                    @click="openActionModal(row.id, 'markPaid')"
                    class="rounded-md border px-3 py-1 text-xs text-indigo-700"
                >
                    Mark Paid
                </button>
            </div>
        </template>
    </DataTable>

    <ConfirmModal
        :open="isModalOpen"
        title="Confirm Action"
        :message="
            actionType === 'disable'
            ? 'Are you sure you want to disable this user’s access?'
            : 'Mark this user as fully paid?'
        "
        confirmText="Confirm"
        cancelText="Cancel"
        @close="closeModal"
        @confirm="confirmAction"
    />

  </section>
</template>