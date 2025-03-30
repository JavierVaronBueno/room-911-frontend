# Room 911 Frontend

Room 911 Frontend es una aplicación web desarrollada en Vue.js 3 como parte de un reto técnico. Este proyecto proporciona una interfaz de usuario moderna y eficiente para gestionar empleados, simular accesos y consultar historiales en un sistema de control de acceso, integrándose con una API RESTful en el backend (room-911). La aplicación está diseñada con un enfoque en usabilidad, escalabilidad y mantenibilidad, utilizando componentes reutilizables, herramientas de UI avanzadas y buenas prácticas de desarrollo frontend.

## Características Principales

- **Gestión de Empleados**: Registro, edición y carga masiva de empleados con soporte para fotos y permisos de acceso.
- **Simulación de Acceso**: Interfaz para simular intentos de acceso y verificar permisos en tiempo real.
- **Historial de Accesos**: Consulta de intentos de acceso por empleado con filtros de fecha y opción de descarga en PDF.
- **Autenticación**: Registro e inicio de sesión de usuarios con tokens JWT.
- **Interfaz Mejorada**: Uso de vue-select para selectores dinámicos y vue-sweetalert2 para notificaciones modernas.

## Tecnologías Utilizadas

- **Vue.js**: Framework principal (versión 3.5.13).
- **Vue Router**: Enrutamiento SPA (versión 4.x).
- **Axios**: Cliente HTTP para solicitudes a la API.
- **Vue Good Table Next**: Tablas dinámicas con búsqueda, ordenación y paginación.
- **Vue Sweetalert2**: Alertas y diálogos interactivos.
- **Vue Select**: Selectores avanzados con búsqueda (versión 4.x beta, compatible con Vue 3).
- **Tailwind CSS**: Framework de utilidad para estilos rápidos y consistentes.
- **Vite**: Herramienta de construcción y desarrollo ultrarrápida.

## Requisitos Previos

- **Node.js**: Versión 18.x o superior.
- **npm**: Versión 8.x o superior (viene con Node.js).
- **Backend**: El proyecto backend room-911 debe estar configurado y corriendo en http://localhost/room-911/public/api/v1.

## Instalación

### Clona el Repositorio:
```bash
git clone https://github.com/JavierVaronBueno/room-911-frontend.git
cd room-911-frontend
```

### Instala las Dependencias:
```bash
npm install
```
**Nota**: Este comando instalará todas las dependencias listadas en package.json, incluyendo vue-select@beta para compatibilidad con Vue 3.

### Configura el Entorno:
- Asegúrate de que el backend esté corriendo y accesible en http://localhost/room-911/public/api/v1.
- No se requieren variables de entorno adicionales en este momento, pero puedes agregar un archivo .env si planeas personalizar la URL de la API (por ejemplo, VITE_API_URL).

### Inicia el Servidor de Desarrollo:
```bash
npm run dev
```
La aplicación estará disponible en http://localhost:5173.

## Estructura del Proyecto

```
room-911-frontend/
├── public/                # Archivos estáticos
├── src/
│   ├── assets/            # Recursos como imágenes y estilos globales
│   ├── components/        # Componentes reutilizables de Vue
│   ├── router/            # Configuración de Vue Router
│   ├── views/             # Vistas principales de la aplicación
│   │   ├── AccessHistory.vue      # Historial de accesos con selector de empleados
│   │   ├── AccessSimulation.vue   # Simulación de accesos
│   │   ├── BulkUploadEmployees.vue # Carga masiva de empleados
│   │   ├── Departments.vue        # Gestión de departamentos
│   │   ├── EditEmployee.vue       # Edición de empleados
│   │   ├── Employees.vue          # Registro y listado de empleados
│   │   ├── Login.vue              # Inicio de sesión
│   │   └── Register.vue           # Registro de usuarios
│   ├── App.vue            # Componente raíz
│   └── main.js            # Punto de entrada y configuración global
├── package.json           # Dependencias y scripts
└── README.md              # Documentación del proyecto
```

## Scripts Disponibles

- **npm run dev**: Inicia el servidor de desarrollo con Vite.
- **npm run build**: Compila la aplicación para producción en la carpeta dist.
- **npm run preview**: Previsualiza la versión compilada localmente.
- **npm audit fix**: Corrige vulnerabilidades menores en las dependencias (ejecuta si npm install reporta problemas).

## Uso

### Autenticación:
- Regístrate en /register y luego inicia sesión en /login para obtener un token JWT almacenado en localStorage.

### Gestión de Empleados:
- Ve a /employees para registrar empleados individualmente o usa /employees/bulk para carga masiva vía CSV.
- Edita empleados en /employees/edit/:id.

### Simulación de Acceso:
- Usa /access-simulation para probar accesos con IDs internos.

### Historial de Accesos:
- Consulta el historial en /access-history seleccionando un empleado y opcionalmente un rango de fechas.

## Contribuciones

1. Crea un fork del repositorio.
2. Crea una rama para tu cambio (git checkout -b feature/nueva-funcionalidad).
3. Realiza tus cambios y haz commit (git commit -m "Agrega nueva funcionalidad").
4. Sube tus cambios (git push origin feature/nueva-funcionalidad).
5. Abre un Pull Request con una descripción detallada.

## Autor

Javier Varón (Javox) - Desarrollador principal del frontend para el reto Room 911.

## Licencia

Este proyecto está bajo la licencia MIT - consulta el archivo LICENSE para más detalles.