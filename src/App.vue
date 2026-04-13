<script setup>
import { ref, watch, onMounted } from 'vue'
import { useRoute } from 'vue-router'
import Sidebar from './components/admin/SideBar.vue'
import AppToast from './components/admin/AppToast.vue'
import { computed } from 'vue'

const route = useRoute()
const isSidebarCollapsed = ref(false)

onMounted(() => {
  const saved = localStorage.getItem('sidebar-collapsed')
  if (saved !== null) {
    isSidebarCollapsed.value = JSON.parse(saved)
  }
})

watch(isSidebarCollapsed, (value) => {
  localStorage.setItem('sidebar-collapsed', JSON.stringify(value))
})

const toggleSidebar = () => {
  isSidebarCollapsed.value = !isSidebarCollapsed.value
}

const showSidebar = computed(() => {
  return route.path !== '/admin/login'
})
</script>

<template>
  <div class="flex min-h-screen bg-gray-50">
    <Sidebar
      v-if="showSidebar"
      :collapsed="isSidebarCollapsed"
      @toggle="toggleSidebar"
    />

    <main class="flex-1 overflow-y-auto">
      <router-view />
    </main>

    <app-toast />
  </div>
</template>