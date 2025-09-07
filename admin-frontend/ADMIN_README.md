# Admin Dashboard Frontend

A React TypeScript admin dashboard for managing users, companies, and projects.

## Features

- **User Management**: Create users, assign companies and projects
- **Company Management**: Create, edit, and delete companies
- **Project Management**: Create projects under companies, manage Power BI links
- **Role-based Authentication**: Admin-only access
- **Modern UI**: Clean, responsive design with Lucide React icons

## Tech Stack

- React 19 with TypeScript
- React Router for navigation
- Axios for API calls
- Lucide React for icons
- Context API for state management

## Getting Started

### Prerequisites

- Node.js (v14 or higher)
- Backend API running on http://localhost:5000

### Installation

1. Install dependencies:
```bash
npm install
```

2. Create `.env` file:
```env
REACT_APP_API_URL=http://localhost:5000/api
```

3. Start the development server:
```bash
npm start
```

The admin dashboard will be available at http://localhost:3001

## Usage

1. **Login**: Use admin credentials to access the dashboard
2. **Manage Users**: Create users and assign them to companies/projects
3. **Manage Companies**: Create and organize companies
4. **Manage Projects**: Create projects with Power BI dashboard links

## Default Admin User

Create an admin user in MongoDB:
```json
{
  "email": "admin@example.com",
  "password": "$2a$10$hashedPassword",
  "isAdmin": true,
  "companies": [],
  "projects": []
}
```
