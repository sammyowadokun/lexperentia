import { defineStore } from 'pinia'
import { getCourses } from '../services/courseService'
import { loadState, saveState } from '../utils/persistStore'


export const useCourseStore = defineStore('courses', {
  state: () => ({
    courses: loadState('courses', []),
    loading: false,
    error: null,
  }),

  actions: {
    async fetchCourses() {
      this.loading = true
      this.error = null

      try {
        const data = await getCourses()
        this.courses = data
        saveState('courses', this.courses)
      } catch (error) {
        this.error = error.message || 'Failed to fetch courses'
      } finally {
        this.loading = false
      }
    },

    createCourse(courseData) {
      const newCourse = {
        id: Date.now(),
        ...courseData,
        contentCount: 0,
      }

      this.courses.unshift(newCourse)
    },

    updateCourse(courseId, updatedData) {
      const index = this.courses.findIndex((item) => item.id === courseId)

      if (index !== -1) {
        this.courses[index] = {
          ...this.courses[index],
          ...updatedData,
        }
      }
    },

    addCourseContent(courseId, contentData) {
        const course = this.courses.find((c) => c.id === courseId)

        if (course) {
            if (!course.content) {
            course.content = []
            }

            const newContent = {
            id: Date.now(),
            ...contentData,
            }

            course.content.push(newContent)
            course.contentCount = course.content.length
        }
    },

    updateCourseContent(courseId, contentId, updatedData) {
        const course = this.courses.find((c) => c.id === courseId)

        if (course && course.content) {
            const index = course.content.findIndex((item) => item.id === contentId)

            if (index !== -1) {
                course.content[index] = {
                ...course.content[index],
                ...updatedData,
            }
            }
        }
    },
  },
})