import { defineStore } from 'pinia'

export const useToastStore = defineStore('toast', {
  state: () => ({
    show: false,
    message: '',
    type: 'success',
  }),

  actions: {
    triggerToast(message, type = 'success') {
      this.message = message
      this.type = type
      this.show = true

      setTimeout(() => {
        this.show = false
        this.message = ''
      }, 2500)
    },
  },
})