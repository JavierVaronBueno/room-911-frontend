<template>
  <div>
    <h2 class="text-2xl font-bold mb-6 text-blue-800">Employee Management</h2>
    <div class="bg-white p-6 rounded-lg shadow-lg mb-6">
      <h3 class="text-lg font-semibold mb-4">Register Employee</h3>
      <form @submit.prevent="registerEmployee" enctype="multipart/form-data">
        <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label class="block text-gray-700">Internal ID</label>
            <input v-model="newEmployee.internal_id" type="text" class="w-full p-2 border rounded" required />
          </div>
          <div>
            <label class="block text-gray-700">First Name</label>
            <input v-model="newEmployee.first_name" type="text" class="w-full p-2 border rounded" required />
          </div>
          <div>
            <label class="block text-gray-700">Last Name</label>
            <input v-model="newEmployee.last_name" type="text" class="w-full p-2 border rounded" required />
          </div>
          <div>
            <label class="block text-gray-700">Department</label>
            <v-select
              v-model="newEmployee.production_department_id"
              :options="departments"
              label="name"
              :reduce="dept => dept.id"
              placeholder="Select a department"
              class="w-full"
              required
            >
              <template #option="{ name }">
                <span>{{ name }}</span>
              </template>
              <template #selected-option="{ name }">
                <span>{{ name }}</span>
              </template>
            </v-select>
          </div>
          <div>
            <label class="block text-gray-700">Room 911 Access</label>
            <input v-model="newEmployee.has_room_911_access" type="checkbox" class="mt-2" />
          </div>
          <div>
            <label class="block text-gray-700">Photo</label>
            <input type="file" @change="onFileChange" accept="image/*" class="w-full p-2 border rounded" />
          </div>
        </div>
        <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
          <button type="submit" class="mt-4 bg-blue-800 text-white p-2 rounded hover:bg-blue-900">
            Register
          </button>
          <router-link to="/employees/bulk" class="mt-4 bg-blue-800 text-white p-2 rounded hover:bg-blue-900 text-center">
            Bulk Upload
          </router-link>
        </div>
      </form>
    </div>

    <div class="bg-white p-6 rounded-lg shadow-lg">
      <h3 class="text-lg font-semibold mb-4">Employee List</h3>
      <div class="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
        <div>
          <label class="block text-gray-700">Filter by Department</label>
          <v-select
            v-model="departmentFilter"
            :options="departmentsWithAll"
            label="name"
            :reduce="dept => dept.id"
            placeholder="All departments"
            class="w-full"
            @input="searchEmployees"
          >
            <template #option="{ name }">
              <span>{{ name }}</span>
            </template>
            <template #selected-option="{ name }">
              <span>{{ name }}</span>
            </template>
          </v-select>
        </div>
      </div>
      <vue-good-table
        :columns="columns"
        :rows="employees"
        :pagination-options="{ enabled: true, perPage: 5 }"
        :search-options="{ enabled: true }"
        :sort-options="{ enabled: true }"
      >
        <template #table-row="props">
          <span v-if="props.column.field === 'actions'">
            <router-link :to="`/employees/edit/${props.row.id}`" class="mt-4 bg-blue-800 text-white p-2 rounded hover:bg-blue-900 text-center">Edit</router-link>
          </span>
          <span v-else-if="props.column.field === 'has_room_911_access'">
            {{ props.row.has_room_911_access ? 'Yes' : 'No' }}
          </span>
          <span v-else-if="props.column.field === 'department'">
            {{ props.row.production_department ? props.row.production_department.name : 'N/A' }}
          </span>
          <span v-else>
            {{ props.formattedRow[props.column.field] }}
          </span>
        </template>
        <template #emptystate>
          No employees to display.
        </template>
      </vue-good-table>
    </div>
  </div>
</template>

<script>
import axios from 'axios';
import { VueGoodTable } from 'vue-good-table-next';
import VueSelect from 'vue-select';

/**
 * Employees view for managing employee records.
 * Includes registration form and a filterable employee list.
 */
