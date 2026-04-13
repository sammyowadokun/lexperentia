import { defineStore } from 'pinia'
import { getReferrals } from '../services/referralService'
import { loadState, saveState } from '../utils/persistStore'

export const useReferralStore = defineStore('referrals', {
  state: () => ({
    referrals: loadState('referrals', []),
    loading: false,
    error: null,
  }),

  actions: {
    async fetchReferrals() {
      if (this.referrals.length) return

      this.loading = true
      this.error = null

      try {
        const data = await getReferrals()
        this.referrals = data
        saveState('referrals', this.referrals)
      } catch (error) {
        this.error = error.message || 'Failed to fetch referrals'
      } finally {
        this.loading = false
      }
    },
  },
})