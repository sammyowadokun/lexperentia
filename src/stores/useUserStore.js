import { defineStore } from 'pinia'
import { getUsers } from '../services/userService'
import { loadState, saveState } from '../utils/persistStore'


export const useUserStore = defineStore('users', {
  state: () => ({
    users: loadState('users', []),
    loading: false,
    error: null,
  }),

  actions: {
    async fetchUsers() {
      this.loading = true
      this.error = null

      try {
        const data = await getUsers()
        this.users = data
        saveState('users', this.users)
      } catch (error) {
        this.error = error.message || 'Failed to fetch users'
      } finally {
        this.loading = false
      }
    },

    disableUserAccess(userId, reason = '', note = '') {
      const user = this.users.find((item) => item.id === userId)
      if (user) {
        user.enrolmentStatus = 'disabled'
        user.accessDisabledReason = reason
        user.accessDisabledNote = note
      }
    },

    reEnableUserAccess(userId) {
      const user = this.users.find((item) => item.id === userId)
      if (user) {
        user.enrolmentStatus = 'active'
        user.accessDisabledReason = ''
        user.accessDisabledNote = ''
      }
    },

    markPaymentReceived(userId) {
      const user = this.users.find((item) => item.id === userId)
      if (user) {
        user.paymentStatus = 'fully paid'
        user.instalment2Amount = user.instalment2Amount === '—' ? '₦60,000' : user.instalment2Amount
        user.instalment2Date = new Date().toISOString().split('T')[0]
        user.totalPaid = '₦100,000'
        user.outstandingBalance = '₦0'
        user.enrolmentStatus = 'active'
        user.accessDisabledReason = ''
        user.accessDisabledNote = ''
      }
    },
  },
})