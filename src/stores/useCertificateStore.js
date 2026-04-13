import { defineStore } from 'pinia'
import { getCertificates } from '../services/certificateService'
import { loadState, saveState } from '../utils/persistStore'

export const useCertificateStore = defineStore('certificates', {
  state: () => ({
    certificates: loadState('certificates', []),
    loading: false,
    error: null,
  }),

  actions: {
    async fetchCertificates() {
      if (this.certificates.length) return

      this.loading = true
      this.error = null

      try {
        const data = await getCertificates()
        this.certificates = data
        saveState('certificates', this.certificates)
      } catch (error) {
        this.error = error.message || 'Failed to fetch certificates'
      } finally {
        this.loading = false
      }
    },

    approveCertificate(certificateId) {
      const item = this.certificates.find((cert) => cert.id === certificateId)
      if (item && item.eligibilityStatus === 'eligible') {
        item.certificateStatus = 'issued'
        item.verificationId = item.verificationId || `CERT-${Date.now()}`
        saveState('certificates', this.certificates)
      }
    },

    revokeCertificate(certificateId) {
      const item = this.certificates.find((cert) => cert.id === certificateId)
      if (item) {
        item.certificateStatus = 'revoked'
        saveState('certificates', this.certificates)
      }
    },

    findByVerificationId(verificationId) {
      return this.certificates.find(
        (item) => item.verificationId?.toLowerCase() === verificationId.toLowerCase()
      )
    },
  },
})