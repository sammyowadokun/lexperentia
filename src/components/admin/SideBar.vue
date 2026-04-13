<script setup>
import { computed } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import {
  LayoutDashboard,
  Users,
  CreditCard,
  Layers,
  BookOpen,
  CalendarDays,
  ClipboardList,
  Award,
  Share2,
  UserCircle,
  ShieldCheck,
  PanelLeftClose,
  PanelLeftOpen,
} from 'lucide-vue-next'
import { LogOut } from 'lucide-vue-next'
import { useAuthStore } from '../../stores/useAuthStore'


const props = defineProps({
  collapsed: {
    type: Boolean,
    default: false,
  },
})
const emit = defineEmits(['toggle'])

const route = useRoute()
const router = useRouter()
const authStore = useAuthStore()

const navGroups = computed(() => [
  {
    title: 'Overview',
    items: [
      { label: 'Dashboard', path: '/admin', icon: LayoutDashboard },
    ],
  },
  {
    title: 'Management',
    items: [
      { label: 'Users', path: '/admin/users', icon: Users },
      { label: 'Payments', path: '/admin/payments', icon: CreditCard },
      { label: 'Cohorts', path: '/admin/cohorts', icon: Layers },
      { label: 'Courses', path: '/admin/courses', icon: BookOpen },
      { label: 'Sessions', path: '/admin/sessions', icon: CalendarDays },
      { label: 'Attendance', path: '/admin/attendance', icon: ClipboardList },
      { label: 'Certificates', path: '/admin/certificates', icon: Award },
    ],
  },
  {
    title: 'Network',
    items: [
      { label: 'Referrals', path: '/admin/referrals', icon: Share2 },
      { label: 'Mentors', path: '/admin/mentors', icon: UserCircle },
    ],
  },
  {
    title: 'Public',
    items: [
      { label: 'Verify Certificate', path: '/verify', icon: ShieldCheck },
    ],
  },
])

const isActive = (path) => {
  if (path === '/admin') {
    return route.path === '/admin'
  }

  return route.path.startsWith(path)
}

const goTo = (path) => {
  router.push(path)
}

const handleLogout = () => {
  authStore.logout()
  router.push('/admin/login')
}
</script>

<template>
  <aside
    class="flex h-screen flex-col border-r border-gray-200 bg-white transition-all duration-300"
    :class="collapsed ? 'w-24' : 'w-72'"
  >
    <div
      class="flex items-center border-b border-gray-200 px-4 py-5"
      :class="collapsed ? 'justify-center' : 'justify-between'"
    >
      <div v-if="!collapsed">
        <h1 class="text-4xl font-bold text-gray-900">lexperentia</h1>
        <p class="mt-1 text-sm text-gray-500">Legal Learning Platform</p>
      </div>

      <button
        @click="emit('toggle')"
        class="rounded-lg border border-gray-200 p-2 text-gray-600 hover:bg-gray-50"
      >
        <PanelLeftClose v-if="!collapsed" class="h-5 w-5" />
        <PanelLeftOpen v-else class="h-5 w-5" />
      </button>
    </div>

    <nav class="flex-1 overflow-y-auto px-3 py-5">
      <div
        v-for="group in navGroups"
        :key="group.title"
        class="mb-6"
      >
        <p
          v-if="!collapsed"
          class="mb-3 px-3 text-xs font-semibold uppercase tracking-wider text-gray-400"
        >
          {{ group.title }}
        </p>

        <div class="space-y-1">
          <button
            v-for="item in group.items"
            :key="item.path"
            @click="goTo(item.path)"
            class="flex w-full items-center rounded-xl px-3 py-2.5 text-left text-sm font-medium transition"
            :class="[
              collapsed ? 'justify-center' : 'gap-3',
              isActive(item.path)
                ? 'border border-indigo-100 bg-indigo-50 text-indigo-700'
                : 'text-gray-700 hover:bg-gray-50 hover:text-gray-900'
            ]"
            :title="collapsed ? item.label : ''"
          >
            <component
              :is="item.icon"
              class="h-4 w-4 shrink-0"
              :class="isActive(item.path) ? 'text-indigo-600' : 'text-gray-400'"
            />

            <span v-if="!collapsed">{{ item.label }}</span>
          </button>
        </div>
      </div>
    </nav>

    <div class="border-t border-gray-200 p-3">
      <button
        @click="handleLogout"
        class="flex w-full items-center rounded-xl px-3 py-2.5 text-left text-sm font-medium text-red-600 transition hover:bg-red-50"
        :class="collapsed ? 'justify-center' : 'gap-3'"
        :title="collapsed ? 'Logout' : ''"
      >
        <LogOut class="h-4 w-4 shrink-0" />
        <span v-if="!collapsed">Logout</span>
      </button>
    </div>
  </aside>
</template>