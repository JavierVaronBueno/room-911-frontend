<template>
  <div class="flex items-center justify-center min-h-screen">
    <div class="bg-white p-6 rounded-lg shadow-lg w-full max-w-md">
      <h2 class="text-2xl font-bold mb-6 text-center text-blue-800">Register</h2>
      <form @submit.prevent="register">
        <div class="mb-4">
          <label class="block text-gray-700">First Name</label>
          <input v-model="form.first_name" type="text" class="w-full p-2 border rounded" required />
        </div>
        <div class="mb-4">
          <label class="block text-gray-700">Last Name</label>
          <input v-model="form.last_name" type="text" class="w-full p-2 border rounded" required />
        </div>
        <div class="mb-4">
          <label class="block text-gray-700">Email</label>
          <input v-model="form.email" type="email" class="w-full p-2 border rounded" required />
        </div>
        <div class="mb-4">
          <label class="block text-gray-700">Password</label>
          <input v-model="form.password" type="password" class="w-full p-2 border rounded" required />
        </div>
        <div class="mb-6">
          <label class="block text-gray-700">Confirm Password</label>
          <input v-model="form.password_confirmation" type="password" class="w-full p-2 border rounded" required />
        </div>
        <button type="submit" class="w-full bg-blue-800 text-white p-2 rounded hover:bg-blue-900">
          Register
        </button>
      </form>
      <p class="mt-4 text-center">
        Already have an account? 
        <router-link to="/login" class="text-blue-600 hover:underline">Log in</router-link>
      </p>
      <p v-if="error" class="text-red-500 mt-4 text-center">{{ error }}</p>
      <p v-if="success" class="text-green-500 mt-4 text-center">{{ success }}</p>
    </div>
  </div>
</template>

<script>
import axios from 'axios';

/**
 * Register view for creating a new user account.
 * Submits user details and redirects to login on success.
 */
export default {
  data() {
    return {
      form: {
        first_name: '',
        last_name: '',
        email: '',
        rol: 'admin_room_911',
        password: '',
        password_confirmation: '',
      },
      error: '',
      success: '',
    };
  },
  methods: {
    /**
     * Registers a new user with the provided details.
     * @async
     */
    async register() {
      this.error = '';
      this.success = '';
      if (this.form.password !== this.form.password_confirmation) {
        this.error = 'Passwords do not match';
        return;
      }
      try {
        const response = await axios.post(
          'http://localhost/room-911-backend/public/api/v1/auth/register',
          this.form
        );
        this.success = 'Registration successful. Please log in.';
        this.resetForm();
        setTimeout(() => this.$router.push('/login'), 2000); // Redirects to login after 2 seconds
      } catch (error) {
        this.error = error.response?.data?.error || 'Error registering user';
      }
    },
    /**
     * Resets the registration form to its initial state.
     */
    resetForm() {
      this.form = {
        first_name: '',
        last_name: '',
        email: '',
        rol: 'admin_room_911',
        password: '',
        password_confirmation: '',
      };
    },
  },
};
</script>