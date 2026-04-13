<script setup>
import { ref, computed, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import PageHeader from '../../../components/admin/PageHeader.vue'
import SearchInput from '../../../components/admin/SearchInput.vue'
import FilterSelect from '../../../components/admin/FilterSelect.vue'
import DataTable from '../../../components/admin/DataTable.vue'
import StatusBadge from '../../../components/admin/StatusBadge.vue'
import { useCohortStore } from '../../../stores/useCohortStore'

const router = useRouter()
const cohortStore = useCohortStore()

const search = ref('')
const statusFilter = ref('')
const programmeFilter = ref('')

const statusOptions = [
  { label: 'Open', value: 'open' },
  { label: 'Closed', value: 'closed' },
  { label: 'Completed', value: 'completed' },
]

const programmeOptions = [
  { label: 'Law Student Internship', value: 'Law Student Internship' },
  { label: 'Young Lawyer Coaching', value: 'Young Lawyer Coaching' },
]

const columns = [
  { label: 'Cohort Name', key: 'name' },
  { label: 'Programme Type', key: 'programmeType' },
  { label: 'Start Date', key: 'startDate' },
  { label: 'End Date', key: 'endDate' },
  { label: 'Capacity', key: 'capacity' },
  { label: 'Students', key: 'studentsCount' },
  { label: 'Revenue', key: 'revenue' },
  { label: 'Status', key: 'status' },
]

const filteredCohorts = computed(() => {
  return cohortStore.cohorts.filter((cohort) => {
    const matchesSearch =
      cohort.name.toLowerCase().includes(search.value.toLowerCase())

    const matchesStatus =
      !statusFilter.value || cohort.status.toLowerCase() === statusFilter.value

    const matchesProgramme =
      !programmeFilter.value || cohort.programmeType === programmeFilter.value

    return matchesSearch && matchesStatus && matchesProgramme
  })
})

const goToCohortDetail = (id) => {
  router.push(`/admin/cohorts/${id}`)
}

const handleCreateCohort = () => {
  console.log('Create cohort clicked')
}

onMounted(() => {
  if (!cohortStore.cohorts.length) {
    cohortStore.fetchCohorts()
  }
})
</script>

<template>
  <section class="space-y-6 p-6">
    <PageHeader
      title="Cohort Management"
      subtitle="Create, track, and manage all cohorts across the platform."
      class="rounded-xl border border-gray-300 px-10 py-10 text-xs 
            font-medium text-gray-700 bg-slate-50 shadow-md"
    />

    <div class="grid gap-4 rounded-xl bg-white p-4 shadow-sm md:grid-cols-3">
      <SearchInput
        v-model="search"
        placeholder="Search by cohort name"
      />

      <FilterSelect
        v-model="statusFilter"
        label="Status"
        :options="statusOptions"
      />

      <FilterSelect
        v-model="programmeFilter"
        label="Programme Type"
        :options="programmeOptions"
      />
    </div>

    <DataTable
      :columns="columns"
      :rows="filteredCohorts"
      :loading="cohortStore.loading"
    >
      <template #name="{ row }">
        <button
          @click="goToCohortDetail(row.id)"
          class="font-medium text-indigo-600 hover:underline"
        >
          {{ row.name }}
        </button>
      </template>

      <template #status="{ row }">
        <StatusBadge :status="row.status" />
      </template>
    </DataTable>
  </section>
</template>