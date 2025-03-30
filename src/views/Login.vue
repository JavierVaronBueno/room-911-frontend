<template>
  <div class="flex items-center justify-center min-h-screen">
    <div class="bg-white p-6 rounded-lg shadow-lg w-full max-w-md">
      <h2 class="text-2xl font-bold mb-6 text-center text-blue-800">Log In</h2>
      <form @submit.prevent="login">
        <div class="mb-4">
          <label class="block text-gray-700">Email</label>
          <input v-model="email" type="email" class="w-full p-2 border rounded" required />
        </div>
        <div class="mb-6">
          <label class="block text-gray-700">Password</label>
          <input v-model="password" type="password" class="w-full p-2 border rounded" required />
        </div>
        <button type="submit" class="w-full bg-blue-800 text-white p-2 rounded hover:bg-blue-900">
          Log In
        </button>
      </form>
      <p class="mt-4 text-center">
        Don't have an account? 
        <router-link to="/register" class="text-blue-600 hover:underline">Register here</router-link>
      </p>
      <p v-if="error" class="text-red-500 mt-4 text-center">{{ error }}</p>
    </div>
  </div>
</template>

<script>
import axios from 'axios';

/**
 * Login view for user authentication.
 * Submits email and password to obtain a JWT token.
 */
export default {
  data() {
    return {
      email: '',
      password: '',
      error: '',
    };
  },
  methods: {
    /**
     * Authenticates the user and redirects to the access simulation page on success.
     * @async
     */
    async login() {
      try {
        const response = await axios.post('http://localhost/room-911-backend/public/api/v1/auth/login', {
          email: this.email,
          password: this.password,
        });
        localStorage.setItem('token', response.data.access_token);
        this.$router.push('/access-simulation');
      } catch (error) {
        this.error = error.response?.data?.error || 'Error logging in';
      }
    },
  },
};
</script>