<script setup>
import { ref, computed, onMounted } from 'vue'
import PageHeader from '../../../components/admin/PageHeader.vue'
import SearchInput from '../../../components/admin/SearchInput.vue'
import FilterSelect from '../../../components/admin/FilterSelect.vue'
import DataTable from '../../../components/admin/DataTable.vue'
import StatusBadge from '../../../components/admin/StatusBadge.vue'
import ConfirmModal from '../../../components/admin/ConfirmModal.vue'
import { useCertificateStore } from '../../../stores/useCertificateStore'
import { exportToCSV } from '../../../utils/exportToCSV'

const certificateStore = useCertificateStore()

const search = ref('')
const cohortFilter = ref('')
const eligibilityFilter = ref('')
const statusFilter = ref('')

const isModalOpen = ref(false)
const selectedCertificateId = ref(null)
const actionType = ref('')

const handleExportCertificates = () => {
  const rowsToExport = filteredCertificates.value.map((item) => ({
    StudentName: item.studentName,
    StudentEmail: item.studentEmail,
    Programme: item.programme,
    Cohort: item.cohort,
    AttendanceRate: `${item.attendanceRate}%`,
    PaymentStatus: item.paymentStatus,
    EligibilityStatus: item.eligibilityStatus,
    CertificateStatus: item.certificateStatus,
    VerificationId: item.verificationId || '',
  }))

  exportToCSV('certificates-report.csv', rowsToExport)
}

const cohortOptions = [
  { label: 'Cohort 1', value: 'Cohort 1' },
  { label: 'Cohort 2', value: 'Cohort 2' },
  { label: 'Cohort 3', value: 'Cohort 3' },
]

const eligibilityOptions = [
  { label: 'Eligible', value: 'eligible' },
  { label: 'Not Eligible', value: 'not eligible' },
]

const statusOptions = [
  { label: 'Not Started', value: 'not started' },
  { label: 'Pending', value: 'pending' },
  { label: 'Issued', value: 'issued' },
  { label: 'Revoked', value: 'revoked' },
]

const columns = [
  { label: 'Student Name', key: 'studentName' },
  { label: 'Email', key: 'studentEmail' },
  { label: 'Programme', key: 'programme' },
  { label: 'Cohort', key: 'cohort' },
  { label: 'Attendance %', key: 'attendanceRate' },
  { label: 'Payment Status', key: 'paymentStatus' },
  { label: 'Eligibility', key: 'eligibilityStatus' },
  { label: 'Certificate Status', key: 'certificateStatus' },
  { label: 'Verification ID', key: 'verificationId' },
  { label: 'Actions', key: 'actions' },
]

const filteredCertificates = computed(() => {
  return certificateStore.certificates.filter((item) => {
    const matchesSearch =
      item.studentName.toLowerCase().includes(search.value.toLowerCase()) ||
      item.studentEmail.toLowerCase().includes(search.value.toLowerCase())

    const matchesCohort =
      !cohortFilter.value || item.cohort === cohortFilter.value

    const matchesEligibility =
      !eligibilityFilter.value || item.eligibilityStatus.toLowerCase() === eligibilityFilter.value

    const matchesStatus =
      !statusFilter.value || item.certificateStatus.toLowerCase() === statusFilter.value

    return matchesSearch && matchesCohort && matchesEligibility && matchesStatus
  })
})

const openActionModal = (id, type) => {
  selectedCertificateId.value = id
  actionType.value = type
  isModalOpen.value = true
}

const closeModal = () => {
  selectedCertificateId.value = null
  actionType.value = ''
  isModalOpen.value = false
}

const confirmAction = () => {
  if (actionType.value === 'approve') {
    certificateStore.approveCertificate(selectedCertificateId.value)
  }

  if (actionType.value === 'revoke') {
    certificateStore.revokeCertificate(selectedCertificateId.value)
  }

  closeModal()
}

onMounted(() => {
  if (!certificateStore.certificates.length) {
    certificateStore.fetchCertificates()
  }
})
</script>

<template>
  <section class="space-y-6 p-6">
    <PageHeader
      title="Certificate Management"
      subtitle="Review eligibility, approve certificates, and manage certificate status."
      buttonText="Export CSV"
      @action="handleExportCertificates"
      class="rounded-xl border border-gray-300 px-10 py-10 text-xs 
            font-medium text-gray-700 bg-slate-50"
      />

    <div class="grid gap-4 rounded-xl bg-white p-4 shadow-sm md:grid-cols-4">
      <SearchInput
        v-model="search"
        placeholder="Search by student name or email"
      />

      <FilterSelect
        v-model="cohortFilter"
        label="Cohort"
        :options="cohortOptions"
      />

      <FilterSelect
        v-model="eligibilityFilter"
        label="Eligibility"
        :options="eligibilityOptions"
      />

      <FilterSelect
        v-model="statusFilter"
        label="Certificate Status"
        :options="statusOptions"
      />
    </div>

    <DataTable
      :columns="columns"
      :rows="filteredCertificates"
      :loading="certificateStore.loading"
    >
      <template #attendanceRate="{ row }">
        {{ row.attendanceRate }}%
      </template>

      <template #paymentStatus="{ row }">
        <StatusBadge :status="row.paymentStatus" />
      </template>

      <template #eligibilityStatus="{ row }">
        <StatusBadge :status="row.eligibilityStatus" />
      </template>

      <template #certificateStatus="{ row }">
        <StatusBadge :status="row.certificateStatus" />
      </template>

      <template #verificationId="{ row }">
        {{ row.verificationId || '—' }}
      </template>

      <template #actions="{ row }">
        <div class="flex flex-wrap gap-2">
          <button
            @click="openActionModal(row.id, 'approve')"
            class="rounded-md border border-green-300 px-3 py-1 text-xs font-medium text-green-700 hover:bg-green-50"
          >
            Approve
          </button>

          <button
            @click="openActionModal(row.id, 'revoke')"
            class="rounded-md border border-red-300 px-3 py-1 text-xs font-medium text-red-700 hover:bg-red-50"
          >
            Revoke
          </button>
        </div>
      </template>
    </DataTable>

    <ConfirmModal
      :open="isModalOpen"
      title="Confirm Certificate Action"
      :message="
        actionType === 'approve'
          ? 'Are you sure you want to approve this certificate?'
          : 'Are you sure you want to revoke this certificate?'
      "
      confirmText="Confirm"
      cancelText="Cancel"
      @close="closeModal"
      @confirm="confirmAction"
    />
  </section>
</template>