# AeroTask - MERN Stack Task Management Web Application

AeroTask is a responsive, highly polished, and secure task management web application built using the MERN stack (MongoDB, Express.js, React.js, and Node.js). It features glassmorphic UI elements, JWT authentication, user-isolated task storage, priority tagging, due date warnings, searching, sorting, status filtering, and pagination.

---

## 🚀 Features

### 🔐 Authentication Features
- **User Registration**: Register with Full Name, Email, and Password.
- **Secure Logins**: Authenticate credentials securely via password hashing (bcrypt).
- **Session Management**: Generate JWT tokens upon login/registration and store them locally in `localStorage`.
- **Protected Routing**: Guard dashboard views so only authenticated users can view, query, and modify tasks.
- **Secure Signouts**: Instant token clearing on logout.

### 📋 Task Management Features
- **Add Tasks**: Assign title, description, priority (low, medium, high), and due date to tasks.
- **Live Search**: Perform debounced searching across task titles and descriptions.
- **Filtering**: Segment your view by status (**All**, **Pending**, **Completed**) or priority.
- **Sorting**: Order tasks by creation date (newest first), title (A-Z), due date, or priority hierarchy.
- **Task Status Toggling**: Mark tasks as complete/pending instantly via interactive checkboxes.
- **Pagination**: Browse through large task lists with customizable page limits (default limit set to 6 for easy testing).
- **Overdue Indicator**: Visual warnings with icons for uncompleted tasks past their due date.

---

## 🛠️ Tech Stack

### Frontend
- **React.js (Vite)**
- **Redux Toolkit & React Redux** (Global State Management)
- **React Router DOM** (Navigation Routing)
- **Axios** (HTTP Client with interceptor headers)
- **Tailwind CSS v4** (Utility-first styling with modern glassmorphism)
- **Lucide React** (Modern Icons)

### Backend
- **Node.js & Express.js**
- **MongoDB & Mongoose** (Database & Schemas)
- **JWT (JsonWebToken)** (Authentication & Session Tokens)
- **Bcryptjs** (Password hashing)
- **Cors & Dotenv** (CORS management and environment variables)

---

## 📦 Installation & Setup

Ensure you have [Node.js](https://nodejs.org/) (v16+) and [MongoDB](https://www.mongodb.com/) installed locally.

### 1. Clone & Navigate
```bash
git clone <your-repository-link>
cd "Task Management Web App"
```

### 2. Backend Configuration
1. Navigate to the `backend` folder:
   ```bash
   cd backend
   ```
2. Install backend dependencies:
   ```bash
   npm install
   ```
3. Create a `.env` file in the `backend` directory (if not already present) and configure the variables:
   ```env
   PORT=8000
   MONGO_URI=mongodb://127.0.0.1:27017/TaskManager
   JWT_SECRET=your_jwt_secret_key_here
   CLIENT_URL=http://localhost:5173
   ```
4. Start the backend development server:
   ```bash
   npm run dev
   ```
   *The server runs on `http://localhost:8000`.*

### 3. Frontend Configuration
1. Open a new terminal tab and navigate to the `frontend` folder:
   ```bash
   cd frontend
   ```
2. Install frontend dependencies:
   ```bash
   npm install
   ```
3. Start the Vite React development server:
   ```bash
   npm run dev
   ```
   *The client application runs on `http://localhost:5173`.*

---

## 🔗 Required APIs

### Authentication (`/api/auth`)
| Method | Endpoint | Description | Auth Required |
| :--- | :--- | :--- | :--- |
| **POST** | `/api/auth/register` | Register a new user account | No |
| **POST** | `/api/auth/login` | Login user and retrieve JWT token | No |
| **GET** | `/api/auth/me` | Fetch active user credentials | Yes (Bearer) |

### Tasks (`/api/tasks`)
| Method | Endpoint | Description | Auth Required |
| :--- | :--- | :--- | :--- |
| **GET** | `/api/tasks` | Get paginated tasks (supports query filters) | Yes (Bearer) |
| **POST** | `/api/tasks` | Create a new task | Yes (Bearer) |
| **GET** | `/api/tasks/:id` | Get details of a single task | Yes (Bearer) |
| **PUT** | `/api/tasks/:id` | Update attributes of a task | Yes (Bearer) |
| **PATCH** | `/api/tasks/:id/status`| Update only the status of a task | Yes (Bearer) |
| **DELETE**| `/api/tasks/:id` | Remove a task from user database | Yes (Bearer) |

---

## 🚀 Deployment Instructions

### Backend Deployment (e.g., Render)
1. Commit your codebase to a GitHub repository.
2. Sign in to [Render](https://render.com/) and create a new **Web Service**.
3. Link your GitHub repository.
4. Set the build commands:
   - Root Directory: `backend`
   - Build Command: `npm install`
   - Start Command: `npm start`
5. Configure Environment Variables in the Render settings tab (`MONGO_URI`, `JWT_SECRET`, `CLIENT_URL`, etc.).

### Frontend Deployment (e.g., Vercel / Render)
1. Sign in to [Vercel](https://vercel.com/) and create a **New Project**.
2. Link your GitHub repository.
3. Configure project settings:
   - Framework Preset: `Vite`
   - Root Directory: `frontend`
   - Build Command: `npm run build`
   - Output Directory: `dist`
4. Set environment variables (if any API URLs are configured dynamically) and deploy!
