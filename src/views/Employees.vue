<template>
  
<div>
    <h2 class="text-2xl font-bold mb-6 text-blue-800">Gestión de Empleados</h2>
    <!-- Formulario de Registro -->
    <div class="bg-white p-6 rounded-lg shadow-lg mb-6">
      <h3 class="text-lg font-semibold mb-4">Registrar Empleado</h3>
      <form @submit.prevent="registerEmployee" enctype="multipart/form-data">
        <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label class="block text-gray-700">ID Interno</label>
            <input v-model="newEmployee.internal_id" type="text" class="w-full p-2 border rounded" required />
          </div>
          <div>
            <label class="block text-gray-700">Nombre</label>
            <input v-model="newEmployee.first_name" type="text" class="w-full p-2 border rounded" required />
          </div>
          <div>
            <label class="block text-gray-700">Apellido</label>
            <input v-model="newEmployee.last_name" type="text" class="w-full p-2 border rounded" required />
          </div>
          <div>
            <label class="block text-gray-700">Departamento</label>
            <select v-model="newEmployee.production_department_id" class="w-full p-2 border rounded" required>
              <option value="">Seleccione un departamento</option>
              <option v-for="dept in departments" :key="dept.id" :value="dept.id">{{ dept.name }}</option>
            </select>
          </div>
          <div>
            <label class="block text-gray-700">Acceso a Room 911</label>
            <input v-model="newEmployee.has_room_911_access" type="checkbox" class="mt-2" />
          </div>
          <div>
            <label class="block text-gray-700">Foto</label>
            <input type="file" @change="onFileChange" accept="image/*" class="w-full p-2" />
          </div>
        </div>

        <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
          <button type="submit" class="mt-4 bg-blue-800 text-white p-2 rounded hover:bg-blue-900">
            Registrar
          </button>
          <router-link to="/employees/bulk" class="mt-4 bg-blue-800 text-white p-2 rounded hover:bg-blue-900 text-center">
            Carga Masiva
          </router-link>
        </div>
      </form>

      <p v-if="registerError" class="text-red-500 mt-4">{{ registerError }}</p>
      <p v-if="registerSuccess" class="text-green-500 mt-4">{{ registerSuccess }}</p>
    </div>

    <!-- Listado de Empleados -->
    <div class="bg-white p-6 rounded-lg shadow-lg">
      <h3 class="text-lg font-semibold mb-4">Lista de Empleados</h3>
      <div class="mb-4">
        <input v-model="searchQuery" @input="searchEmployees" type="text" placeholder="Buscar por nombre o ID interno" class="w-full p-2 border rounded" />
      </div>
      <table v-if="employees.length" class="w-full border-collapse">
        <thead>
          <tr class="bg-gray-200">
            <th class="border p-2">ID</th>
            <th class="border p-2">ID Interno</th>
            <th class="border p-2">Nombre</th>
            <th class="border p-2">Departamento</th>
            <th class="border p-2">Acceso</th>
            <th class="border p-2">Acciones</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="employee in employees" :key="employee.id">
            <td class="border p-2">{{ employee.id }}</td>
            <td class="border p-2">{{ employee.internal_id }}</td>
            <td class="border p-2">{{ employee.first_name }} {{ employee.last_name }}</td>
            <td class="border p-2">{{ getDepartmentName(employee.production_department_id) }}</td>
            <td class="border p-2">{{ employee.has_room_911_access ? 'Sí' : 'No' }}</td>
            <td class="border p-2">
              <router-link :to="`/employees/edit/${employee.id}`" class="text-blue-600 hover:underline">Editar</router-link>
            </td>
          </tr>
        </tbody>
      </table>
      <p v-else class="text-gray-500 text-center">No hay empleados para mostrar.</p>
    </div>
  </div>
</template>

<script>
import axios from 'axios';

export default {
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
      searchQuery: '',
      registerError: '',
      registerSuccess: '',
    };
  },
  async created() {
    await this.fetchDepartments();
    await this.searchEmployees();
  },
  methods: {
    async fetchDepartments() {
      try {
        const response = await axios.get(
          'http://localhost/room-911-backend/public/api/v1/production-departments',
          { headers: { Authorization: `Bearer ${localStorage.getItem('token')}` } }
        );
        this.departments = response.data;
      } catch (error) {
        console.error('Error fetching departments:', error);
      }
    },
    async registerEmployee() {
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
        const response = await axios.post(
          'http://localhost/room-911-backend/public/api/v1/employees',
          formData,
          {
            headers: {
              Authorization: `Bearer ${localStorage.getItem('token')}`,
              'Content-Type': 'multipart/form-data',
            },
          }
        );
        this.registerSuccess = 'Empleado registrado con éxito';
        this.registerError = '';
        this.employees.push(response.data.employee);
        this.resetNewEmployee();
      } catch (error) {
        this.registerError = error.response?.data?.error || 'Error al registrar empleado';
        this.registerSuccess = '';
      }
    },
    async searchEmployees() {
      try {
        const params = this.searchQuery ? { first_name: this.searchQuery, internal_id: this.searchQuery } : {};
        const response = await axios.get(
          'http://localhost/room-911-backend/public/api/v1/employees/search',
          {
            headers: { Authorization: `Bearer ${localStorage.getItem('token')}` },
            params,
          }
        );
        this.employees = response.data;
      } catch (error) {
        this.registerError = error.response?.data?.error || 'Error al buscar empleados';
      }
    },
    onFileChange(event) {
      this.newEmployee.photo = event.target.files[0];
    },
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
    getDepartmentName(id) {
      const dept = this.departments.find(d => d.id === id);
      return dept ? dept.name : 'N/A';
    },
  },
};
</script>