export default {
  components: {
    VueGoodTable,
    'v-select': VueSelect,
  },
  data() {
    return {
      newEmployee: {
        internal_id: '',
        first_name: '',
        last_name: '',
        production_department_id: '',
        has_room_911_access: false,
        photo: null,
      },
      employees: [],
      departments: [],
      departmentsWithAll: [], // For filter with "All departments" option
      searchQuery: '',
      departmentFilter: '',
      columns: [
        { label: 'ID', field: 'id', sortable: true, filterable: true },
        { label: 'Internal ID', field: 'internal_id', sortable: true, filterable: true },
        { label: 'First Name', field: 'first_name', sortable: true, filterable: true },
        { label: 'Last Name', field: 'last_name', sortable: true, filterable: true },
        { label: 'Department', field: 'department', sortable: true, filterable: true },
        { label: 'Access', field: 'has_room_911_access', sortable: true, filterable: true },
        { label: 'Actions', field: 'actions', sortable: false, filterable: false },
      ],
    };
  },
  async created() {
    await this.fetchDepartments();
    await this.searchEmployees();
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
        this.departmentsWithAll = [{ id: '', name: 'All departments' }, ...response.data];
      } catch (error) {
        this.$swal({
          icon: 'error',
          title: 'Error',
          text: 'Error loading departments',
        });
      }
    },
    /**
     * Registers a new employee with the provided details.
     * @async
     */
    async registerEmployee() {
      if (!this.newEmployee.production_department_id) {
        this.$swal({
          icon: 'warning',
          title: 'Warning',
          text: 'Please select a department',
        });
        return;
      }
      const formData = new FormData();
      formData.append('internal_id', this.newEmployee.internal_id);
      formData.append('first_name', this.newEmployee.first_name);
      formData.append('last_name', this.newEmployee.last_name);
      formData.append('production_department_id', this.newEmployee.production_department_id);
      formData.append('has_room_911_access', this.newEmployee.has_room_911_access ? 1 : 0);
      if (this.newEmployee.photo) {
        formData.append('photo', this.newEmployee.photo);
      }

      try {
        await axios.post(
          'http://localhost/room-911-backend/public/api/v1/employees',
          formData,
          {
            headers: {
              Authorization: `Bearer ${localStorage.getItem('token')}`,
              'Content-Type': 'multipart/form-data',
            },
          }
        );
        this.$swal({
          icon: 'success',
          title: 'Success',
          text: 'Employee registered successfully',
        });
        this.resetNewEmployee();
        await this.searchEmployees();
      } catch (error) {
        this.$swal({
          icon: 'error',
          title: 'Error',
          text: error.response?.data?.error || 'Error registering employee',
        });
      }
    },
    /**
     * Searches for employees based on filters and updates the list.
     * @async
     */
    async searchEmployees() {
      try {
        const params = {};
        if (this.searchQuery) {
          params.first_name = this.searchQuery;
          params.last_name = this.searchQuery;
          params.internal_id = this.searchQuery;
        }
        if (this.departmentFilter) {
          params.production_department_id = this.departmentFilter;
        }
        const response = await axios.get(
          'http://localhost/room-911-backend/public/api/v1/employees/search',
          {
            headers: { Authorization: `Bearer ${localStorage.getItem('token')}` },
            params,
          }
        );
        this.employees = response.data;
      } catch (error) {
        this.$swal({
          icon: 'error',
          title: 'Error',
          text: error.response?.data?.error || 'Error searching employees',
        });
      }
    },
    /**
     * Updates the photo for the new employee when a file is selected.
     * @param {Event} event - The file input change event
     */
    onFileChange(event) {
      this.newEmployee.photo = event.target.files[0];
    },
    /**
     * Resets the new employee form to its initial state.
     */
    resetNewEmployee() {
      this.newEmployee = {
        internal_id: '',
        first_name: '',
        last_name: '',
        production_department_id: '',
        has_room_911_access: false,
        photo: null,
      };
    },
  },
};
</script>

<style>
/* Basic adjustments for vue-select */
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