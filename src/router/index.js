import { createRouter, createWebHistory } from 'vue-router'
import { useAuthStore } from '../stores/useAuthStore'

const routes = [
  {
    path: '/admin/login',
    name: 'admin-login',
    component: () => import('../modules/auth/pages/AdminLoginPage.vue'),
  },
  {
    path: '/admin',
    name: 'admin-dashboard',
    component: () => import('../modules/dashboard/pages/AdminDashboardPage.vue'),
    meta: { requiresAdminAuth: true },
  },
  {
    path: '/admin/users',
    name: 'users',
    component: () => import('../modules/users/pages/UsersPage.vue'),
    meta: { requiresAdminAuth: true },
  },
  {
    path: '/admin/users/:id',
    name: 'user-profile',
    component: () => import('../modules/users/pages/UserProfilePage.vue'),
    meta: { requiresAdminAuth: true },
  },
  {
    path: '/admin/payments',
    name: 'payments',
    component: () => import('../modules/payments/pages/PaymentsPage.vue'),
    meta: { requiresAdminAuth: true },
  },
  {
    path: '/admin/cohorts',
    name: 'cohorts',
    component: () => import('../modules/cohorts/pages/CohortsPage.vue'),
    meta: { requiresAdminAuth: true },
  },
  {
    path: '/admin/cohorts/:id',
    name: 'cohort-detail',
    component: () => import('../modules/cohorts/pages/CohortDetailPage.vue'),
    meta: { requiresAdminAuth: true },
  },
  {
    path: '/admin/sessions',
    name: 'sessions',
    component: () => import('../modules/sessions/pages/SessionsPage.vue'),
    meta: { requiresAdminAuth: true },
  },
  {
    path: '/admin/sessions/:id',
    name: 'session-detail',
    component: () => import('../modules/sessions/pages/SessionDetailPage.vue'),
    meta: { requiresAdminAuth: true },
  },
  {
    path: '/admin/courses',
    name: 'courses',
    component: () => import('../modules/courses/pages/CoursesPage.vue'),
    meta: { requiresAdminAuth: true },
  },
  {
    path: '/admin/courses/:id',
    name: 'course-detail',
    component: () => import('../modules/courses/pages/CourseDetailPage.vue'),
    meta: { requiresAdminAuth: true },
  },
  {
    path: '/admin/attendance',
    name: 'attendance',
    component: () => import('../modules/attendance/pages/AttendancePage.vue'),
    meta: { requiresAdminAuth: true },
  },
  {
    path: '/admin/certificates',
    name: 'certificates',
    component: () => import('../modules/certificates/pages/CertificatesPage.vue'),
    meta: { requiresAdminAuth: true },
  },
  {
    path: '/admin/referrals',
    name: 'referrals',
    component: () => import('../modules/referrals/pages/ReferralsPage.vue'),
    meta: { requiresAdminAuth: true },
  },
  {
    path: '/admin/referrals/:id',
    name: 'referral-detail',
    component: () => import('../modules/referrals/pages/ReferralDetailPage.vue'),
    meta: { requiresAdminAuth: true },
  },
  {
    path: '/admin/mentors',
    name: 'mentors',
    component: () => import('../modules/mentors/pages/MentorsPage.vue'),
    meta: { requiresAdminAuth: true },
  },
  {
    path: '/verify',
    name: 'certificate-verify',
    component: () => import('../modules/certificates/pages/CertificateVerifyPage.vue'),
  },
]

const router = createRouter({
  history: createWebHistory(),
  routes,
})

router.beforeEach((to) => {
  const authStore = useAuthStore()

  if (to.meta.requiresAdminAuth && !authStore.isAuthenticated) {
    return '/admin/login'
  }

  if (to.path === '/admin/login' && authStore.isAuthenticated) {
    return '/admin'
  }
})

export default router