# Room 911 Frontend

Room 911 Frontend is a web application developed in Vue.js 3 as part of a technical challenge. This project provides a modern and efficient user interface for managing employees, simulating access attempts, and querying access history in an access control system, integrating with a RESTful API in the backend (room-911). The application is designed with a focus on usability, scalability, and maintainability, using reusable components, advanced UI tools, and frontend development best practices.

## Main Features

- **Employee Management**: Registration, editing, and bulk upload of employees with support for photos and access permissions.
- **Access Simulation**: Interface to simulate access attempts and verify permissions in real-time.
- **Access History**: Query of access attempts by employee with date filters and PDF download option.
- **Authentication**: User registration and login with JWT tokens.
- **Enhanced Interface**: Use of vue-select for dynamic selectors and vue-sweetalert2 for modern notifications.

## Technologies Used

- **Vue.js**: Main framework (version 3.5.13).
- **Vue Router**: SPA routing (version 4.x).
- **Axios**: HTTP client for API requests.
- **Vue Good Table Next**: Dynamic tables with search, sorting, and pagination.
- **Vue Sweetalert2**: Interactive alerts and dialogs.
- **Vue Select**: Advanced selectors with search (version 4.x beta, compatible with Vue 3).
- **Tailwind CSS**: Utility framework for fast and consistent styles.
- **Vite**: Ultra-fast build and development tool.

## Prerequisites

- **Node.js**: Version 18.x or higher.
- **npm**: Version 8.x or higher (comes with Node.js).
- **Backend**: The room-911 backend project must be configured and running at http://localhost/room-911/public/api/v1.

## Installation

### Clone the Repository:
```bash
git clone https://github.com/JavierVaronBueno/room-911-frontend.git
cd room-911-frontend
```

### Install Dependencies:
```bash
npm install
```
**Note**: This command will install all dependencies listed in package.json, including vue-select@beta for Vue 3 compatibility.

### Configure the Environment:
- Make sure the backend is running and accessible at http://localhost/room-911/public/api/v1.
- No additional environment variables are required at this time, but you can add a .env file if you plan to customize the API URL (e.g., VITE_API_URL).

### Start the Development Server:
```bash
npm run dev
```
The application will be available at http://localhost:5173.

## Project Structure

```
room-911-frontend/
├── public/                # Static files
├── src/
│   ├── assets/            # Resources like images and global styles
│   ├── components/        # Reusable Vue components
│   ├── router/            # Vue Router configuration
│   ├── views/             # Main application views
│   │   ├── AccessHistory.vue      # Access history with employee selector
│   │   ├── AccessSimulation.vue   # Access simulation
│   │   ├── BulkUploadEmployees.vue # Bulk employee upload
│   │   ├── Departments.vue        # Department management
│   │   ├── EditEmployee.vue       # Employee editing
│   │   ├── Employees.vue          # Employee registration and listing
│   │   ├── Login.vue              # Login
│   │   └── Register.vue           # User registration
│   ├── App.vue            # Root component
│   └── main.js            # Entry point and global configuration
├── package.json           # Dependencies and scripts
└── README.md              # Project documentation
```

## Available Scripts

- **npm run dev**: Starts the development server with Vite.
- **npm run build**: Compiles the application for production in the dist folder.
- **npm run preview**: Previews the compiled version locally.
- **npm audit fix**: Fixes minor vulnerabilities in dependencies (run if npm install reports issues).

## Usage

### Authentication:
- Register at /register and then log in at /login to obtain a JWT token stored in localStorage.

### Employee Management:
- Go to /employees to register employees individually or use /employees/bulk for bulk upload via CSV.
- Edit employees at /employees/edit/:id.

### Access Simulation:
- Use /access-simulation to test access with internal IDs.

### Access History:
- Check the history at /access-history by selecting an employee and optionally a date range.

## Contributions

1. Fork the repository.
2. Create a branch for your change (git checkout -b feature/new-functionality).
3. Make your changes and commit (git commit -m "Add new functionality").
4. Push your changes (git push origin feature/new-functionality).
5. Open a Pull Request with a detailed description.

## Author

Javier Varón (Javox) - Lead frontend developer for the Room 911 challenge.

## License

This project is under the MIT license - see the LICENSE file for more details.