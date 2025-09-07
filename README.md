# User-Company-Project Management System

A full-stack TypeScript application for managing users, companies, and projects with role-based access control.

## Features

- **User Management**: Admin can create users with email and password
- **Company & Project Access Control**: Assign users to specific companies and projects
- **Role-Based Authentication**: Admin and regular user roles
- **User Dashboard**: Users see only companies and projects they have access to
- **Admin Dashboard**: Separate admin interface for complete management
- **Power BI Integration**: Embed Power BI dashboards within project views

## Tech Stack

### Backend
- Node.js with Express.js
- TypeScript
- MongoDB with Mongoose
- JWT Authentication
- bcryptjs for password hashing

### User Frontend
- React.js with TypeScript
- React Router for navigation
- Axios for API calls
- Context API for state management

### Admin Frontend
- React.js with TypeScript
- Lucide React icons
- Modern responsive design
- Complete CRUD operations

## Project Structure

```
project/
├── backend/
│   ├── src/
│   │   ├── controllers/
│   │   ├── middleware/
│   │   ├── models/
│   │   ├── routes/
│   │   └── server.ts
│   ├── package.json
│   ├── tsconfig.json
│   └── .env
├── frontend/                    # User Dashboard
│   ├── src/
│   │   ├── components/
│   │   ├── context/
│   │   ├── services/
│   │   ├── types/
│   │   └── App.tsx
│   ├── package.json
│   └── .env
├── admin-frontend/              # Admin Dashboard
│   ├── src/
│   │   ├── components/
│   │   ├── context/
│   │   ├── services/
│   │   ├── types/
│   │   └── App.tsx
│   ├── package.json
│   └── .env
└── README.md
```

## Prerequisites

- Node.js (v14 or higher)
- MongoDB (local installation or cloud instance)
- npm or yarn

## Installation & Setup

### 1. Clone and navigate to the project
```bash
cd project
```

### 2. Backend Setup
```bash
cd backend
npm install
```

Create `.env` file in the backend directory:
```env
PORT=5000
MONGODB_URI=mongodb://localhost:27017/user-company-project-app
JWT_SECRET=your_jwt_secret_key_here_change_in_production
```

### 3. User Frontend Setup
```bash
cd frontend
npm install
```

Create `.env` file in the frontend directory:
```env
REACT_APP_API_URL=http://localhost:5000/api
```

### 4. Admin Frontend Setup
```bash
cd admin-frontend
npm install
```

Create `.env` file in the admin-frontend directory:
```env
REACT_APP_API_URL=http://localhost:5000/api
```

### 5. Database Setup
Make sure MongoDB is running on your system. The application will automatically create the database and collections on first run.

## Running the Application

### Option 1: VS Code Tasks (Recommended)
Use the integrated tasks in VS Code:
- **Start All Services**: `Ctrl+Shift+P` → "Tasks: Run Task" → "Start All Services"
- **Start User App Only**: `Ctrl+Shift+P` → "Tasks: Run Task" → "Start Full Application"
- **Start Individual Services**:
  - Backend: "Start Backend Server"
  - User Frontend: "Start Frontend Server"  
  - Admin Dashboard: "Start Admin Dashboard"

### Option 2: Manual Start

#### 1. Start the Backend
```bash
cd backend
npm run dev
```
Backend will run on http://localhost:5000

#### 2. Start the User Frontend
```bash
cd frontend
npm start
```
User frontend will run on http://localhost:3000

#### 3. Start the Admin Dashboard
```bash
cd admin-frontend
npm start
```
Admin dashboard will run on http://localhost:3001

## Application URLs

- **Backend API**: http://localhost:5000
- **User Dashboard**: http://localhost:3000 (for regular users)
- **Admin Dashboard**: http://localhost:3001 (for administrators)
```bash
cd frontend
npm start
```
Frontend will run on http://localhost:3000

## API Endpoints

### Authentication
- `POST /api/auth/login` - User login
- `GET /api/auth/profile` - Get user profile
- `POST /api/auth/users` - Create user (admin only)
- `GET /api/auth/users` - Get all users (admin only)
- `PUT /api/auth/users/:userId/access` - Update user access (admin only)

### Companies
- `POST /api/companies` - Create company (admin only)
- `GET /api/companies` - Get all companies (admin only)
- `GET /api/companies/:id` - Get company by ID (admin only)
- `PUT /api/companies/:id` - Update company (admin only)
- `DELETE /api/companies/:id` - Delete company (admin only)

### Projects
- `POST /api/projects` - Create project (admin only)
- `GET /api/projects` - Get all projects (admin only)
- `GET /api/projects/my-projects` - Get user's projects
- `GET /api/projects/:id` - Get project by ID
- `PUT /api/projects/:id` - Update project (admin only)
- `DELETE /api/projects/:id` - Delete project (admin only)

## Data Models

### User
- email (unique)
- password (hashed)
- isAdmin (boolean)
- companies (array of Company IDs)
- projects (array of Project IDs)

### Company
- name (unique)
- description (optional)
- projects (array of Project IDs)
- users (array of User IDs)

### Project
- name
- description (optional)
- powerbi_link (URL for Power BI dashboard)
- company (Company ID)
- users (array of User IDs)

## Usage

### 1. Create Admin User
First, you'll need to create an admin user manually in MongoDB or through the API with `isAdmin: true`.

### 2. Admin Workflow
1. Login as admin
2. Create companies
3. Create projects under companies
4. Create users
5. Assign users to companies and projects

### 3. User Workflow
1. Login with provided credentials
2. View dashboard with assigned companies and projects
3. Click on projects to view Power BI dashboards

## Development

### Backend Development
```bash
cd backend
npm run dev  # Runs with nodemon for auto-restart
```

### Frontend Development
```bash
cd frontend
npm start  # Runs with hot reload
```

### Building for Production
```bash
# Backend
cd backend
npm run build

# Frontend
cd frontend
npm run build
```

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Test thoroughly
5. Submit a pull request

## License

This project is licensed under the ISC License.
