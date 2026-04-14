<script setup>
import { computed, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import PageHeader from '../../../components/admin/PageHeader.vue'
import MetricCard from '../../../components/admin/MetricCard.vue'
import { useUserStore } from '../../../stores/useUserStore'
import { useCohortStore } from '../../../stores/useCohortStore'
import { useCourseStore } from '../../../stores/useCourseStore'
import { useSessionStore } from '../../../stores/useSessionStore'
import { useMentorStore } from '../../../stores/useMentorStore'
import { useCertificateStore } from '../../../stores/useCertificateStore'
import RevenueChart from '../../../components/admin/RevenueChart.vue'
import SessionsStatusChart from '../../../components/admin/SessionsStatusChart.vue'
import UsersStatusChart from '../../../components/admin/UsersStatusChart.vue'

const router = useRouter()

const userStore = useUserStore()
const cohortStore = useCohortStore()
const courseStore = useCourseStore()
const sessionStore = useSessionStore()
const mentorStore = useMentorStore()
const certificateStore = useCertificateStore()

onMounted(() => {
  if (!userStore.users.length) userStore.fetchUsers()
  if (!cohortStore.cohorts.length) cohortStore.fetchCohorts()
  if (!courseStore.courses.length) courseStore.fetchCourses()
  if (!sessionStore.sessions.length) sessionStore.fetchSessions()
  if (!mentorStore.mentors.length) mentorStore.fetchMentors()
  if (!certificateStore.certificates.length) certificateStore.fetchCertificates()
})

const totalUsers = computed(() => userStore.users.length)

const activeEnrolments = computed(() =>
  userStore.users.filter((user) => user.enrolmentStatus === 'active').length
)

const pendingPayments = computed(() =>
  userStore.users.filter((user) => user.paymentStatus === 'partial').length
)

const totalRevenue = computed(() => {
  const total = userStore.users.reduce((sum, user) => {
    const amount = Number(String(user.totalPaid || '0').replace(/[₦,]/g, ''))
    return sum + amount
  }, 0)

  return `₦${total.toLocaleString()}`
})

const liveCohorts = computed(() =>
  cohortStore.cohorts.filter((cohort) => cohort.status === 'open').length
)

const upcomingSessions = computed(() =>
  sessionStore.sessions.filter((session) => session.status === 'scheduled').length
)

const publishedCourses = computed(() =>
  courseStore.courses.filter((course) => course.status === 'published').length
)

const visibleMentors = computed(() =>
  mentorStore.mentors.filter((mentor) => mentor.visibility === 'shown').length
)

const issuedCertificates = computed(() =>
  certificateStore.certificates.filter((item) => item.certificateStatus === 'issued').length
)

const replayReadySessions = computed(() =>
  sessionStore.sessions.filter((session) => session.replayStatus === 'available').length
)

const goToUsers = () => router.push('/admin/users')
const goToPayments = () => router.push('/admin/payments')
const goToSessions = () => router.push('/admin/sessions')
const goToCourses = () => router.push('/admin/courses')
const goToCohorts = () => router.push('/admin/cohorts')
const goToMentors = () => router.push('/admin/mentors')
const goToCertificates = () => router.push('/admin/certificates')
</script>

<template>
  <section class="space-y-10 p-10">
    <PageHeader
      title="Admin Dashboard"
      subtitle="Monitor users, payments, sessions, courses, and overall platform activity."
    />

    <div class="rounded-2xl bg-linear-to-r from-indigo-100 to-purple-400 p-6 text-white shadow-md">
      <h2 class="text-2xl font-bold text-indigo-700">Admin Control Center</h2>
      <p class="mt-2 max-w-2xl text-sm text-slate-700">
        Track platform health, manage operations across cohorts, and respond quickly to payment,
        session, and learning activity.
      </p>
    </div>

    <div class="grid gap-7 md:grid-cols-2 xl:grid-cols-4">
      <div @click="goToUsers" class="cursor-pointer">
        <MetricCard
          title="Total Registered Users"
          :value="totalUsers"
          subtitle="All accounts on the platform"
        />
      </div>

      <div @click="goToUsers" class="cursor-pointer">
        <MetricCard
          title="Active Enrolments"
          :value="activeEnrolments"
          subtitle="Users with active access"
        />
      </div>

      <div @click="goToPayments" class="cursor-pointer">
        <MetricCard
          title="Total Revenue"
          :value="totalRevenue"
          subtitle="Sum of completed payments"
        />
      </div>

      <div @click="goToPayments" class="cursor-pointer">
        <MetricCard
          title="Pending Payments"
          :value="pendingPayments"
          subtitle="Users who paid partially"
        />
      </div>
    </div>

    <div class="grid gap-6 xl:grid-cols-3">
      <RevenueChart :users="userStore.users" />
      <SessionsStatusChart :sessions="sessionStore.sessions" />
      <UsersStatusChart :users="userStore.users" />
    </div>

    <div class="grid gap-6 lg:grid-cols-2">
      <div class="rounded-2xl border border-gray-200 bg-white p-6 shadow-sm">
        <h3 class="text-lg font-semibold text-gray-900">Quick Access</h3>
        <p class="mt-1 text-sm text-gray-500">Jump into key admin workflows.</p>

        <div class="mt-5 grid gap-4 sm:grid-cols-2">
          <button
            @click="goToUsers"
            class="rounded-xl border border-gray-200 px-4 py-4 text-left transition hover:bg-gray-50"
          >
            <p class="font-semibold text-gray-900">Users</p>
            <p class="mt-1 text-sm text-gray-500">Manage registrations and access</p>
          </button>

          <button
            @click="goToPayments"
            class="rounded-xl border border-gray-200 px-4 py-4 text-left transition hover:bg-gray-50"
          >
            <p class="font-semibold text-gray-900">Payments</p>
            <p class="mt-1 text-sm text-gray-500">Track instalments and balances</p>
          </button>

          <button
            @click="goToSessions"
            class="rounded-xl border border-gray-200 px-4 py-4 text-left transition hover:bg-gray-50"
          >
            <p class="font-semibold text-gray-900">Sessions</p>
            <p class="mt-1 text-sm text-gray-500">Schedule and monitor live classes</p>
          </button>

          <button
            @click="goToCourses"
            class="rounded-xl border border-gray-200 px-4 py-4 text-left transition hover:bg-gray-50"
          >
            <p class="font-semibold text-gray-900">Courses</p>
            <p class="mt-1 text-sm text-gray-500">Manage course structure and content</p>
          </button>
        </div>
      </div>

      <div class="rounded-2xl border border-gray-200 bg-white p-6 shadow-sm">
        <h3 class="text-lg font-semibold text-gray-900">Operational Snapshot</h3>
        <p class="mt-1 text-sm text-gray-500">A quick system-wide summary.</p>

        <div class="mt-5 space-y-4">
          <div class="flex items-center justify-between rounded-xl border-gray-100 bg-gray-50 px-4 py-3">
            <span class="text-sm text-gray-600">Live Cohorts</span>
            <button @click="goToCohorts" class="font-semibold text-indigo-600 hover:underline">
              {{ liveCohorts }}
            </button>
          </div>

          <div class="flex items-center justify-between rounded-xl bg-gray-50 px-4 py-3">
            <span class="text-sm text-gray-600">Upcoming Sessions</span>
            <button @click="goToSessions" class="font-semibold text-indigo-600 hover:underline">
              {{ upcomingSessions }}
            </button>
          </div>

          <div class="flex items-center justify-between rounded-xl bg-gray-50 px-4 py-3">
            <span class="text-sm text-gray-600">Published Courses</span>
            <button @click="goToCourses" class="font-semibold text-indigo-600 hover:underline">
              {{ publishedCourses }}
            </button>
          </div>

          <div class="flex items-center justify-between rounded-xl bg-gray-50 px-4 py-3">
            <span class="text-sm text-gray-600">Visible Mentors</span>
            <button @click="goToMentors" class="font-semibold text-indigo-600 hover:underline">
              {{ visibleMentors }}
            </button>
          </div>

          <div class="flex items-center justify-between rounded-xl bg-gray-50 px-4 py-3">
            <span class="text-sm text-gray-600">Issued Certificates</span>
            <button @click="goToCertificates" class="font-semibold text-indigo-600 hover:underline">
              {{ issuedCertificates }}
            </button>
          </div>

          <div class="flex items-center justify-between rounded-xl bg-gray-50 px-4 py-3">
            <span class="text-sm text-gray-600">Replay-Ready Sessions</span>
            <button @click="goToSessions" class="font-semibold text-indigo-600 hover:underline">
              {{ replayReadySessions }}
            </button>
          </div>
        </div>
      </div>
    </div>
  </section>
</template>