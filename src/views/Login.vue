<template>
  <div class="flex items-center justify-center min-h-screen">
    <div class="bg-white p-6 rounded-lg shadow-lg w-full max-w-md">
      <h2 class="text-2xl font-bold mb-6 text-center text-blue-800">Iniciar Sesión</h2>
      <form @submit.prevent="login">
        <div class="mb-4">
          <label class="block text-gray-700">Correo Electrónico</label>
          <input v-model="email" type="email" class="w-full p-2 border rounded" required />
        </div>
        <div class="mb-6">
          <label class="block text-gray-700">Contraseña</label>
          <input v-model="password" type="password" class="w-full p-2 border rounded" required />
        </div>
        <button type="submit" class="w-full bg-blue-800 text-white p-2 rounded hover:bg-blue-900">
          Iniciar Sesión
        </button>
      </form>
      <p class="mt-4 text-center">
        ¿No tienes una cuenta? 
        <router-link to="/register" class="text-blue-600 hover:underline">Regístrate aquí</router-link>
      </p>
      <p v-if="error" class="text-red-500 mt-4 text-center">{{ error }}</p>
    </div>
  </div>
</template>

<script>
import axios from 'axios';

export default {
  data() {
    return {
      email: '',
      password: '',
      error: '',
    };
  },
  methods: {
    async login() {
      try {
        const response = await axios.post('http://localhost/room-911-backend/public/api/v1/auth/login', {
          email: this.email,
          password: this.password,
        });
        localStorage.setItem('token', response.data.access_token);
        this.$router.push('/access-simulation');
      } catch (error) {
        this.error = error.response?.data?.error || 'Error al iniciar sesión';
      }
    },
  },
};
</script>