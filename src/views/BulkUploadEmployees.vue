<template>
  <div class="container mx-auto p-4">
    <h2 class="text-2xl font-bold mb-6 text-blue-800">Bulk Upload Employees</h2>
    <div class="bg-white p-6 rounded-lg shadow-lg">
      <form @submit.prevent="uploadCSV">
        <div class="mb-4">
          <label class="block text-gray-700 mb-2">Select a CSV File</label>
          <input type="file" @change="onFileChange" accept=".csv" class="w-full p-2 border rounded" required />
          <p class="text-sm text-gray-500 mt-2">
            The file must have the columns: internal_id, first_name, last_name, production_department_id, has_room_911_access
          </p>
        </div>
        <button type="submit" class="bg-blue-800 text-white p-2 rounded hover:bg-blue-900">
          Upload Employees
        </button>
      </form>
      <div v-if="errors.length" class="mt-4">
        <h3 class="text-lg font-semibold text-red-600">Upload Errors:</h3>
        <ul class="list-disc pl-5 text-red-500">
          <li v-for="(err, index) in errors" :key="index">{{ err }}</li>
        </ul>
      </div>
      <router-link to="/employees" class="mt-4 inline-block text-blue-600 hover:underline">
        Back to Employee Management
      </router-link>
    </div>
  </div>
</template>

<script>
import axios from 'axios';

/**
 * BulkUploadEmployees view for uploading multiple employees via a CSV file.
 * Displays errors if the upload fails.
 */
export default {
  data() {
    return {
      file: null,
      errors: [],
    };
  },
  methods: {
    /**
     * Updates the selected file when a new file is chosen.
     * @param {Event} event - The file input change event
     */
    onFileChange(event) {
      this.file = event.target.files[0];
      this.errors = [];
    },
    /**
     * Uploads the selected CSV file to the backend API.
     * @async
     */
    async uploadCSV() {
      if (!this.file) {
        this.$swal({
          icon: 'warning',
          title: 'Warning',
          text: 'Please select a CSV file',
        });
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
        this.$swal({
          icon: 'success',
          title: 'Success',
          text: response.data.message || 'Employees uploaded successfully',
        });
        this.file = null;
        this.errors = [];
      } catch (error) {
        if (error.response?.data?.errors) {
          this.errors = error.response.data.errors;
          this.$swal({
            icon: 'error',
            title: 'Upload Errors',
            text: 'Check the specific errors in the CSV file',
          });
        } else {
          this.$swal({
            icon: 'error',
            title: 'Error',
            text: error.response?.data?.error || 'Error uploading employees',
          });
        }
      }
    },
  },
};
</script>