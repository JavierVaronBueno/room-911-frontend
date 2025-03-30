<template>
  <div>
    <h2 class="text-2xl font-bold mb-6 text-blue-800">Gestión de Empleados</h2>
    <div class="bg-white p-6 rounded-lg shadow-lg mb-6">
      <h3 class="text-lg font-semibold mb-4">Editar Empleado</h3>
      <form @submit.prevent="updateEmployee" enctype="multipart/form-data">
        <div class="mb-4">
          <label class="block text-gray-700">ID Interno</label>
          <input v-model="employee.internal_id" type="text" class="w-full p-2 border rounded" required />
        </div>
        <div class="mb-4">
          <label class="block text-gray-700">Nombre</label>
          <input v-model="employee.first_name" type="text" class="w-full p-2 border rounded" required />
        </div>
        <div class="mb-4">
          <label class="block text-gray-700">Apellido</label>
          <input v-model="employee.last_name" type="text" class="w-full p-2 border rounded" required />
        </div>
        <div class="mb-4">
          <label class="block text-gray-700">Departamento</label>
          <select v-model="employee.production_department_id" class="w-full p-2 border rounded" required>
            <option v-for="dept in departments" :key="dept.id" :value="dept.id">{{ dept.name }}</option>
          </select>
        </div>
        <div class="mb-4">
          <label class="block text-gray-700">Acceso a Room 911</label>
          <input v-model="employee.has_room_911_access" type="checkbox" class="mt-2" />
        </div>
        <div class="mb-4">
          <label class="block text-gray-700">Foto</label>
          <input type="file" @change="onFileChange" accept="image/*" class="w-full p-2" />
          <img v-if="employee.photo_url" :src="employee.photo_url" alt="Foto actual" class="mt-2 w-24 h-24 object-cover" />
        </div>
        <div class="flex justify-end space-x-4">
          <router-link to="/employees" class="bg-gray-500 text-white p-2 rounded hover:bg-gray-600">
            Cancelar
          </router-link>
          <button type="submit" class="bg-blue-800 text-white p-2 rounded hover:bg-blue-900">
            Guardar
          </button>
        </div>
      </form>
    </div>
  </div>
</template>

<script>
import axios from 'axios';

export default {
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
          text: 'Error al cargar departamentos',
        });
      }
    },
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
          text: 'Error al cargar datos del empleado',
        });
      }
    },
    async updateEmployee() {
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
          title: 'Éxito',
          text: 'Empleado actualizado con éxito',
        }).then(() => this.$router.push('/employees'));
      } catch (error) {
        this.$swal({
          icon: 'error',
          title: 'Error',
          text: error.response?.data?.error || 'Error al actualizar empleado',
        });
      }
    },
    onFileChange(event) {
      this.employee.photo = event.target.files[0];
    },
  },
};
</script>