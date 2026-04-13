<script setup>
import { ref, onMounted } from 'vue'
import PageHeader from '../../../components/admin/PageHeader.vue'
import { useCertificateStore } from '../../../stores/useCertificateStore'

const certificateStore = useCertificateStore()

const verificationId = ref('')
const result = ref(null)
const searched = ref(false)

const handleVerify = () => {
  result.value = certificateStore.findByVerificationId(verificationId.value.trim())
  searched.value = true
}

onMounted(() => {
  if (!certificateStore.certificates.length) {
    certificateStore.fetchCertificates()
  }
})
</script>

<template>
  <section class="mx-auto max-w-3xl space-y-6 p-6">
    <PageHeader
      title="Certificate Verification"
      subtitle="Enter a certificate verification ID to confirm its authenticity."
    />

    <div class="rounded-xl border border-gray-200 bg-white p-6 shadow-sm">
      <label class="mb-2 block text-sm font-medium text-gray-700">
        Verification ID
      </label>

      <div class="flex flex-col gap-3 md:flex-row">
        <input
          v-model="verificationId"
          type="text"
          class="w-full rounded-lg border border-gray-300 px-4 py-2 text-sm"
          placeholder="Enter certificate ID"
        />

        <button
          @click="handleVerify"
          class="rounded-lg bg-indigo-600 px-5 py-2 text-sm font-medium text-white hover:bg-indigo-700"
        >
          Verify
        </button>
      </div>
    </div>

    <div
      v-if="searched && result"
      class="rounded-xl border border-green-200 bg-green-50 p-6"
    >
      <h2 class="text-lg font-semibold text-green-700">Certificate Valid</h2>

      <div class="mt-4 space-y-2 text-sm text-gray-700">
        <p><span class="font-medium">Student Name:</span> {{ result.studentName }}</p>
        <p><span class="font-medium">Email:</span> {{ result.studentEmail }}</p>
        <p><span class="font-medium">Programme:</span> {{ result.programme }}</p>
        <p><span class="font-medium">Cohort:</span> {{ result.cohort }}</p>
        <p><span class="font-medium">Certificate Status:</span> {{ result.certificateStatus }}</p>
        <p><span class="font-medium">Verification ID:</span> {{ result.verificationId }}</p>
      </div>
    </div>

    <div
      v-else-if="searched && !result"
      class="rounded-xl border border-red-200 bg-red-50 p-6"
    >
      <h2 class="text-lg font-semibold text-red-700">Certificate Invalid</h2>
      <p class="mt-2 text-sm text-gray-700">
        No certificate was found for that verification ID.
      </p>
    </div>
  </section>
</template>