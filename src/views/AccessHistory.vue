<template>
  <div>
    <h2 class="text-2xl font-bold mb-6 text-blue-800">Historial de Accesos</h2>
    <form @submit.prevent="fetchHistory" class="bg-white p-6 rounded-lg shadow-lg mb-6">
      <div class="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div>
          <label class="block text-gray-700">Empleado</label>
          <v-select
            v-model="selectedEmployee"
            :options="employees"
            label="fullName"
            :reduce="employee => employee.id"
            placeholder="Selecciona un empleado"
            class="w-full"
            required
          >
            <template #option="{ internal_id, first_name, last_name }">
              <span>{{ `${internal_id} - ${first_name} ${last_name}` }}</span>
            </template>
            <template #selected-option="{ internal_id, first_name, last_name }">
              <span>{{ `${internal_id} - ${first_name} ${last_name}` }}</span>
            </template>
          </v-select>
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
  </div>
</template>

<script>
import axios from 'axios';
import { VueGoodTable } from 'vue-good-table-next';
import VueSelect from 'vue-select'; // Importa la versión beta

export default {
  components: {
    VueGoodTable,
    'v-select': VueSelect,
  },
  data() {
    return {
      selectedEmployee: null, // Almacena el ID del empleado seleccionado
      employees: [], // Lista de empleados desde la API
      startDate: '',
      endDate: '',
      attempts: [],
      searched: false,
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
  async created() {
    await this.fetchEmployees();
  },
  methods: {
    async fetchEmployees() {
      try {
        const response = await axios.get(
          'http://localhost/room-911-backend/public/api/v1/employees/search',
          {
            headers: { Authorization: `Bearer ${localStorage.getItem('token')}` },
          }
        );
        this.employees = response.data.map(employee => ({
          ...employee,
          fullName: `${employee.internal_id} - ${employee.first_name} ${employee.last_name}`, // Campo calculado
        }));
      } catch (error) {
        this.$swal({
          icon: 'error',
          title: 'Error',
          text: 'Error al cargar la lista de empleados',
        });
      }
    },
    async fetchHistory() {
      if (!this.selectedEmployee) {
        this.$swal({
          icon: 'warning',
          title: 'Advertencia',
          text: 'Por favor, selecciona un empleado',
        });
        return;
      }
      try {
        const params = {};
        if (this.startDate && this.endDate) {
          params.start_date = this.startDate;
          params.end_date = this.endDate;
        }
        const response = await axios.get(
          `http://localhost/room-911-backend/public/api/v1/access-attempts/employee/${this.selectedEmployee}`,
          {
            headers: { Authorization: `Bearer ${localStorage.getItem('token')}` },
            params,
          }
        );
        this.attempts = response.data;
        this.searched = true;
      } catch (error) {
        this.$swal({
          icon: 'error',
          title: 'Error',
          text: error.response?.data?.error || 'Error al obtener historial',
        });
        this.attempts = [];
      }
    },
    async downloadPdf() {
      if (!this.selectedEmployee) {
        this.$swal({
          icon: 'warning',
          title: 'Advertencia',
          text: 'Por favor, selecciona un empleado',
        });
        return;
      }
      try {
        const params = {};
        if (this.startDate && this.endDate) {
          params.start_date = this.startDate;
          params.end_date = this.endDate;
        }
        const response = await axios.get(
          `http://localhost/room-911-backend/public/api/v1/access-attempts/employee/${this.selectedEmployee}/pdf`,
          {
            headers: { Authorization: `Bearer ${localStorage.getItem('token')}` },
            params,
          }
        );
        const [key, value] = response.data.download_url.split('=');
        window.open(value, '_blank');
        this.$swal({
          icon: 'success',
          title: 'Éxito',
          text: 'PDF descargado correctamente',
        });
      } catch (error) {
        this.$swal({
          icon: 'error',
          title: 'Error',
          text: error.response?.data?.error || 'Error al descargar PDF',
        });
      }
    },
  },
};
</script>

<style>
/* Ajustes básicos para vue-select */
.v-select {
  min-width: 100%;
}
.vs__dropdown-toggle {
  padding: 0.5rem;
  border: 1px solid #d1d5db;
  border-radius: 0.375rem;
}
.vs__search, .vs__selected {
  margin: 0;
}
</style>