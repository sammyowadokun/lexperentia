<script setup>
import { computed, onMounted } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { useSessionStore } from '../../../stores/useSessionStore'
import StatusBadge from '../../../components/admin/StatusBadge.vue'

const route = useRoute()
const router = useRouter()
const sessionStore = useSessionStore()

const sessionId = computed(() => Number(route.params.id))

const session = computed(() => {
  return sessionStore.sessions.find((item) => item.id === sessionId.value)
})

const goBack = () => {
  router.push('/admin/sessions')
}

onMounted(() => {
  if (!sessionStore.sessions.length) {
    sessionStore.fetchSessions()
  }
})
</script>

<template>
  <section class="space-y-6 p-6">
    <button
      @click="goBack"
      class="text-sm font-bold text-indigo-600 hover:underline"
    >
      ← Back to Sessions
    </button>

    <div
      v-if="session"
      class="space-y-6"
    >
      <div class="rounded-xl border border-gray-200 bg-white p-6 shadow-sm">
        <h1 class="text-2xl font-bold text-gray-900">{{ session.title }}</h1>
        <p class="mt-2 text-sm text-gray-500">
          {{ session.programmeType }} · {{ session.cohort }}
        </p>

        <div class="mt-4 flex flex-wrap gap-3">
          <StatusBadge :status="session.status" />
          <StatusBadge :status="session.replayStatus" />
        </div>
      </div>

      <div class="grid gap-6 md:grid-cols-2">
        <div class="rounded-xl border border-gray-200 bg-white p-6 shadow-sm">
          <h2 class="text-lg font-semibold text-gray-900">Session Details</h2>

          <div class="mt-4 space-y-3 text-sm text-gray-700">
            <p><span class="font-medium">Facilitator:</span> {{ session.facilitator }}</p>
            <p><span class="font-medium">Date:</span> {{ session.date }}</p>
            <p><span class="font-medium">Time:</span> {{ session.time }}</p>
            <p><span class="font-medium">Duration:</span> {{ session.duration }} mins</p>
            <p><span class="font-medium">Session Type:</span> {{ session.sessionType }}</p>
            <p><span class="font-medium">Zoom Meeting ID:</span> {{ session.zoomMeetingId }}</p>
          </div>
        </div>

        <div class="rounded-xl border border-gray-200 bg-white p-6 shadow-sm">
          <h2 class="text-lg font-semibold text-gray-900">Session Summary</h2>

          <div class="mt-4 space-y-3 text-sm text-gray-700">
            <p><span class="font-medium">Attendance:</span> Coming next</p>
            <p><span class="font-medium">Replay:</span> {{ session.replayStatus }}</p>
            <p>
                <span class="font-medium">Replay URL:</span> 
                {{ session.replayUrl || 'Not available' }}
            </p>
            <p><span class="font-medium">Join Flow:</span> Platform-gated redirect</p>
            <p><span class="font-medium">Zoom Sync:</span> Backend integration later</p>
          </div>
        </div>
      </div>
    </div>

    <div
      v-else
      class="rounded-xl border border-dashed border-gray-300 bg-white p-8 text-center"
    >
      <h3 class="text-lg font-semibold text-gray-800">Session not found</h3>
      <p class="mt-2 text-sm text-gray-500">This session does not exist in the current data.</p>
    </div>
  </section>
</template>