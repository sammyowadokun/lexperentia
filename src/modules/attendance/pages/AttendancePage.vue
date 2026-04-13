<script setup>
import { ref, computed, onMounted } from 'vue'
import PageHeader from '../../../components/admin/PageHeader.vue'
import SearchInput from '../../../components/admin/SearchInput.vue'
import FilterSelect from '../../../components/admin/FilterSelect.vue'
import DataTable from '../../../components/admin/DataTable.vue'
import StatusBadge from '../../../components/admin/StatusBadge.vue'
import { useAttendanceStore } from '../../../stores/useAttendanceStore'
import { exportToCSV } from '../../../utils/exportToCSV'

const attendanceStore = useAttendanceStore()

const search = ref('')
const cohortFilter = ref('')
const statusFilter = ref('')

const handleExportAttendance = () => {
  const rowsToExport = filteredRecords.value.map((record) => ({
    StudentName: record.studentName,
    StudentEmail: record.studentEmail,
    Cohort: record.cohort,
    SessionTitle: record.sessionTitle,
    Date: record.date,
    Status: record.status,
  }))

  exportToCSV('attendance-report.csv', rowsToExport)
}

const cohortOptions = [
  { label: 'Cohort 1', value: 'Cohort 1' },
  { label: 'Cohort 2', value: 'Cohort 2' },
  { label: 'Cohort 3', value: 'Cohort 3' },
]

const statusOptions = [
  { label: 'Present', value: 'present' },
  { label: 'Absent', value: 'absent' },
]

const columns = [
  { label: 'Student Name', key: 'studentName' },
  { label: 'Email', key: 'studentEmail' },
  { label: 'Cohort', key: 'cohort' },
  { label: 'Session', key: 'sessionTitle' },
  { label: 'Date', key: 'date' },
  { label: 'Status', key: 'status' },
  { label: 'Actions', key: 'actions' },
]

const filteredRecords = computed(() => {
  return attendanceStore.records.filter((record) => {
    const matchesSearch =
      record.studentName.toLowerCase().includes(search.value.toLowerCase()) ||
      record.studentEmail.toLowerCase().includes(search.value.toLowerCase()) ||
      record.sessionTitle.toLowerCase().includes(search.value.toLowerCase())

    const matchesCohort =
      !cohortFilter.value || record.cohort === cohortFilter.value

    const matchesStatus =
      !statusFilter.value || record.status.toLowerCase() === statusFilter.value

    return matchesSearch && matchesCohort && matchesStatus
  })
})

const handleMarkPresent = (id) => {
  attendanceStore.markPresent(id)
}

const handleMarkAbsent = (id) => {
  attendanceStore.markAbsent(id)
}

onMounted(() => {
  if (!attendanceStore.records.length) {
    attendanceStore.fetchAttendance()
  }
})
</script>

<template>
  <section class="space-y-6 p-6">
    <PageHeader
      title="Attendance Monitoring"
      subtitle="Track and manage student attendance across cohorts and sessions."
      buttonText="Export CSV"
      @action="handleExportAttendance"
      class="rounded-xl border border-gray-300 px-10 py-10 text-xs 
            font-medium text-gray-700 bg-slate-50"
    />

    <div class="grid gap-4 rounded-xl bg-white p-4 shadow-sm md:grid-cols-3">
      <SearchInput
        v-model="search"
        placeholder="Search by student, email, or session"
      />

      <FilterSelect
        v-model="cohortFilter"
        label="Cohort"
        :options="cohortOptions"
      />

      <FilterSelect
        v-model="statusFilter"
        label="Status"
        :options="statusOptions"
      />
    </div>

    <DataTable
      :columns="columns"
      :rows="filteredRecords"
      :loading="attendanceStore.loading"
    >
      <template #status="{ row }">
        <StatusBadge :status="row.status" />
      </template>

      <template #actions="{ row }">
        <div class="flex flex-wrap gap-2">
          <button
            @click="handleMarkPresent(row.id)"
            class="rounded-md border border-green-300 px-3 py-1 text-xs font-medium text-green-700 hover:bg-green-50"
          >
            Present
          </button>

          <button
            @click="handleMarkAbsent(row.id)"
            class="rounded-md border border-red-300 px-3 py-1 text-xs font-medium text-red-700 hover:bg-red-50"
          >
            Absent
          </button>
        </div>
      </template>
    </DataTable>
  </section>
</template>