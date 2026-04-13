<script setup>
import { ref, computed, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import PageHeader from '../../../components/admin/PageHeader.vue'
import SearchInput from '../../../components/admin/SearchInput.vue'
import FilterSelect from '../../../components/admin/FilterSelect.vue'
import DataTable from '../../../components/admin/DataTable.vue'
import StatusBadge from '../../../components/admin/StatusBadge.vue'
import FormModal from '../../../components/admin/FormModal.vue'
import { useCourseStore } from '../../../stores/useCourseStore'

const router = useRouter()
const courseStore = useCourseStore()

const search = ref('')
const statusFilter = ref('')
const programmeFilter = ref('')
const isCourseModalOpen = ref(false)
const editingCourseId = ref(null)

const courseForm = ref({
  title: '',
  programmeType: '',
  cohort: '',
  description: '',
  status: '',
})

const statusOptions = [
  { label: 'Published', value: 'published' },
  { label: 'Draft', value: 'draft' },
  { label: 'Disabled', value: 'disabled' },
]

const programmeOptions = [
  { label: 'Law Student Internship', value: 'Law Student Internship' },
  { label: 'Young Lawyer Coaching', value: 'Young Lawyer Coaching' },
]

const cohortOptions = [
  { label: 'Cohort 1', value: 'Cohort 1' },
  { label: 'Cohort 2', value: 'Cohort 2' },
  { label: 'Cohort 3', value: 'Cohort 3' },
]

const columns = [
  { label: 'Course Title', key: 'title' },
  { label: 'Programme Type', key: 'programmeType' },
  { label: 'Cohort', key: 'cohort' },
  { label: 'Description', key: 'description' },
  { label: 'Status', key: 'status' },
  { label: 'Content Items', key: 'contentCount' },
  { label: 'Actions', key: 'actions' },
]

const filteredCourses = computed(() => {
  return courseStore.courses.filter((course) => {
    const matchesSearch =
      course.title.toLowerCase().includes(search.value.toLowerCase())

    const matchesStatus =
      !statusFilter.value || course.status.toLowerCase() === statusFilter.value

    const matchesProgramme =
      !programmeFilter.value || course.programmeType === programmeFilter.value

    return matchesSearch && matchesStatus && matchesProgramme
  })
})

const goToCourseDetail = (id) => {
  router.push(`/admin/courses/${id}`)
}

const resetCourseForm = () => {
  courseForm.value = {
    title: '',
    programmeType: '',
    cohort: '',
    description: '',
    status: '',
  }

  editingCourseId.value = null
}

const handleCreateCourse = () => {
  isCourseModalOpen.value = true
}

const closeCourseModal = () => {
  isCourseModalOpen.value = false
  resetCourseForm()
}

const submitCourseForm = () => {
  const payload = {
    title: courseForm.value.title,
    programmeType: courseForm.value.programmeType,
    cohort: courseForm.value.cohort,
    description: courseForm.value.description,
    status: courseForm.value.status,
  }

  if (editingCourseId.value) {
    courseStore.updateCourse(editingCourseId.value, payload)
  } else {
    courseStore.createCourse(payload)
  }

  isCourseModalOpen.value = false
  resetCourseForm()
}

const handleEditCourse = (course) => {
  editingCourseId.value = course.id

  courseForm.value = {
    title: course.title,
    programmeType: course.programmeType,
    cohort: course.cohort,
    description: course.description,
    status: course.status,
  }

  isCourseModalOpen.value = true
}

onMounted(() => {
  if (!courseStore.courses.length) {
    courseStore.fetchCourses()
  }
})
</script>

<template>
  <section class="space-y-6 p-6">
    <PageHeader
      title="Course Management"
      subtitle="Create, organize, and manage course visibility across cohorts."
      buttonText="Create Course"
      @action="handleCreateCourse"
      class="rounded-xl border border-gray-300 px-10 py-10 text-xs 
            font-medium text-gray-700 bg-slate-50 shadow-md"
    />

    <div class="grid gap-4 rounded-xl bg-white p-4 shadow-sm md:grid-cols-3">
      <SearchInput
        v-model="search"
        placeholder="Search by course title"
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
      :rows="filteredCourses"
      :loading="courseStore.loading"
    >
      <template #title="{ row }">
        <button
          @click="goToCourseDetail(row.id)"
          class="font-medium text-indigo-600 hover:underline"
        >
          {{ row.title }}
        </button>
      </template>

      <template #status="{ row }">
        <StatusBadge :status="row.status" />
      </template>

      <template #actions="{ row }">
        <div class="flex flex-wrap gap-2">
          <button
            @click="goToCourseDetail(row.id)"
            class="rounded-md border border-gray-300 px-3 py-1 text-xs font-medium text-gray-700 hover:bg-gray-50"
          >
            View
          </button>

          <button
            @click="handleEditCourse(row)"
            class="rounded-md border border-indigo-300 px-3 py-1 text-xs font-medium text-indigo-700 hover:bg-indigo-50"
          >
            Edit
          </button>
        </div>
      </template>
    </DataTable>

    <FormModal
      :open="isCourseModalOpen"
      :title="editingCourseId ? 'Edit Course' : 'Create Course'"
      :submitText="editingCourseId ? 'Save Changes' : 'Create Course'"
      cancelText="Cancel"
      @close="closeCourseModal"
      @submit="submitCourseForm"
    >
      <div class="grid gap-4 md:grid-cols-2">
        <div class="md:col-span-2">
          <label class="mb-1 block text-sm font-medium text-gray-700">Course Title</label>
          <input
            v-model="courseForm.title"
            type="text"
            class="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm"
            placeholder="Enter course title"
          />
        </div>

        <div>
          <label class="mb-1 block text-sm font-medium text-gray-700">Programme Type</label>
          <select
            v-model="courseForm.programmeType"
            class="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm"
          >
            <option value="">Select programme type</option>
            <option
              v-for="option in programmeOptions"
              :key="option.value"
              :value="option.value"
            >
              {{ option.label }}
            </option>
          </select>
        </div>

        <div>
          <label class="mb-1 block text-sm font-medium text-gray-700">Cohort</label>
          <select
            v-model="courseForm.cohort"
            class="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm"
          >
            <option value="">Select cohort</option>
            <option
              v-for="option in cohortOptions"
              :key="option.value"
              :value="option.value"
            >
              {{ option.label }}
            </option>
          </select>
        </div>

        <div class="md:col-span-2">
          <label class="mb-1 block text-sm font-medium text-gray-700">Description</label>
          <textarea
            v-model="courseForm.description"
            rows="4"
            class="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm"
            placeholder="Enter course description"
          />
        </div>

        <div class="md:col-span-2">
          <label class="mb-1 block text-sm font-medium text-gray-700">Status</label>
          <select
            v-model="courseForm.status"
            class="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm"
          >
            <option value="">Select status</option>
            <option
              v-for="option in statusOptions"
              :key="option.value"
              :value="option.value"
            >
              {{ option.label }}
            </option>
          </select>
        </div>
      </div>
    </FormModal>
  </section>
</template>