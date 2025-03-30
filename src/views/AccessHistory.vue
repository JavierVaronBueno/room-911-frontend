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
      <vue-good-table
        :columns="columns"
        :rows="attempts"
        :pagination-options="{ enabled: true, perPage: 5 }"
        :search-options="{ enabled: true }"
        :sort-options="{ enabled: true }"
      >
        <template #emptystate>
          No se encontraron intentos.
        </template>
      </vue-good-table>
    </div>
    <p v-else-if="searched" class="text-center text-gray-500">No se encontraron intentos.</p>
    <p v-if="error" class="text-red-500 mt-4 text-center">{{ error }}</p>
  </div>
</template>

<script>
import axios from 'axios';
import { VueGoodTable } from 'vue-good-table-next';

export default {
  components: {
    VueGoodTable,
  },
  data() {
    return {
      employeeId: '',
      startDate: '',
      endDate: '',
      attempts: [],
      searched: false,
      error: '',
      columns: [
        { label: 'ID', field: 'id', sortable: true, filterable: true },
        { label: 'ID Intentado', field: 'internal_id_attempted', sortable: true, filterable: true },
        { 
          label: 'Acceso', 
          field: 'access_granted', 
          sortable: true, 
          filterable: true,
          formatFn: (value) => value ? 'Sí' : 'No'
        },
        { label: 'Fecha', field: 'attempted_at', sortable: true, filterable: true },
      ],
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
        const [key, value] = response.data.download_url.split('=');
        window.open(value, '_blank');
      } catch (error) {
        this.error = error.response?.data?.error || 'Error al descargar PDF';
      }
    },
  },
};
</script>