<script setup>
import { ref } from 'vue'
import { computed, onMounted } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { useCourseStore } from '../../../stores/useCourseStore'
import StatusBadge from '../../../components/admin/StatusBadge.vue'
import FormModal from '../../../components/admin/FormModal.vue'

const route = useRoute()
const router = useRouter()
const courseStore = useCourseStore()

const courseId = computed(() => Number(route.params.id))

const isContentModalOpen = ref(false)
const editingContentId = ref(null)

const contentForm = ref({
  title: '',
  type: '',
  description: '',
  visibility: '',
  order: '',
})

const contentTypeOptions = [
  { label: 'Video', value: 'video' },
  { label: 'PDF', value: 'pdf' },
  { label: 'Slides', value: 'slides' },
  { label: 'Notes', value: 'notes' },
  { label: 'Replay', value: 'replay' },
]

const visibilityOptions = [
  { label: 'All Enrolled', value: 'all' },
  { label: 'Fully Paid Only', value: 'paid' },
]

const openContentModal = () => {
  isContentModalOpen.value = true
}

const closeContentModal = () => {
  isContentModalOpen.value = false
  resetContentForm()
}

const resetContentForm = () => {
  contentForm.value = {
    title: '',
    type: '',
    description: '',
    visibility: '',
    order: '',
  }
  editingContentId.value = null
}

const submitContent = () => {
  courseStore.addCourseContent(courseId.value, {
    title: contentForm.value.title,
    type: contentForm.value.type,
    description: contentForm.value.description,
    visibility: contentForm.value.visibility,
    order: Number(contentForm.value.order),
  })

  closeContentModal()
}

const course = computed(() => {
  return courseStore.courses.find((item) => item.id === courseId.value)
})

const goBack = () => {
  router.push('/admin/courses')
}

onMounted(() => {
  if (!courseStore.courses.length) {
    courseStore.fetchCourses()
  }
})
</script>

<template>
  <section class="space-y-6 p-6">
    <button
      @click="goBack"
      class="text-sm font-bold text-indigo-600 hover:underline"
    >
      ← Back to Courses
    </button>

    <div
      v-if="course"
      class="space-y-6"
    >
      <div class="rounded-xl border border-gray-200 bg-white p-6 shadow-sm">
        <h1 class="text-2xl font-bold text-gray-900">{{ course.title }}</h1>
        <p class="mt-2 text-sm text-gray-500">
          {{ course.programmeType }} · {{ course.cohort }}
        </p>

        <div class="mt-4">
          <StatusBadge :status="course.status" />
        </div>
      </div>

      <div class="grid gap-6 md:grid-cols-2">
        <div class="rounded-xl border border-gray-200 bg-white p-6 shadow-sm">
          <h2 class="text-lg font-semibold text-gray-900">Course Details</h2>

          <div class="mt-4 space-y-3 text-sm text-gray-700">
            <p><span class="font-medium">Programme Type:</span> {{ course.programmeType }}</p>
            <p><span class="font-medium">Cohort:</span> {{ course.cohort }}</p>
            <p><span class="font-medium">Status:</span> {{ course.status }}</p>
            <p><span class="font-medium">Content Items:</span> {{ course.contentCount }}</p>
          </div>
        </div>

        <div class="rounded-xl border border-gray-200 bg-white p-6 shadow-sm">
          <h2 class="text-lg font-semibold text-gray-900">Description</h2>
          <p class="mt-4 text-sm text-gray-700">
            {{ course.description }}
          </p>
        </div>
      </div>

      <div class="rounded-xl border border-gray-200 bg-white p-6 shadow-sm">
        <div class="flex items-center justify-between">
            <h2 class="text-lg font-semibold text-gray-900">Course Content</h2>

            <button
            @click="openContentModal"
            class="rounded-lg bg-indigo-600 px-4 py-2 text-sm font-medium text-white hover:bg-indigo-700"
            >
            Add Content
            </button>
        </div>

        <div v-if="course.content && course.content.length" class="mt-6 space-y-4">
            <div
            v-for="item in course.content"
            :key="item.id"
            class="rounded-lg border border-gray-200 p-4"
            >
            <div class="flex justify-between">
                <div>
                <p class="font-medium text-gray-900">{{ item.title }}</p>
                <p class="text-sm text-gray-500">
                    {{ item.type }} · {{ item.visibility }}
                </p>
                </div>

                <span class="text-sm text-gray-400">
                Order: {{ item.order }}
                </span>
            </div>

            <p class="mt-2 text-sm text-gray-600">
                {{ item.description }}
            </p>
            </div>
        </div>

        <div v-else class="mt-6 text-sm text-gray-500">
            No content added yet.
        </div>
      </div>
    </div>

    <div
      v-else
      class="rounded-xl border border-dashed border-gray-300 bg-white p-8 text-center"
    >
      <h3 class="text-lg font-semibold text-gray-800">Course not found</h3>
      <p class="mt-2 text-sm text-gray-500">This course does not exist in the current data.</p>
    </div>

    <FormModal
      :open="isContentModalOpen"
      title="Add Course Content"
      submitText="Save Content"
      cancelText="Cancel"
      @close="closeContentModal"
      @submit="submitContent"
    >
      <div class="grid gap-4 md:grid-cols-2">
        <div class="md:col-span-2">
          <label class="text-sm">Title</label>
          <input v-model="contentForm.title" class="w-full border p-2 rounded" />
        </div>

        <div>
          <label class="text-sm">Type</label>
          <select v-model="contentForm.type" class="w-full border p-2 rounded">
            <option value="">Select</option>
            <option v-for="opt in contentTypeOptions" :key="opt.value" :value="opt.value">
              {{ opt.label }}
            </option>
          </select>
        </div>

        <div>
          <label class="text-sm">Visibility</label>
          <select v-model="contentForm.visibility" class="w-full border p-2 rounded">
            <option value="">Select</option>
            <option v-for="opt in visibilityOptions" :key="opt.value" :value="opt.value">
              {{ opt.label }}
            </option>
          </select>
        </div>

        <div>
          <label class="text-sm">Order</label>
          <input type="number" v-model="contentForm.order" class="w-full border p-2 rounded" />
        </div>

        <div class="md:col-span-2">
          <label class="text-sm">Description</label>
          <textarea v-model="contentForm.description" class="w-full border p-2 rounded" />
        </div>
      </div>
    </FormModal>
  </section>
</template>