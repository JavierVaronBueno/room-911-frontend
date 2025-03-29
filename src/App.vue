<template>
  <div class="min-h-screen bg-gray-100">
    <Navbar v-if="$route.meta.requiresAuth" />
    <router-view class="container mx-auto p-4"></router-view>
  </div>
</template>

<script>
import Navbar from './components/Navbar.vue';

export default {
  components: { Navbar },
};
</script>