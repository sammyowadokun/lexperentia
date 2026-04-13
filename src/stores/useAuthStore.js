import { defineStore } from 'pinia'

export const useAuthStore = defineStore('auth', {
  state: () => ({
    isAuthenticated: JSON.parse(localStorage.getItem('admin-auth') || 'false'),
    user: JSON.parse(localStorage.getItem('admin-user') || 'null'),
  }),

  actions: {
    login(credentials) {
      const adminEmail = 'admin@example.com'
      const adminPassword = 'password123'

      if (
        credentials.email === adminEmail &&
        credentials.password === adminPassword
      ) {
        this.isAuthenticated = true
        this.user = {
          email: adminEmail,
          role: 'admin',
          name: 'Super Admin',
        }

        localStorage.setItem('admin-auth', JSON.stringify(true))
        localStorage.setItem('admin-user', JSON.stringify(this.user))

        return { success: true }
      }

      return {
        success: false,
        message: 'Invalid admin credentials',
      }
    },

    logout() {
      this.isAuthenticated = false
      this.user = null

      localStorage.removeItem('admin-auth')
      localStorage.removeItem('admin-user')
    },
  },
})