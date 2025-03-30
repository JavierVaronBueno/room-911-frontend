<template>
  <nav class="bg-blue-800 text-white p-4 shadow-md">
    <div class="container mx-auto flex justify-between items-center">
      <span class="text-xl font-semibold">Room 911</span>
      <div class="space-x-4">
        <router-link to="/access-simulation" class="hover:underline">Simulate Access</router-link>
        <router-link to="/access-history" class="hover:underline">History</router-link>
        <router-link to="/departments" class="hover:underline">Departments</router-link>
        <router-link to="/employees" class="hover:underline">Employees</router-link>
        <router-link to="/employees/bulk" class="hover:underline">Bulk Upload</router-link>
        <button @click="logout" class="hover:underline">Log Out</button>
      </div>
    </div>
  </nav>
</template>

<script>
/**
 * Navbar component for navigation across the Room 911 application.
 * Provides links to main features and a logout button.
 */
export default {
  methods: {
    /**
     * Logs out the user by removing the token from localStorage and redirecting to the login page.
     */
    logout() {
      localStorage.removeItem('token');
      this.$router.push('/login');
    },
  },
};
</script>