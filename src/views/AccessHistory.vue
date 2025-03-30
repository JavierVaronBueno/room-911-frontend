<template>
  <div>
    <h2 class="text-2xl font-bold mb-6 text-blue-800">Access History</h2>
    <form @submit.prevent="fetchHistory" class="bg-white p-6 rounded-lg shadow-lg mb-6">
      <div class="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div>
          <label class="block text-gray-700">Employee</label>
          <v-select
            v-model="selectedEmployee"
            :options="employees"
            label="fullName"
            :reduce="employee => employee.id"
            placeholder="Select an employee"
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
          <label class="block text-gray-700">Start Date</label>
          <input v-model="startDate" type="date" class="w-full p-2 border rounded" />
        </div>
        <div>
          <label class="block text-gray-700">End Date</label>
          <input v-model="endDate" type="date" class="w-full p-2 border rounded" />
        </div>
      </div>
      <button type="submit" class="mt-4 bg-blue-800 text-white p-2 rounded hover:bg-blue-900">
        Search
      </button>
      <button @click="downloadPdf" type="button" class="mt-4 ml-4 bg-green-600 text-white p-2 rounded hover:bg-green-700">
        Download PDF
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
          No access attempts found.
        </template>
      </vue-good-table>
    </div>
    <p v-else-if="searched" class="text-center text-gray-500">No access attempts found.</p>
  </div>
</template>

<script>
import axios from 'axios';
import { VueGoodTable } from 'vue-good-table-next';
import VueSelect from 'vue-select';

/**
 * AccessHistory view for displaying and filtering employee access attempts.
 * Allows searching by employee and date range, and downloading results as a PDF.
 */
export default {
  components: {
    VueGoodTable,
    'v-select': VueSelect,
  },
  data() {
    return {
      selectedEmployee: null, // Stores the selected employee's ID
      employees: [], // List of employees fetched from the API
      startDate: '',
      endDate: '',
      attempts: [], // List of access attempts
      searched: false, // Indicates if a search has been performed
      columns: [
        { label: 'ID', field: 'id', sortable: true, filterable: true },
        { label: 'Attempted ID', field: 'internal_id_attempted', sortable: true, filterable: true },
        { 
          label: 'Access', 
          field: 'access_granted', 
          sortable: true, 
          filterable: true,
          formatFn: (value) => value ? 'Yes' : 'No' // Updated to English
        },
        { label: 'Date', field: 'attempted_at', sortable: true, filterable: true },
      ],
    };
  },
  async created() {
    await this.fetchEmployees();
  },
  methods: {
    /**
     * Fetches the list of employees from the backend API.
     * @async
     */
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
          fullName: `${employee.internal_id} - ${employee.first_name} ${employee.last_name}`, // Calculated field
        }));
      } catch (error) {
        this.$swal({
          icon: 'error',
          title: 'Error',
          text: 'Error loading employee list',
        });
      }
    },
    /**
     * Fetches access history for the selected employee within the specified date range.
     * @async
     */
    async fetchHistory() {
      if (!this.selectedEmployee) {
        this.$swal({
          icon: 'warning',
          title: 'Warning',
          text: 'Please select an employee',
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
          text: error.response?.data?.error || 'Error retrieving history',
        });
        this.attempts = [];
      }
    },
    /**
     * Downloads a PDF of the access history for the selected employee.
     * @async
     */
    async downloadPdf() {
      if (!this.selectedEmployee) {
        this.$swal({
          icon: 'warning',
          title: 'Warning',
          text: 'Please select an employee',
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
          title: 'Success',
          text: 'PDF downloaded successfully',
        });
      } catch (error) {
        this.$swal({
          icon: 'error',
          title: 'Error',
          text: error.response?.data?.error || 'Error downloading PDF',
        });
      }
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