<template>
  <nav class="bg-blue-800 text-white p-4 shadow-md">
    <div class="container mx-auto flex justify-between items-center">
      <span class="text-xl font-semibold">Room 911</span>
      <div class="space-x-4">
        <router-link to="/access-simulation" class="hover:underline">Simular Acceso</router-link>
        <router-link to="/access-history" class="hover:underline">Historial</router-link>
        <router-link to="/departments" class="hover:underline">Departamentos</router-link>
        <router-link to="/employees" class="hover:underline">Empleados</router-link>
        <button @click="logout" class="hover:underline">Cerrar Sesión</button>
      </div>
    </div>
  </nav>
</template>

<script>
  export default {
    methods: {
      logout() {
        localStorage.removeItem('token');
        this.$router.push('/login');
      },
    },
  };
</script>
