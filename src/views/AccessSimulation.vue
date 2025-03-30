<template>
  <div>
    <h2 class="text-2xl font-bold mb-6 text-blue-800">Simulate Access</h2>
    <form @submit.prevent="simulateAccess" class="bg-white p-6 rounded-lg shadow-lg">
      <div class="mb-4">
        <label class="block text-gray-700">Internal ID</label>
        <input v-model="internalId" type="text" class="w-full p-2 border rounded" required />
      </div>
      <button type="submit" class="bg-blue-800 text-white p-2 rounded hover:bg-blue-900">
        Simulate
      </button>
    </form>
    <p v-if="result" class="mt-4 text-center" :class="result.status === 'Access Granted' ? 'text-green-500' : 'text-red-500'">
      {{ result.status }}
    </p>
  </div>
</template>

<script>
import axios from 'axios';

/**
 * AccessSimulation view for simulating employee access attempts.
 * Displays the result of the simulation (granted or denied).
 */
export default {
  data() {
    return {
      internalId: '',
      result: null,
    };
  },
  methods: {
    /**
     * Simulates an access attempt using the provided internal ID.
     * @async
     */
    async simulateAccess() {
      try {
        const response = await axios.post(
          'http://localhost/room-911-backend/public/api/v1/access-attempts/simulate',
          { internal_id: this.internalId },
          { headers: { Authorization: `Bearer ${localStorage.getItem('token')}` } }
        );
        this.result = response.data;
        this.$swal({
          icon: response.data.status === 'Access Granted' ? 'success' : 'error',
          title: response.data.status === 'Access Granted' ? 'Access Granted' : 'Access Denied',
          text: response.data.status,
        });
      } catch (error) {
        this.$swal({
          icon: 'error',
          title: 'Error',
          text: error.response?.data?.error || 'Error simulating access',
        });
        this.result = null;
      }
    },
  },
};
</script>