import { defineStore } from 'pinia'
import { getSessions } from '../services/sessionService'
import { loadState, saveState } from '../utils/persistStore'

export const useSessionStore = defineStore('sessions', {
  state: () => ({
    sessions: loadState('sessions', []),
    loading: false,
    error: null,
  }),

  actions: {
    async fetchSessions() {
      if (this.sessions.length) return

      this.loading = true
      this.error = null

      try {
        const data = await getSessions()
        this.sessions = data
        saveState('sessions', this.sessions)
      } catch (error) {
        this.error = error.message || 'Failed to fetch sessions'
      } finally {
        this.loading = false
      }
    },

    createSession(sessionData) {
      const newSession = {
        id: Date.now(),
        ...sessionData,
        status: 'scheduled',
        replayStatus: 'pending',
        replayUrl: '',
        zoomMeetingId: `ZM${Date.now()}`,
      }

      this.sessions.unshift(newSession)
      saveState('sessions', this.sessions)
    },

    updateSession(sessionId, updatedData) {
      const sessionIndex = this.sessions.findIndex((item) => item.id === sessionId)

      if (sessionIndex !== -1) {
        this.sessions[sessionIndex] = {
          ...this.sessions[sessionIndex],
          ...updatedData,
        }
        saveState('sessions', this.sessions)
      }
    },

    cancelSession(sessionId) {
      const session = this.sessions.find((item) => item.id === sessionId)
      if (session) {
        session.status = 'cancelled'
        saveState('sessions', this.sessions)
      }
    },

    markReplayAvailable(sessionId, replayUrl = '') {
      const session = this.sessions.find((item) => item.id === sessionId)
      if (session) {
        session.replayStatus = 'available'
        session.replayUrl = replayUrl || session.replayUrl || ''
        saveState('sessions', this.sessions)
      }
    },

    markReplayUnavailable(sessionId) {
      const session = this.sessions.find((item) => item.id === sessionId)
      if (session) {
        session.replayStatus = 'unavailable'
        session.replayUrl = ''
        saveState('sessions', this.sessions)
      }
    },
  },
})