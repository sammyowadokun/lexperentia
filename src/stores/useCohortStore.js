import { defineStore } from 'pinia'
import { getCohorts } from '../services/cohortService'
import { loadState, saveState } from '../utils/persistStore'

export const useCohortStore = defineStore('cohorts', {
  state: () => ({
    cohorts: loadState('cohorts', []),
    loading: false,
    error: null,
  }),

  actions: {
    async fetchCohorts() {
      if (this.cohorts.length) return

      this.loading = true
      this.error = null

      try {
        const data = await getCohorts()
        this.cohorts = data
        saveState('cohorts', this.cohorts)
      } catch (error) {
        this.error = error.message || 'Failed to fetch cohorts'
      } finally {
        this.loading = false
      }
    },
  },
})