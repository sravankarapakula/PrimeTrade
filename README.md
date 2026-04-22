# PrimeTrade Backend & Task Management System

This project is a complete extension of a backend system to include a robust Task Management module, complete with a React frontend.

## Features

- User Authentication (Register, Login, JWT tokens)
- Role-based Access Control (User, Admin)
- Task Management (CRUD operations)
- Frontend React Dashboard (Vite)

## Setup Steps

### Backend Setup

1. Navigate to the `backend` directory.
2. Install dependencies:
   ```bash
   npm install
   ```
3. Create a `.env` file based on `.env.sample` (if available) or add the necessary environment variables.
4. Start the server:
   ```bash
   npm run dev
   ```

### Frontend Setup

1. Navigate to the `frontend` directory.
2. Install dependencies:
   ```bash
   npm install
   ```
3. Start the development server:
   ```bash
   npm run dev
   ```

## Environment Variables (Backend)

Ensure your `backend/.env` file has the following variables:

- `PORT`: Server port (e.g., 8000)
- `MONGODB_URI`: MongoDB connection string
- `CORS_ORIGIN`: Allowed origins (e.g., `*` or `http://localhost:5173`)
- `ACCESS_TOKEN_SECRET`: Secret key for JWT access token
- `ACCESS_TOKEN_EXPIRY`: Access token expiry duration (e.g., 1d)
- `REFRESH_TOKEN_SECRET`: Secret key for JWT refresh token
- `REFRESH_TOKEN_EXPIRY`: Refresh token expiry duration (e.g., 10d)
- `CLOUDINARY_CLOUD_NAME`: Cloudinary Cloud Name
- `CLOUDINARY_API_KEY`: Cloudinary API Key
- `CLOUDINARY_API_SECRET`: Cloudinary API Secret

## API Endpoints

### User Routes (`/api/v1/users`)
- `POST /register`: Register a new user
- `POST /login`: Login user
- `POST /logout`: Logout user (requires JWT)

### Task Routes (`/api/v1/tasks`)
- `POST /`: Create a task (requires JWT)
- `GET /`: Get all tasks for logged-in user (requires JWT)
- `PATCH /:id`: Update task details/status (requires JWT)
- `DELETE /:id`: Delete a task (requires JWT, **Admin only**)

## Testing

A `postman_collection.json` file is provided in the `backend/` directory for API testing. Import it into Postman to easily test all endpoints.

## Scalability Note

- Modular architecture (routes, controllers, models)
- JWT-based stateless authentication
- Horizontal scaling possible
- Can integrate Redis caching for performance
- Can separate services (auth, tasks) into microservices
- Load balancing via NGINX possible
