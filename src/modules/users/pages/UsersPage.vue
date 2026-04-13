<script setup>
import { ref, computed, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import PageHeader from '../../../components/admin/PageHeader.vue'
import SearchInput from '../../../components/admin/SearchInput.vue'
import FilterSelect from '../../../components/admin/FilterSelect.vue'
import DataTable from '../../../components/admin/DataTable.vue'
import StatusBadge from '../../../components/admin/StatusBadge.vue'
import { useUserStore } from '../../../stores/useUserStore'
import { exportToCSV } from '../../../utils/exportToCSV'

const search = ref('')
const roleFilter = ref('')
const paymentFilter = ref('')
const enrolmentFilter = ref('')
const router = useRouter()
const userStore = useUserStore()

const handleExportUsers = () => {
  const rowsToExport = filteredUsers.value.map((user) => ({
    Name: user.name,
    Email: user.email,
    Role: user.role,
    Programme: user.programme,
    Cohort: user.cohort,
    PaymentStatus: user.paymentStatus,
    EnrolmentStatus: user.enrolmentStatus,
    DateRegistered: user.dateRegistered || '',
  }))

  exportToCSV('users-report.csv', rowsToExport)
}


const goToUserProfile = (id) => {
  router.push(`/admin/users/${id}`)
}

const roleOptions = [
  { label: 'Student', value: 'student' },
  { label: 'Young Lawyer', value: 'young lawyer' },
]

const paymentOptions = [
  { label: 'Fully Paid', value: 'fully paid' },
  { label: 'Partial', value: 'partial' },
  { label: 'Unpaid', value: 'unpaid' },
]

const enrolmentOptions = [
  { label: 'Active', value: 'active' },
  { label: 'Disabled', value: 'disabled' },
  { label: 'Completed', value: 'completed' },
]

const columns = [
  { label: 'Name', key: 'name' },
  { label: 'Email', key: 'email' },
  { label: 'Role', key: 'role' },
  { label: 'Programme', key: 'programme' },
  { label: 'Cohort', key: 'cohort' },
  { label: 'Payment Status', key: 'paymentStatus' },
  { label: 'Enrolment Status', key: 'enrolmentStatus' },
]


const filteredUsers = computed(() => {
  return userStore.users.filter((user) => {
    const matchesSearch =
      user.name.toLowerCase().includes(search.value.toLowerCase()) ||
      user.email.toLowerCase().includes(search.value.toLowerCase())

    const matchesRole =
      !roleFilter.value || user.role.toLowerCase() === roleFilter.value

    const matchesPayment =
      !paymentFilter.value || user.paymentStatus.toLowerCase() === paymentFilter.value

    const matchesEnrolment =
      !enrolmentFilter.value || user.enrolmentStatus.toLowerCase() === enrolmentFilter.value

    return matchesSearch && matchesRole && matchesPayment && matchesEnrolment
  })
})

onMounted(() => {
  if (!userStore.users.length) {
    userStore.fetchUsers()
  }
})
</script>

<template>
  <section class="space-y-6 p-6">
    <PageHeader
      title="User Management"
      subtitle="View, search, and manage all registered users."
      buttonText="Export CSV"
      @action="handleExportUsers"
      class="rounded-xl border border-gray-300 px-10 py-10 text-xs 
            font-medium text-gray-700 bg-slate-50 shadow-md"
      />

    <div class="grid gap-4 rounded-xl bg-white p-4 shadow-sm md:grid-cols-4">
      <SearchInput
        v-model="search"
        placeholder="Search by name or email"
      />

      <FilterSelect
        v-model="roleFilter"
        label="Role"
        :options="roleOptions"
      />

      <FilterSelect
        v-model="paymentFilter"
        label="Payment Status"
        :options="paymentOptions"
      />

      <FilterSelect
        v-model="enrolmentFilter"
        label="Enrolment Status"
        :options="enrolmentOptions"
      />
    </div>

    <DataTable
      :columns="columns"
      :rows="filteredUsers"
      :loading="false"
    >
      <template #name="{ row }">
        <button
          @click="goToUserProfile(row.id)"
          class="font-medium text-indigo-600 hover:underline"
        >
          {{ row.name }}
        </button>
      </template>

      <template #paymentStatus="{ row }">
        <StatusBadge :status="row.paymentStatus" />
      </template>

      <template #enrolmentStatus="{ row }">
        <StatusBadge :status="row.enrolmentStatus" />
      </template>
    </DataTable>
  </section>
</template>