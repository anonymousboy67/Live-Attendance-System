# Live Attendance System

A real-time attendance management system built with Node.js, Express, MongoDB, and WebSocket technology. This application enables teachers to conduct live attendance sessions while students mark their presence in real-time.

## Table of Contents

- [Features](#features)
- [Technology Stack](#technology-stack)
- [System Architecture](#system-architecture)
- [Prerequisites](#prerequisites)
- [Installation](#installation)
- [Environment Variables](#environment-variables)
- [Database Schema](#database-schema)
- [API Endpoints](#api-endpoints)
- [WebSocket Protocol](#websocket-protocol)
- [Authentication](#authentication)
- [Usage](#usage)
- [Project Structure](#project-structure)
- [Development](#development)
- [Testing](#testing)
- [Deployment](#deployment)
- [Contributing](#contributing)
- [License](#license)

## Features

### Core Functionality
- User authentication with JWT tokens
- Role-based access control (Teacher and Student roles)
- Class management (Create, Read, Update, Delete)
- Real-time attendance marking via WebSocket
- Persistent attendance records in MongoDB
- Single active session management

### Authentication & Authorization
- Secure password hashing with bcrypt
- JWT-based authentication
- Protected routes with role-based middleware
- Session management

### Real-time Features
- WebSocket-based live attendance sessions
- Broadcast updates to all connected clients
- Real-time student attendance marking
- Live session status updates

## Technology Stack

### Backend
- **Runtime**: Node.js
- **Framework**: Express.js
- **Database**: MongoDB with Mongoose ODM
- **WebSocket**: ws library
- **Validation**: Zod
- **Authentication**: JSON Web Tokens (JWT)
- **Password Security**: bcrypt

## System Architecture

The system follows a three-tier architecture:

1. **Presentation Layer**: WebSocket and REST API endpoints
2. **Business Logic Layer**: Controllers and middleware
3. **Data Layer**: MongoDB with Mongoose models

### Key Design Decisions

- Single active attendance session at a time (no room management)
- All WebSocket broadcasts sent to all connected clients
- Client-side filtering based on class membership
- Stateless JWT authentication for REST endpoints
- Persistent connection management for WebSocket clients

## Prerequisites

- Node.js (version 14.x or higher)
- MongoDB (version 4.x or higher)
- npm or yarn package manager
- Basic understanding of REST APIs and WebSocket

## Installation

### 1. Clone the repository

```bash
git clone <repository-url>
cd live-attendance-system
```

### 2. Install dependencies

```bash
npm install
```

### 3. Set up environment variables

Create a `.env` file in the root directory:

```bash
cp .env.example .env
```

### 4. Configure MongoDB

Ensure MongoDB is running locally or update the connection string in `.env`

### 5. Start the server

```bash
# Development mode
npm run dev

# Production mode
npm start
```

## Environment Variables

Create a `.env` file with the following variables:

```
PORT=3000
MONGODB_URI=mongodb://localhost:27017/attendance_system
JWT_SECRET=your_jwt_secret_key_here
JWT_EXPIRES_IN=7d
NODE_ENV=development
WS_PORT=3001
```

### Variable Descriptions

- `PORT`: HTTP server port
- `MONGODB_URI`: MongoDB connection string
- `JWT_SECRET`: Secret key for JWT token generation
- `JWT_EXPIRES_IN`: JWT token expiration time
- `NODE_ENV`: Environment (development/production)
- `WS_PORT`: WebSocket server port

## Database Schema

### User Schema

```javascript
{
  name: String (required),
  email: String (required, unique),
  password: String (required, hashed),
  role: String (enum: ['teacher', 'student']),
  createdAt: Date,
  updatedAt: Date
}
```

### Class Schema

```javascript
{
  name: String (required),
  description: String,
  teacher: ObjectId (ref: 'User'),
  students: [ObjectId] (ref: 'User'),
  createdAt: Date,
  updatedAt: Date
}
```

### Attendance Schema

```javascript
{
  class: ObjectId (ref: 'Class'),
  date: Date (required),
  students: [{
    student: ObjectId (ref: 'User'),
    status: String (enum: ['present', 'absent']),
    markedAt: Date
  }],
  startedBy: ObjectId (ref: 'User'),
  startedAt: Date,
  endedAt: Date,
  isActive: Boolean
}
```

## API Endpoints

### Authentication Endpoints

#### POST /api/auth/signup
Register a new user account.

**Request Body:**
```json
{
  "name": "John Doe",
  "email": "john@example.com",
  "password": "securepassword123",
  "role": "student"
}
```

**Response:**
```json
{
  "token": "jwt_token_here",
  "user": {
    "id": "user_id",
    "name": "John Doe",
    "email": "john@example.com",
    "role": "student"
  }
}
```

#### POST /api/auth/login
Authenticate and receive JWT token.

**Request Body:**
```json
{
  "email": "john@example.com",
  "password": "securepassword123"
}
```

**Response:**
```json
{
  "token": "jwt_token_here",
  "user": {
    "id": "user_id",
    "name": "John Doe",
    "email": "john@example.com",
    "role": "student"
  }
}
```

#### GET /api/auth/me
Get current user information (requires authentication).

**Headers:**
```
Authorization: Bearer <jwt_token>
```

**Response:**
```json
{
  "user": {
    "id": "user_id",
    "name": "John Doe",
    "email": "john@example.com",
    "role": "student"
  }
}
```

### Class Management Endpoints

#### POST /api/classes
Create a new class (teacher only).

**Headers:**
```
Authorization: Bearer <jwt_token>
```

**Request Body:**
```json
{
  "name": "Mathematics 101",
  "description": "Introduction to Calculus",
  "students": ["student_id_1", "student_id_2"]
}
```

#### GET /api/classes
Get all classes (filtered by role).

**Headers:**
```
Authorization: Bearer <jwt_token>
```

#### GET /api/classes/:id
Get specific class details.

**Headers:**
```
Authorization: Bearer <jwt_token>
```

#### PUT /api/classes/:id
Update class information (teacher only).

**Headers:**
```
Authorization: Bearer <jwt_token>
```

#### DELETE /api/classes/:id
Delete a class (teacher only).

**Headers:**
```
Authorization: Bearer <jwt_token>
```

### Attendance Endpoints

#### POST /api/attendance/start
Start a live attendance session (teacher only).

**Headers:**
```
Authorization: Bearer <jwt_token>
```

**Request Body:**
```json
{
  "classId": "class_id_here"
}
```

#### POST /api/attendance/end
End the current attendance session (teacher only).

**Headers:**
```
Authorization: Bearer <jwt_token>
```

#### GET /api/attendance/history/:classId
Get attendance history for a class.

**Headers:**
```
Authorization: Bearer <jwt_token>
```

## WebSocket Protocol

### Connection

Connect to WebSocket server:
```javascript
const ws = new WebSocket('ws://localhost:3001');
```

### Authentication

Send authentication message after connection:
```json
{
  "type": "authenticate",
  "token": "jwt_token_here"
}
```

### Message Types

#### From Client to Server

**Mark Attendance:**
```json
{
  "type": "mark_attendance",
  "classId": "class_id_here",
  "studentId": "student_id_here"
}
```

#### From Server to Client

**Session Started:**
```json
{
  "type": "session_started",
  "classId": "class_id_here",
  "className": "Mathematics 101",
  "startedAt": "2025-12-17T10:00:00.000Z"
}
```

**Attendance Marked:**
```json
{
  "type": "attendance_marked",
  "studentId": "student_id_here",
  "studentName": "John Doe",
  "markedAt": "2025-12-17T10:05:00.000Z"
}
```

**Session Ended:**
```json
{
  "type": "session_ended",
  "classId": "class_id_here",
  "endedAt": "2025-12-17T11:00:00.000Z"
}
```

**Error:**
```json
{
  "type": "error",
  "message": "Error description"
}
```

## Authentication

### JWT Token Structure

The system uses JWT tokens for authentication. Each token contains:

```json
{
  "userId": "user_id",
  "email": "user@example.com",
  "role": "student",
  "iat": 1234567890,
  "exp": 1234567890
}
```

### Protected Routes

All routes except `/api/auth/signup` and `/api/auth/login` require authentication. Include the JWT token in the Authorization header:

```
Authorization: Bearer <your_jwt_token>
```

### Role-Based Access

- **Teacher Role**: Can create/update/delete classes, start/end attendance sessions
- **Student Role**: Can view enrolled classes, mark their own attendance

## Usage

### Teacher Workflow

1. Sign up or login as a teacher
2. Create a new class with enrolled students
3. Start a live attendance session via REST API
4. Monitor real-time attendance through WebSocket
5. End the session when complete
6. View attendance history

### Student Workflow

1. Sign up or login as a student
2. Connect to WebSocket with authentication
3. Wait for teacher to start session
4. Mark attendance when session is active
5. Receive confirmation of attendance

### Example: Complete Flow

```javascript
// 1. Teacher creates a class
const classResponse = await fetch('/api/classes', {
  method: 'POST',
  headers: {
    'Authorization': `Bearer ${teacherToken}`,
    'Content-Type': 'application/json'
  },
  body: JSON.stringify({
    name: 'Physics 101',
    students: [studentId1, studentId2]
  })
});

// 2. Teacher starts attendance
await fetch('/api/attendance/start', {
  method: 'POST',
  headers: {
    'Authorization': `Bearer ${teacherToken}`,
    'Content-Type': 'application/json'
  },
  body: JSON.stringify({
    classId: classId
  })
});

// 3. Students connect via WebSocket
const ws = new WebSocket('ws://localhost:3001');
ws.onopen = () => {
  ws.send(JSON.stringify({
    type: 'authenticate',
    token: studentToken
  }));
};

// 4. Student marks attendance
ws.send(JSON.stringify({
  type: 'mark_attendance',
  classId: classId,
  studentId: studentId
}));
```

## Project Structure

```
live-attendance-system/
├── src/
│   ├── config/
│   │   └── database.js
│   ├── models/
│   │   ├── User.js
│   │   ├── Class.js
│   │   └── Attendance.js
│   ├── controllers/
│   │   ├── authController.js
│   │   ├── classController.js
│   │   └── attendanceController.js
│   ├── middleware/
│   │   ├── auth.js
│   │   ├── roleCheck.js
│   │   └── validation.js
│   ├── routes/
│   │   ├── authRoutes.js
│   │   ├── classRoutes.js
│   │   └── attendanceRoutes.js
│   ├── validators/
│   │   ├── authValidator.js
│   │   ├── classValidator.js
│   │   └── attendanceValidator.js
│   ├── websocket/
│   │   └── attendanceWS.js
│   └── app.js
├── tests/
│   ├── auth.test.js
│   ├── class.test.js
│   └── attendance.test.js
├── .env.example
├── .gitignore
├── package.json
└── README.md
```

## Development

### Running in Development Mode

```bash
npm run dev
```

This will start the server with nodemon for auto-reloading.

### Code Style

The project follows standard JavaScript coding conventions. Ensure your code is properly formatted before committing.

### Debugging

Enable detailed logging by setting:
```
NODE_ENV=development
```

## Testing

### Running Tests

```bash
# Run all tests
npm test

# Run tests with coverage
npm run test:coverage

# Run specific test file
npm test auth.test.js
```

### Test Structure

- Unit tests for models and utilities
- Integration tests for API endpoints
- WebSocket connection tests

## Deployment

### Production Build

```bash
npm run build
npm start
```

### Environment Setup

Ensure all environment variables are properly set in production:

- Use strong JWT secrets
- Configure production MongoDB URI
- Enable HTTPS for WebSocket connections
- Set appropriate CORS policies

### Recommended Hosting

- **Backend**: Heroku, DigitalOcean, AWS EC2
- **Database**: MongoDB Atlas, AWS DocumentDB
- **WebSocket**: Ensure hosting supports WebSocket connections

## Contributing

We welcome contributions to improve the Live Attendance System. Please follow these steps:

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/improvement`)
3. Commit your changes (`git commit -am 'Add new feature'`)
4. Push to the branch (`git push origin feature/improvement`)
5. Create a Pull Request

### Contribution Guidelines

- Write clear commit messages
- Add tests for new features
- Update documentation as needed
- Follow existing code style
- Ensure all tests pass before submitting

## License

This project is licensed under the MIT License. See the LICENSE file for details.

---

## Support

For issues, questions, or contributions, please open an issue on the GitHub repository.

## Acknowledgments

Built as part of a 3-hour backend development challenge focusing on real-time systems and authentication.
