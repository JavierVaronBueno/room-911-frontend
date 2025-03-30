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

    <div class="bg-white p-6 rounded-lg shadow-lg">
      <vue-good-table
        :columns="columns"
        :rows="departments"
        :pagination-options="{ enabled: true, perPage: 5 }"
        :search-options="{ enabled: true }"
        :sort-options="{ enabled: true }"
      >
        <template #emptystate>
          No hay departamentos.
        </template>
      </vue-good-table>
    </div>
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
      name: '',
      departments: [],
      columns: [
        { label: 'ID', field: 'id', sortable: true, filterable: true },
        { label: 'Nombre', field: 'name', sortable: true, filterable: true },
      ],
    };
  },
  async created() {
    await this.fetchDepartments();
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
        this.$swal({
          icon: 'error',
          title: 'Error',
          text: error.response?.data?.error || 'Error al obtener departamentos',
        });
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
        this.$swal({
          icon: 'success',
          title: 'Éxito',
          text: 'Departamento creado correctamente',
        });
      } catch (error) {
        this.$swal({
          icon: 'error',
          title: 'Error',
          text: error.response?.data?.error || 'Error al crear departamento',
        });
      }
    },
  },
};
</script>