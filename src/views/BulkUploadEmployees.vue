<template>
    <div class="container mx-auto p-4">
      <h2 class="text-2xl font-bold mb-6 text-blue-800">Carga Masiva de Empleados</h2>
      <div class="bg-white p-6 rounded-lg shadow-lg">
        <form @submit.prevent="uploadCSV">
          <div class="mb-4">
            <label class="block text-gray-700 mb-2">Selecciona un archivo CSV</label>
            <input type="file" @change="onFileChange" accept=".csv" class="w-full p-2 border rounded" required />
            <p class="text-sm text-gray-500 mt-2">
              El archivo debe tener las columnas: internal_id, first_name, last_name, production_department_id, has_room_911_access
            </p>
          </div>
          <button type="submit" class="bg-blue-800 text-white p-2 rounded hover:bg-blue-900">
            Cargar Empleados
          </button>
        </form>
        <p v-if="success" class="text-green-500 mt-4">{{ success }}</p>
        <p v-if="error" class="text-red-500 mt-4">{{ error }}</p>
        <div v-if="errors.length" class="mt-4">
          <h3 class="text-lg font-semibold text-red-600">Errores en la carga:</h3>
          <ul class="list-disc pl-5 text-red-500">
            <li v-for="(err, index) in errors" :key="index">{{ err }}</li>
          </ul>
        </div>
        <router-link to="/employees" class="mt-4 inline-block text-blue-600 hover:underline">
          Volver a Gestión de Empleados
        </router-link>
      </div>
    </div>
  </template>
  
  <script>
  import axios from 'axios';
  
  export default {
    data() {
      return {
        file: null,
        success: '',
        error: '',
        errors: [],
      };
    },
    methods: {
      onFileChange(event) {
        this.file = event.target.files[0];
        this.success = '';
        this.error = '';
        this.errors = [];
      },
      async uploadCSV() {
        if (!this.file) {
          this.error = 'Por favor, selecciona un archivo CSV';
          return;
        }
  
        const formData = new FormData();
        formData.append('csv', this.file);
  
        try {
          const response = await axios.post(
            'http://localhost/room-911-backend/public/api/v1/employees/bulk',
            formData,
            {
              headers: {
                Authorization: `Bearer ${localStorage.getItem('token')}`,
                'Content-Type': 'multipart/form-data',
              },
            }
          );
          this.success = response.data.message || 'Empleados cargados con éxito';
          this.error = '';
          this.errors = [];
          this.file = null; // Limpiar el input
        } catch (error) {
          this.success = '';
          if (error.response?.data?.errors) {
            this.errors = error.response.data.errors; // Errores específicos del CSV
            this.error = 'Errores encontrados en el archivo CSV';
          } else {
            this.error = error.response?.data?.error || 'Error al cargar empleados';
          }
        }
      },
    },
  };
  </script>