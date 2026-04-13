import { defineStore } from 'pinia'
import { getMentors } from '../services/mentorService'
import { loadState, saveState } from '../utils/persistStore'


export const useMentorStore = defineStore('mentors', {
  state: () => ({
    mentors: loadState('mentors', []),
    loading: false,
    error: null,
  }),

  actions: {
    async fetchMentors() {
      this.loading = true
      this.error = null

      try {
        const data = await getMentors()
        this.mentors = data
        saveState('mentors', this.mentors)
      } catch (error) {
        this.error = error.message || 'Failed to fetch mentors'
      } finally {
        this.loading = false
      }
    },

    createMentor(mentorData) {
      const newMentor = {
        id: Date.now(),
        ...mentorData,
        profilePhoto: '',
      }

      this.mentors.unshift(newMentor)
    },

    updateMentor(mentorId, updatedData) {
      const index = this.mentors.findIndex((item) => item.id === mentorId)

      if (index !== -1) {
        this.mentors[index] = {
          ...this.mentors[index],
          ...updatedData,
        }
      }
    },
  },
})