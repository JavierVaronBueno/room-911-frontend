<template>
  <div class="min-h-screen bg-gray-100">
    <Navbar v-if="$route.meta.requiresAuth" />
    <router-view class="container mx-auto p-4"></router-view>
  </div>
</template>

<script>
import Navbar from './components/Navbar.vue';

/**
 * Root component of the Room 911 application.
 * Renders the navigation bar and the current route view.
 */
export default {
  components: { Navbar },
};
</script>