<script setup>
import { ref, computed, onMounted } from 'vue'
import PageHeader from '../../../components/admin/PageHeader.vue'
import SearchInput from '../../../components/admin/SearchInput.vue'
import FilterSelect from '../../../components/admin/FilterSelect.vue'
import DataTable from '../../../components/admin/DataTable.vue'
import StatusBadge from '../../../components/admin/StatusBadge.vue'
import FormModal from '../../../components/admin/FormModal.vue'
import { useMentorStore } from '../../../stores/useMentorStore'

const mentorStore = useMentorStore()

const search = ref('')
const visibilityFilter = ref('')
const isMentorModalOpen = ref(false)
const editingMentorId = ref(null)

const mentorForm = ref({
  fullName: '',
  title: '',
  organisation: '',
  expertise: '',
  bio: '',
  visibility: '',
})

const visibilityOptions = [
  { label: 'Shown', value: 'shown' },
  { label: 'Hidden', value: 'hidden' },
]

const columns = [
  { label: 'Full Name', key: 'fullName' },
  { label: 'Title', key: 'title' },
  { label: 'Organisation', key: 'organisation' },
  { label: 'Expertise', key: 'expertise' },
  { label: 'Visibility', key: 'visibility' },
  { label: 'Actions', key: 'actions' },
]

const filteredMentors = computed(() => {
  return mentorStore.mentors.filter((mentor) => {
    const matchesSearch =
      mentor.fullName.toLowerCase().includes(search.value.toLowerCase()) ||
      mentor.organisation.toLowerCase().includes(search.value.toLowerCase()) ||
      mentor.expertise.toLowerCase().includes(search.value.toLowerCase())

    const matchesVisibility =
      !visibilityFilter.value || mentor.visibility.toLowerCase() === visibilityFilter.value

    return matchesSearch && matchesVisibility
  })
})

const resetMentorForm = () => {
  mentorForm.value = {
    fullName: '',
    title: '',
    organisation: '',
    expertise: '',
    bio: '',
    visibility: '',
  }

  editingMentorId.value = null
}

const handleCreateMentor = () => {
  isMentorModalOpen.value = true
}

const closeMentorModal = () => {
  isMentorModalOpen.value = false
  resetMentorForm()
}

const submitMentorForm = () => {
  const payload = {
    fullName: mentorForm.value.fullName,
    title: mentorForm.value.title,
    organisation: mentorForm.value.organisation,
    expertise: mentorForm.value.expertise,
    bio: mentorForm.value.bio,
    visibility: mentorForm.value.visibility,
  }

  if (editingMentorId.value) {
    mentorStore.updateMentor(editingMentorId.value, payload)
  } else {
    mentorStore.createMentor(payload)
  }

  closeMentorModal()
}

const handleEditMentor = (mentor) => {
  editingMentorId.value = mentor.id

  mentorForm.value = {
    fullName: mentor.fullName,
    title: mentor.title,
    organisation: mentor.organisation,
    expertise: mentor.expertise,
    bio: mentor.bio,
    visibility: mentor.visibility,
  }

  isMentorModalOpen.value = true
}

onMounted(() => {
  if (!mentorStore.mentors.length) {
    mentorStore.fetchMentors()
  }
})
</script>

<template>
  <section class="space-y-6 p-6">
    <PageHeader
      title="Mentor / Facilitator Management"
      subtitle="Manage mentor profiles, expertise, and public visibility."
      buttonText="Add Mentor"
      @action="handleCreateMentor"
      class="rounded-xl border border-gray-300 px-10 py-10 text-xs 
            font-medium text-gray-700 bg-slate-50 shadow-md"
    />

    <div class="grid gap-4 rounded-xl bg-white p-4 shadow-sm md:grid-cols-2">
      <SearchInput
        v-model="search"
        placeholder="Search by name, organisation, or expertise"
      />

      <FilterSelect
        v-model="visibilityFilter"
        label="Visibility"
        :options="visibilityOptions"
      />
    </div>

    <DataTable
      :columns="columns"
      :rows="filteredMentors"
      :loading="mentorStore.loading"
    >
      <template #visibility="{ row }">
        <StatusBadge :status="row.visibility" />
      </template>

      <template #actions="{ row }">
        <button
          @click="handleEditMentor(row)"
          class="rounded-md border border-indigo-300 px-3 py-1 text-xs font-medium text-indigo-700 hover:bg-indigo-50"
        >
          Edit
        </button>
      </template>
    </DataTable>

    <FormModal
      :open="isMentorModalOpen"
      :title="editingMentorId ? 'Edit Mentor' : 'Add Mentor'"
      :submitText="editingMentorId ? 'Save Changes' : 'Create Mentor'"
      cancelText="Cancel"
      @close="closeMentorModal"
      @submit="submitMentorForm"
    >
      <div class="grid gap-4 md:grid-cols-2">
        <div>
          <label class="mb-1 block text-sm font-medium text-gray-700">Full Name</label>
          <input
            v-model="mentorForm.fullName"
            type="text"
            class="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm"
            placeholder="Enter full name"
          />
        </div>

        <div>
          <label class="mb-1 block text-sm font-medium text-gray-700">Title</label>
          <input
            v-model="mentorForm.title"
            type="text"
            class="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm"
            placeholder="Enter title"
          />
        </div>

        <div>
          <label class="mb-1 block text-sm font-medium text-gray-700">Organisation</label>
          <input
            v-model="mentorForm.organisation"
            type="text"
            class="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm"
            placeholder="Enter organisation"
          />
        </div>

        <div>
          <label class="mb-1 block text-sm font-medium text-gray-700">Visibility</label>
          <select
            v-model="mentorForm.visibility"
            class="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm"
          >
            <option value="">Select visibility</option>
            <option
              v-for="option in visibilityOptions"
              :key="option.value"
              :value="option.value"
            >
              {{ option.label }}
            </option>
          </select>
        </div>

        <div class="md:col-span-2">
          <label class="mb-1 block text-sm font-medium text-gray-700">Areas of Expertise</label>
          <input
            v-model="mentorForm.expertise"
            type="text"
            class="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm"
            placeholder="e.g. Legal Research, Litigation"
          />
        </div>

        <div class="md:col-span-2">
          <label class="mb-1 block text-sm font-medium text-gray-700">Bio</label>
          <textarea
            v-model="mentorForm.bio"
            rows="4"
            class="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm"
            placeholder="Enter mentor bio"
          />
        </div>
      </div>
    </FormModal>
  </section>
</template>