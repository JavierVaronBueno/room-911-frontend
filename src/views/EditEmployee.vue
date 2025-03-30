<template>
  <div>
    <h2 class="text-2xl font-bold mb-6 text-blue-800">Employee Management</h2>
    <div class="bg-white p-6 rounded-lg shadow-lg mb-6">
      <h3 class="text-lg font-semibold mb-4">Edit Employee</h3>
      <form @submit.prevent="updateEmployee" enctype="multipart/form-data">
        <div class="mb-4">
          <label class="block text-gray-700">Internal ID</label>
          <input v-model="employee.internal_id" type="text" class="w-full p-2 border rounded" required />
        </div>
        <div class="mb-4">
          <label class="block text-gray-700">First Name</label>
          <input v-model="employee.first_name" type="text" class="w-full p-2 border rounded" required />
        </div>
        <div class="mb-4">
          <label class="block text-gray-700">Last Name</label>
          <input v-model="employee.last_name" type="text" class="w-full p-2 border rounded" required />
        </div>
        <div class="mb-4">
          <label class="block text-gray-700">Department</label>
          <v-select
            v-model="employee.production_department_id"
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
        <div class="mb-4">
          <label class="block text-gray-700">Room 911 Access</label>
          <input v-model="employee.has_room_911_access" type="checkbox" class="mt-2" />
        </div>
        <div class="mb-4">
          <label class="block text-gray-700">Photo</label>
          <input type="file" @change="onFileChange" accept="image/*" class="w-full p-2" />
          <img v-if="employee.photo_url" :src="employee.photo_url" alt="Current photo" class="mt-2 w-24 h-24 object-cover" />
        </div>
        <div class="flex justify-end space-x-4">
          <router-link to="/employees" class="bg-gray-500 text-white p-2 rounded hover:bg-gray-600">
            Cancel
          </router-link>
          <button type="submit" class="bg-blue-800 text-white p-2 rounded hover:bg-blue-900">
            Save
          </button>
        </div>
      </form>
    </div>
  </div>
</template>

<script>
import axios from 'axios';
import VueSelect from 'vue-select';

/**
 * EditEmployee view for updating an existing employee's details.
 * Allows editing fields and uploading a new photo.
 */
export default {
  components: {
    'v-select': VueSelect,
  },
  data() {
    return {
      employee: {
        id: '',
        internal_id: '',
        first_name: '',
        last_name: '',
        production_department_id: '',
        has_room_911_access: false,
        photo: null,
        photo_url: '',
      },
      departments: [],
    };
  },
  async created() {
    await this.fetchDepartments();
    await this.fetchEmployee();
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
          text: 'Error loading departments',
        });
      }
    },
    /**
     * Fetches the details of the employee to edit based on route params.
     * @async
     */
    async fetchEmployee() {
      const employeeId = this.$route.params.id;
      try {
        const response = await axios.get(
          `http://localhost/room-911-backend/public/api/v1/employees/search?id=${employeeId}`,
          { headers: { Authorization: `Bearer ${localStorage.getItem('token')}` } }
        );
        this.employee = response.data[0];
      } catch (error) {
        this.$swal({
          icon: 'error',
          title: 'Error',
          text: 'Error loading employee data',
        });
      }
    },
    /**
     * Updates the employee's details and submits changes to the backend API.
     * @async
     */
    async updateEmployee() {
      if (!this.employee.production_department_id) {
        this.$swal({
          icon: 'warning',
          title: 'Warning',
          text: 'Please select a department',
        });
        return;
      }
      const formData = new FormData();
      formData.append('internal_id', this.employee.internal_id);
      formData.append('first_name', this.employee.first_name);
      formData.append('last_name', this.employee.last_name);
      formData.append('production_department_id', this.employee.production_department_id);
      formData.append('has_room_911_access', this.employee.has_room_911_access ? 1 : 0);
      if (this.employee.photo instanceof File) {
        formData.append('photo', this.employee.photo);
      }
      formData.append('_method', 'PUT');

      try {
        await axios.post(
          `http://localhost/room-911-backend/public/api/v1/employees/${this.employee.id}`,
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
          text: 'Employee updated successfully',
        }).then(() => this.$router.push('/employees'));
      } catch (error) {
        this.$swal({
          icon: 'error',
          title: 'Error',
          text: error.response?.data?.error || 'Error updating employee',
        });
      }
    },
    /**
     * Updates the employee's photo when a new file is selected.
     * @param {Event} event - The file input change event
     */
    onFileChange(event) {
      this.employee.photo = event.target.files[0];
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