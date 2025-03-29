<template>
  <div>
    <h2 class="text-2xl font-bold mb-6 text-blue-800">Historial de Accesos</h2>
    <form @submit.prevent="fetchHistory" class="bg-white p-6 rounded-lg shadow-lg mb-6">
      <div class="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div>
          <label class="block text-gray-700">ID Empleado</label>
          <input v-model="employeeId" type="number" class="w-full p-2 border rounded" required />
        </div>
        <div>
          <label class="block text-gray-700">Fecha Inicio</label>
          <input v-model="startDate" type="date" class="w-full p-2 border rounded" />
        </div>
        <div>
          <label class="block text-gray-700">Fecha Fin</label>
          <input v-model="endDate" type="date" class="w-full p-2 border rounded" />
        </div>
      </div>
      <button type="submit" class="mt-4 bg-blue-800 text-white p-2 rounded hover:bg-blue-900">
        Buscar
      </button>
      <button @click="downloadPdf" type="button" class="mt-4 ml-4 bg-green-600 text-white p-2 rounded hover:bg-green-700">
        Descargar PDF
      </button>
    </form>

    <div v-if="attempts.length" class="bg-white p-6 rounded-lg shadow-lg">
      <table class="w-full border-collapse">
        <thead>
          <tr class="bg-gray-200">
            <th class="border p-2">ID</th>
            <th class="border p-2">ID Intentado</th>
            <th class="border p-2">Acceso</th>
            <th class="border p-2">Fecha</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="attempt in attempts" :key="attempt.id">
            <td class="border p-2">{{ attempt.id }}</td>
            <td class="border p-2">{{ attempt.internal_id_attempted }}</td>
            <td class="border p-2">{{ attempt.access_granted ? 'Sí' : 'No' }}</td>
            <td class="border p-2">{{ attempt.attempted_at }}</td>
          </tr>
        </tbody>
      </table>
    </div>
    <p v-else-if="searched" class="text-center text-gray-500">No se encontraron intentos.</p>
    <p v-if="error" class="text-red-500 mt-4 text-center">{{ error }}</p>
  </div>
</template>

<script>
import axios from 'axios';

export default {
  data() {
    return {
      employeeId: '',
      startDate: '',
      endDate: '',
      attempts: [],
      searched: false,
      error: '',
    };
  },
  methods: {
    async fetchHistory() {
      try {
        const params = {};
        if (this.startDate && this.endDate) {
          params.start_date = this.startDate;
          params.end_date = this.endDate;
        }
        const response = await axios.get(
          `http://localhost/room-911-backend/public/api/v1/access-attempts/employee/${this.employeeId}`,
          {
            headers: { Authorization: `Bearer ${localStorage.getItem('token')}` },
            params,
          }
        );
        this.attempts = response.data;
        this.searched = true;
        this.error = '';
      } catch (error) {
        this.error = error.response?.data?.error || 'Error al obtener historial';
        this.attempts = [];
      }
    },
    async downloadPdf() {
      try {
        const params = {};
        if (this.startDate && this.endDate) {
          params.start_date = this.startDate;
          params.end_date = this.endDate;
        }
        const response = await axios.get(
          `http://localhost/room-911-backend/public/api/v1/access-attempts/employee/${this.employeeId}/pdf`,
          {
            headers: { Authorization: `Bearer ${localStorage.getItem('token')}` },
            params,
          }
        );
        window.open(response.data.download_url, '_blank');
      } catch (error) {
        this.error = error.response?.data?.error || 'Error al descargar PDF';
      }
    },
  },
};
</script>