<template>
  <div>
    <h2 class="text-2xl font-bold mb-6 text-blue-800">Production Departments</h2>
    <form @submit.prevent="createDepartment" class="bg-white p-6 rounded-lg shadow-lg mb-6">
      <div class="mb-4">
        <label class="block text-gray-700">Name</label>
        <input v-model="name" type="text" class="w-full p-2 border rounded" required />
      </div>
      <button type="submit" class="bg-blue-800 text-white p-2 rounded hover:bg-blue-900">
        Create Department
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
          No departments found.
        </template>
      </vue-good-table>
    </div>
  </div>
</template>

<script>
import axios from 'axios';
import { VueGoodTable } from 'vue-good-table-next';

/**
 * Departments view for managing production departments.
 * Allows creating new departments and displaying the list.
 */
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
        { label: 'Name', field: 'name', sortable: true, filterable: true },
      ],
    };
  },
  async created() {
    await this.fetchDepartments();
  },
  methods: {
    /**
     * Fetches the list of departments from the backend API.
     * @async
     */
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
          text: error.response?.data?.error || 'Error retrieving departments',
        });
      }
    },
    /**
     * Creates a new department with the provided name.
     * @async
     */
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
          title: 'Success',
          text: 'Department created successfully',
        });
      } catch (error) {
        this.$swal({
          icon: 'error',
          title: 'Error',
          text: error.response?.data?.error || 'Error creating department',
        });
      }
    },
  },
};
</script>