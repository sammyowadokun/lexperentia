<script setup>
import { ref, computed, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import PageHeader from '../../../components/admin/PageHeader.vue'
import SearchInput from '../../../components/admin/SearchInput.vue'
import FilterSelect from '../../../components/admin/FilterSelect.vue'
import DataTable from '../../../components/admin/DataTable.vue'
import StatusBadge from '../../../components/admin/StatusBadge.vue'
import { useSessionStore } from '../../../stores/useSessionStore'
import FormModal from '../../../components/admin/FormModal.vue'
import ConfirmModal from '../../../components/admin/ConfirmModal.vue'
import { useMentorStore } from '../../../stores/useMentorStore'
import { exportToCSV } from '../../../utils/exportToCSV'
import { useToastStore } from '../../../stores/useToastStore'

const editingSessionId = ref(null)
const isCancelModalOpen = ref(false)
const selectedSessionId = ref(null)
const toastStore = useToastStore()

const router = useRouter()
const sessionStore = useSessionStore()
const mentorStore = useMentorStore()
const isScheduleModalOpen = ref(false)

const search = ref('')
const statusFilter = ref('')
const cohortFilter = ref('')

const isReplayModalOpen = ref(false)
const selectedReplaySessionId = ref(null)
const replayUrl = ref('')

const handleExportSessions = () => {
  const rowsToExport = filteredSessions.value.map((session) => ({
    SessionTitle: session.title,
    Cohort: session.cohort,
    ProgrammeType: session.programmeType,
    Facilitator: session.facilitator,
    Date: session.date,
    Time: session.time,
    Duration: session.duration,
    SessionType: session.sessionType,
    Status: session.status,
    ReplayStatus: session.replayStatus,
    ZoomMeetingId: session.zoomMeetingId,
  }))

  exportToCSV('sessions-report.csv', rowsToExport)
}

const openReplayModal = (session) => {
  selectedReplaySessionId.value = session.id
  replayUrl.value = session.replayUrl || ''
  isReplayModalOpen.value = true
}

const closeReplayModal = () => {
  selectedReplaySessionId.value = null
  replayUrl.value = ''
  isReplayModalOpen.value = false
}

const saveReplayUrl = () => {
  sessionStore.markReplayAvailable(selectedReplaySessionId.value, replayUrl.value)
  toastStore.triggerToast('Replay saved successfully')
  closeReplayModal()
}

const markReplayUnavailable = (id) => {
  sessionStore.markReplayUnavailable(id)
  toastStore.triggerToast('Replay marked as unavailable')
}

const statusOptions = [
  { label: 'Scheduled', value: 'scheduled' },
  { label: 'Live', value: 'live' },
  { label: 'Completed', value: 'completed' },
  { label: 'Cancelled', value: 'cancelled' },
]

const cohortOptions = [
  { label: 'Cohort 1', value: 'Cohort 1' },
  { label: 'Cohort 2', value: 'Cohort 2' },
  { label: 'Cohort 3', value: 'Cohort 3' },
]

const columns = [
  { label: 'Session Title', key: 'title' },
  { label: 'Cohort', key: 'cohort' },
  { label: 'Programme Type', key: 'programmeType' },
  { label: 'Facilitator', key: 'facilitator' },
  { label: 'Date', key: 'date' },
  { label: 'Time', key: 'time' },
  { label: 'Duration', key: 'duration' },
  { label: 'Session Type', key: 'sessionType' },
  { label: 'Status', key: 'status' },
  { label: 'Replay Status', key: 'replayStatus' },
  { label: 'Actions', key: 'actions' },
]

const programmeOptions = [
  { label: 'Law Student Internship', value: 'Law Student Internship' },
  { label: 'Young Lawyer Coaching', value: 'Young Lawyer Coaching' },
]

const sessionTypeOptions = [
  { label: 'Internship Session', value: 'Internship Session' },
  { label: 'Coaching', value: 'Coaching' },
  { label: 'Q&A', value: 'Q&A' },
  { label: 'Career Acceleration', value: 'Career Acceleration' },
]

const filteredSessions = computed(() => {
  return sessionStore.sessions.filter((session) => {
    const matchesSearch =
      session.title.toLowerCase().includes(search.value.toLowerCase()) ||
      session.facilitator.toLowerCase().includes(search.value.toLowerCase())

    const matchesStatus =
      !statusFilter.value || session.status.toLowerCase() === statusFilter.value

    const matchesCohort =
      !cohortFilter.value || session.cohort === cohortFilter.value

    return matchesSearch && matchesStatus && matchesCohort
  })
})

const goToSessionDetail = (id) => {
  router.push(`/admin/sessions/${id}`)
}

const sessionForm = ref({
  title: '',
  cohort: '',
  programmeType: '',
  facilitator: '',
  date: '',
  time: '',
  duration: '',
  sessionType: '',
})

const resetSessionForm = () => {
  sessionForm.value = {
    title: '',
    cohort: '',
    programmeType: '',
    facilitator: '',
    date: '',
    time: '',
    duration: '',
    sessionType: '',
  }

  editingSessionId.value = null
}

const handleScheduleSession = () => {
  isScheduleModalOpen.value = true
}

const closeScheduleModal = () => {
  isScheduleModalOpen.value = false
  resetSessionForm()
}

const submitScheduleSession = () => {
  const payload = {
    title: sessionForm.value.title,
    cohort: sessionForm.value.cohort,
    programmeType: sessionForm.value.programmeType,
    facilitator: sessionForm.value.facilitator,
    date: sessionForm.value.date,
    time: sessionForm.value.time,
    duration: Number(sessionForm.value.duration),
    sessionType: sessionForm.value.sessionType,
  }

  if (editingSessionId.value) {
    sessionStore.updateSession(editingSessionId.value, payload)
    toastStore.triggerToast('Session updated successfully')
  } else {
    sessionStore.createSession(payload)
    toastStore.triggerToast('Session scheduled successfully')
  }

  isScheduleModalOpen.value = false
  editingSessionId.value = null
  resetSessionForm()
}

const openCancelModal = (id) => {
  selectedSessionId.value = id
  isCancelModalOpen.value = true
}

const closeCancelModal = () => {
  selectedSessionId.value = null
  isCancelModalOpen.value = false
}

const confirmCancelSession = () => {
  sessionStore.cancelSession(selectedSessionId.value)
  toastStore.triggerToast('Session cancelled')
  closeCancelModal()
}

const handleEditSession = (session) => {
  editingSessionId.value = session.id

  sessionForm.value = {
    title: session.title,
    cohort: session.cohort,
    programmeType: session.programmeType,
    facilitator: session.facilitator,
    date: session.date,
    time: session.time,
    duration: session.duration,
    sessionType: session.sessionType,
  }

  isScheduleModalOpen.value = true
}

const mentorOptions = computed(() => {
  return mentorStore.mentors
    .filter((mentor) => mentor.visibility === 'shown')
    .map((mentor) => ({
      label: mentor.fullName,
      value: mentor.fullName,
    }))
})

onMounted(() => {
    if (!sessionStore.sessions.length) {
        sessionStore.fetchSessions()
    }

    if (!mentorStore.mentors.length) {
        mentorStore.fetchMentors()
    }
})
</script>

<template>
  <section class="space-y-6 p-6">
    <PageHeader
      title="Live Sessions"
      subtitle="Schedule, manage, and track all live sessions and Zoom replays."
      buttonText="Schedule Session"
      secondaryButtonText="Export CSV"
      @secondaryAction="handleExportSessions"
      @action="handleScheduleSession"
      class="rounded-xl border border-gray-300 px-10 py-10 text-xs 
            font-medium text-gray-700 bg-slate-50 shadow-md"
    />

    <div class="grid gap-4 rounded-xl bg-white p-4 shadow-sm md:grid-cols-3">
      <SearchInput
        v-model="search"
        placeholder="Search by title or facilitator"
      />

      <FilterSelect
        v-model="statusFilter"
        label="Status"
        :options="statusOptions"
      />

      <FilterSelect
        v-model="cohortFilter"
        label="Cohort"
        :options="cohortOptions"
      />
    </div>

    <DataTable
      :columns="columns"
      :rows="filteredSessions"
      :loading="sessionStore.loading"
    >
      <template #title="{ row }">
        <button
          @click="goToSessionDetail(row.id)"
          class="font-medium text-indigo-600 hover:underline"
        >
          {{ row.title }}
        </button>
      </template>

      <template #status="{ row }">
        <StatusBadge :status="row.status" />
      </template>

      <template #replayStatus="{ row }">
        <StatusBadge :status="row.replayStatus" />
      </template>

      <template #actions="{ row }">
        <div class="flex flex-wrap gap-2">
            <button
                @click="goToSessionDetail(row.id)"
                class="rounded-md border border-gray-300 px-3 py-1 text-xs font-medium text-gray-700 hover:bg-gray-50"
            >
                View
            </button>

            <button
                @click="handleEditSession(row)"
                class="rounded-md border border-indigo-300 px-3 py-1 text-xs font-medium text-indigo-700 hover:bg-indigo-50"
            >
                Edit
            </button>
            
            <button
                @click="openReplayModal(row)"
                class="rounded-md border border-green-300 px-3 py-1 text-xs font-medium text-green-700 hover:bg-green-50"
            >
                Replay
            </button>

            <button
                @click="markReplayUnavailable(row.id)"
                class="rounded-md border border-yellow-300 px-3 py-1 text-xs font-medium text-yellow-700 hover:bg-yellow-50"
            >
                No Replay
            </button>

            <button
                @click="openCancelModal(row.id)"
                class="rounded-md bg-red-600 px-3 py-1 text-xs font-medium text-white hover:bg-red-700"
            >
                Cancel
            </button>
        </div>
      </template>
    </DataTable>

    <FormModal
        :open="isScheduleModalOpen"
        :title="editingSessionId ? 'Edit Session' : 'Schedule Session'"
        :submitText="editingSessionId ? 'Save Changes' : 'Create Session'"
        cancelText="Cancel"
        @close="closeScheduleModal"
        @submit="submitScheduleSession"
        >
        <div class="grid gap-4 md:grid-cols-2">
            <div class="md:col-span-2">
            <label class="mb-1 block text-sm font-medium text-gray-700">Session Title</label>
            <input
                v-model="sessionForm.title"
                type="text"
                class="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm"
                placeholder="Enter session title"
            />
            </div>

            <div>
            <label class="mb-1 block text-sm font-medium text-gray-700">Cohort</label>
            <select
                v-model="sessionForm.cohort"
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

            <div>
            <label class="mb-1 block text-sm font-medium text-gray-700">Programme Type</label>
            <select
                v-model="sessionForm.programmeType"
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
              <label class="mb-1 block text-sm font-medium text-gray-700">Facilitator</label>
              <select
                v-model="sessionForm.facilitator"
                class="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm"
              >
                <option value="">Select facilitator</option>
                <option
                  v-for="option in mentorOptions"
                  :key="option.value"
                  :value="option.value"
                >
                  {{ option.label }}
                </option>
              </select>
            </div>

            <div>
            <label class="mb-1 block text-sm font-medium text-gray-700">Date</label>
            <input
                v-model="sessionForm.date"
                type="date"
                class="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm"
            />
            </div>

            <div>
            <label class="mb-1 block text-sm font-medium text-gray-700">Time</label>
            <input
                v-model="sessionForm.time"
                type="time"
                class="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm"
            />
            </div>

            <div>
            <label class="mb-1 block text-sm font-medium text-gray-700">Duration (minutes)</label>
            <input
                v-model="sessionForm.duration"
                type="number"
                class="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm"
                placeholder="e.g. 60"
            />
            </div>

            <div class="md:col-span-2">
            <label class="mb-1 block text-sm font-medium text-gray-700">Session Type</label>
            <select
                v-model="sessionForm.sessionType"
                class="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm"
            >
                <option value="">Select session type</option>
                <option
                v-for="option in sessionTypeOptions"
                :key="option.value"
                :value="option.value"
                >
                {{ option.label }}
                </option>
            </select>
            </div>
        </div>
    </FormModal>

    <ConfirmModal
        :open="isCancelModalOpen"
        title="Cancel Session"
        message="Are you sure you want to cancel this session?"
        confirmText="Yes, Cancel"
        cancelText="Keep Session"
        @close="closeCancelModal"
        @confirm="confirmCancelSession"
    />

    <FormModal
        :open="isReplayModalOpen"
        title="Manage Replay"
        submitText="Save Replay"
        cancelText="Cancel"
        @close="closeReplayModal"
        @submit="saveReplayUrl"
        >
        <div class="space-y-4">
            <div>
            <label class="mb-1 block text-sm font-medium text-gray-700">
                Replay URL
            </label>
            <input
                v-model="replayUrl"
                type="text"
                class="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm"
                placeholder="Paste replay or fallback URL"
            />
            </div>

            <p class="text-sm text-gray-500">
            Save a replay URL to mark this session replay as available.
            </p>
        </div>
    </FormModal>
  </section>
</template>