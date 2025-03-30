import { createRouter, createWebHistory } from 'vue-router';
import Login from '../views/Login.vue';
import Register from '../views/Register.vue';
import AccessSimulation from '../views/AccessSimulation.vue';
import AccessHistory from '../views/AccessHistory.vue';
import Departments from '../views/Departments.vue';
import Employees from '../views/Employees.vue';
import EditEmployee from '../views/EditEmployee.vue';
import BulkUploadEmployees from '../views/BulkUploadEmployees.vue'; 

const routes = [
  { path: '/', redirect: '/login' },
  { path: '/login', name: 'Login', component: Login },
  { path: '/register', name: 'Register', component: Register },
  { path: '/access-simulation', name: 'AccessSimulation', component: AccessSimulation, meta: { requiresAuth: true } },
  { path: '/access-history', name: 'AccessHistory', component: AccessHistory, meta: { requiresAuth: true } },
  { path: '/departments', name: 'Departments', component: Departments, meta: { requiresAuth: true } },
  { path: '/employees', name: 'Employees', component: Employees, meta: { requiresAuth: true } },
  { path: '/employees/edit/:id', name: 'EditEmployee', component: EditEmployee, meta: { requiresAuth: true } },
  { path: '/employees/bulk', name: 'BulkUploadEmployees', component: BulkUploadEmployees, meta: { requiresAuth: true } },
];

const router = createRouter({
  history: createWebHistory(),
  routes,
});

router.beforeEach((to, from, next) => {
  const token = localStorage.getItem('token');
  if (to.meta.requiresAuth && !token) {
    next('/login');
  } else {
    next();
  }
});

export default router;