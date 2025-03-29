<template>
  <div>
    <h2 class="text-2xl font-bold mb-6 text-blue-800">Departamentos de Producción</h2>
    <form @submit.prevent="createDepartment" class="bg-white p-6 rounded-lg shadow-lg mb-6">
      <div class="mb-4">
        <label class="block text-gray-700">Nombre</label>
        <input v-model="name" type="text" class="w-full p-2 border rounded" required />
      </div>
      <button type="submit" class="bg-blue-800 text-white p-2 rounded hover:bg-blue-900">
        Crear Departamento
      </button>
    </form>

    <div v-if="departments.length" class="bg-white p-6 rounded-lg shadow-lg">
      <table class="w-full border-collapse">
        <thead>
          <tr class="bg-gray-200">
            <th class="border p-2">ID</th>
            <th class="border p-2">Nombre</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="dept in departments" :key="dept.id">
            <td class="border p-2">{{ dept.id }}</td>
            <td class="border p-2">{{ dept.name }}</td>
          </tr>
        </tbody>
      </table>
    </div>
    <p v-else class="text-center text-gray-500">No hay departamentos.</p>
    <p v-if="error" class="text-red-500 mt-4 text-center">{{ error }}</p>
  </div>
</template>

<script>
import axios from 'axios';

export default {
  data() {
    return {
      name: '',
      departments: [],
      error: '',
    };
  },
  async created() {
    this.fetchDepartments();
  },
  methods: {
    async fetchDepartments() {
      try {
        const response = await axios.get(
          'http://localhost/room-911-backend/public/api/v1/production-departments',
          { headers: { Authorization: `Bearer ${localStorage.getItem('token')}` } }
        );
        this.departments = response.data;
      } catch (error) {
        this.error = error.response?.data?.error || 'Error al obtener departamentos';
      }
    },
    async createDepartment() {
      try {
        const response = await axios.post(
          'http://localhost/room-911-backend/public/api/v1/production-departments',
          { name: this.name },
          { headers: { Authorization: `Bearer ${localStorage.getItem('token')}` } }
        );
        this.departments.push(response.data.department);
        this.name = '';
        this.error = '';
      } catch (error) {
        this.error = error.response?.data?.error || 'Error al crear departamento';
      }
    },
  },
};
</script>