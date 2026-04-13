import { defineStore } from 'pinia'
import { getAttendanceRecords } from '../services/attendanceService'
import { loadState, saveState } from '../utils/persistStore'

export const useAttendanceStore = defineStore('attendance', {
  state: () => ({
    records: loadState('attendance', []),
    loading: false,
    error: null,
  }),

  actions: {
    async fetchAttendance() {
      if (this.records.length) return

      this.loading = true
      this.error = null

      try {
        const data = await getAttendanceRecords()
        this.records = data
        saveState('attendance', this.records)
      } catch (error) {
        this.error = error.message || 'Failed to fetch attendance'
      } finally {
        this.loading = false
      }
    },

    markPresent(recordId) {
      const record = this.records.find((item) => item.id === recordId)
      if (record) {
        record.status = 'present'
        saveState('attendance', this.records)
      }
    },

    markAbsent(recordId) {
      const record = this.records.find((item) => item.id === recordId)
      if (record) {
        record.status = 'absent'
        saveState('attendance', this.records)
      }
    },
  },
})