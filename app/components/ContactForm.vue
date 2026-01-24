<script setup lang="ts">
import { ref, reactive } from 'vue';

const config = useRuntimeConfig();

const form = reactive({
  firstName: '',
  lastName: '',
  email: '',
  phone: '',
  message: ''
});

// We need a separate ref for the vue-tel-input v-model which might be an object or string depending on version, 
// but we want to capture the formatted number.
const rawPhone = ref('');
const formattedPhone = ref('');
const isPhoneValid = ref(false);

const isSubmitting = ref(false);
const showSuccess = ref(false);
const showError = ref(false);

const onPhoneValidate = (phoneObject: any) => {
  if (phoneObject?.valid) {
    isPhoneValid.value = true;
    formattedPhone.value = phoneObject.number; // E.164
  } else {
    isPhoneValid.value = false;
    formattedPhone.value = '';
  }
};

const submitForm = async () => {
  if (!isPhoneValid.value && rawPhone.value) {
    alert("Please enter a valid phone number.");
    return;
  }

  isSubmitting.value = true;
  showSuccess.value = false;
  showError.value = false;

  try {
    await $fetch('/api/contact', {
      method: 'POST',
      body: {
        ...form,
        phone: formattedPhone.value || form.phone // Use formatted if available
      }
    });

    showSuccess.value = true;
    // Reset form
    form.firstName = '';
    form.lastName = '';
    form.email = '';
    form.phone = '';
    rawPhone.value = '';
    formattedPhone.value = '';
    form.message = '';

  } catch (error) {
    console.error('Submission error:', error);
    showError.value = true;
  } finally {
    isSubmitting.value = false;
  }
};
</script>

<template>
  <section class="py-20 bg-gray-50">
    <div class="container mx-auto px-4 md:px-6">
      <div class="max-w-2xl mx-auto text-center mb-12">
        <h2 class="font-display text-3xl md:text-4xl font-bold text-gray-900 mb-4">Get in touch</h2>
        <p class="text-gray-500">We'd love to hear from you. Please fill out this form.</p>
      </div>

      <div class="max-w-xl mx-auto bg-white p-8 rounded-2xl shadow-sm border border-gray-100 relative">
        <!-- Notifications -->
        <div v-if="showSuccess" class="mb-6 p-4 rounded-lg bg-green-50 text-green-700 border border-green-200">
          <p class="font-bold">Message sent!</p>
          <p class="text-sm">We'll get back to you as soon as possible.</p>
        </div>
        <div v-if="showError" class="mb-6 p-4 rounded-lg bg-red-50 text-red-700 border border-red-200">
          <p class="font-bold">Something went wrong.</p>
          <p class="text-sm">Please try again later or contact us directly.</p>
        </div>

        <form class="space-y-6" @submit.prevent="submitForm">
          <div class="grid md:grid-cols-2 gap-6">
            <div class="space-y-2">
              <label for="firstName" class="text-sm font-medium text-gray-700">First name</label>
              <input v-model="form.firstName" type="text" id="firstName" placeholder="First name" required class="w-full rounded-lg border border-gray-300 px-4 py-3 text-sm focus:border-[#E60000] focus:ring-[#E60000] focus:outline-none" />
            </div>
            <div class="space-y-2">
              <label for="lastName" class="text-sm font-medium text-gray-700">Last name</label>
              <input v-model="form.lastName" type="text" id="lastName" placeholder="Last name" required class="w-full rounded-lg border border-gray-300 px-4 py-3 text-sm focus:border-[#E60000] focus:ring-[#E60000] focus:outline-none" />
            </div>
          </div>

          <div class="space-y-2">
            <label for="email" class="text-sm font-medium text-gray-700">Email</label>
            <input v-model="form.email" type="email" id="email" placeholder="you@company.com" required class="w-full rounded-lg border border-gray-300 px-4 py-3 text-sm focus:border-[#E60000] focus:ring-[#E60000] focus:outline-none" />
          </div>

          <div class="space-y-2">
            <label for="phone" class="text-sm font-medium text-gray-700">Phone number</label>
             <client-only>
              <vue-tel-input
                v-model="rawPhone"
                mode="international"
                :preferred-countries="['GH']"
                :valid-characters-only="true"
                @validate="onPhoneValidate"
                class="!w-full !rounded-lg !border !border-gray-300 !text-sm focus-within:!border-[#E60000] focus-within:!ring-[#E60000] focus-within:!outline-none"
                :inputOptions="{
                  placeholder: 'Enter your phone number',
                  styleClasses: '!w-full !border-none !outline-none !shadow-none !bg-transparent !h-[46px] !px-4 !py-3'
                }"
              ></vue-tel-input>
            </client-only>
          </div>

          <div class="space-y-2">
            <label for="message" class="text-sm font-medium text-gray-700">Message</label>
            <textarea v-model="form.message" id="message" rows="4" placeholder="Leave us a message..." required class="w-full rounded-lg border border-gray-300 px-4 py-3 text-sm focus:border-[#E60000] focus:ring-[#E60000] focus:outline-none resize-none"></textarea>
          </div>

          <button type="submit" :disabled="isSubmitting" class="w-full bg-[#E60000] text-white font-bold py-3 px-6 rounded-full hover:bg-red-700 transition-colors disabled:opacity-70 disabled:cursor-not-allowed">
            <span v-if="isSubmitting">Sending...</span>
            <span v-else>Send message</span>
          </button>
        </form>
      </div>
    </div>
  </section>
</template>

<style>
/* Overrides for vue-tel-input default styles to match theme */
.vue-tel-input {
  border: 1px solid #d1d5db !important;
  border-radius: 0.5rem !important;
}
.vue-tel-input:focus-within {
  border-color: #E60000 !important;
  box-shadow: 0 0 0 1px #E60000 !important;
}
.vti__dropdown {
  border-right: 1px solid #d1d5db !important;
}
.vti__input {
  border: none !important;
  border-radius: 0 0.5rem 0.5rem 0 !important;
}
</style>
