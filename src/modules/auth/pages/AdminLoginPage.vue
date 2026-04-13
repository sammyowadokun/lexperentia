<script setup>
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import { useAuthStore } from '../../../stores/useAuthStore'

const router = useRouter()
const authStore = useAuthStore()

const email = ref('')
const password = ref('')
const errorMessage = ref('')

const handleLogin = () => {
  errorMessage.value = ''

  const result = authStore.login({
    email: email.value,
    password: password.value,
  })

  if (result.success) {
    router.push('/admin')
  } else {
    errorMessage.value = result.message
  }
}
</script>

<template>
  <div class="flex min-h-screen items-center justify-center bg-gray-100 px-4">
    <div class="w-full max-w-md rounded-2xl bg-white p-8 shadow-lg">
      <div class="mb-6 text-center">
        <h1 class="text-2xl font-bold text-gray-900">Admin Login</h1>
        <p class="mt-2 text-sm text-gray-500">
          Sign in to the Super Admin dashboard
        </p>
      </div>

      <div class="space-y-4">
        <div>
          <label class="mb-1 block text-sm font-medium text-gray-700">Email</label>
          <input
            v-model="email"
            type="email"
            class="w-full rounded-lg border border-gray-300 px-6 py-3 text-sm"
            placeholder="Enter admin email"
          />
        </div>

        <div>
          <label class="mb-1 block text-sm font-medium text-gray-700">Password</label>
          <input
            v-model="password"
            type="password"
            class="w-full rounded-lg border border-gray-300 px-6 py-3 text-sm"
            placeholder="Enter password"
          />
        </div>

        <p v-if="errorMessage" class="text-sm text-red-600">
          {{ errorMessage }}
        </p>

        <button
          @click="handleLogin"
          class="w-full rounded-lg bg-indigo-600 px-8 py-4 text-sm font-medium text-white hover:bg-indigo-700"
        >
          Sign In
        </button>
      </div>

      <div class="mt-6 rounded-lg bg-gray-100 p-5 text-xs text-gray-900">
        Demo login:<br />
        <span class="font-medium">Email:</span> admin@example.com<br />
        <span class="font-medium">Password:</span> password123
      </div>
    </div>
  </div>
</template>