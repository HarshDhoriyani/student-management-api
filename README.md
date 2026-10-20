# Student Management API

A REST API for student records built with Node.js, Express, and MongoDB (Mongoose). The API includes request validation, pagination, name search, duplicate-email protection, and JWT authentication with role-based authorization.

## Requirements

- Node.js 18 or newer
- MongoDB locally or a MongoDB Atlas cluster

## Install and run

```bash
npm install
```

Copy `.env.example` to `.env` and set `MONGODB_URI`, `JWT_SECRET` (at least 32 characters), and your admin seed credentials. Do not commit `.env`.

Start MongoDB, then create the initial administrator and start the API:

```bash
npm run seed:admin
npm run dev
```

The server listens on `http://localhost:3000` by default. `GET /api/health` is a public health check. Set `CORS_ORIGIN` to a comma-separated list of trusted browser origins if a frontend needs cross-origin access. When unset, cross-origin access is not enabled.

To run the validation tests:

```bash
npm test
```

## Authentication and authorization

- `POST /api/auth/register` creates a regular `user` account; the role cannot be supplied or changed through this endpoint.
- `POST /api/auth/login` returns a JWT access token.
- For protected endpoints, send the returned token in the HTTP `Authorization` header using the Bearer scheme.
- Authenticated users may list or read students.
- Only `admin` users may create, update, or delete students.
- Create the initial administrator with `npm run seed:admin`. The script uses `ADMIN_NAME`, `ADMIN_EMAIL`, and `ADMIN_PASSWORD` from `.env` and refuses to promote an existing account.

Passwords are hashed with bcrypt. Set `JWT_EXPIRES_IN` to a jsonwebtoken duration such as `1d` or `2h`; it defaults to `1d`.

## API

All successful JSON responses use JSON objects, except `DELETE`, which returns an empty `204 No Content`. The student ID is MongoDB's automatically generated ObjectId, represented as a 24-character hexadecimal string.

| Method | Endpoint | Access | Description |
| --- | --- | --- | --- |
| `POST` | `/api/auth/register` | Public | Register a regular user |
| `POST` | `/api/auth/login` | Public | Sign in and receive a JWT |
| `GET` | `/api/auth/me` | Authenticated | Return the current user's profile |
| `POST` | `/api/students` | Admin | Create a student |
| `GET` | `/api/students` | Authenticated | List students with pagination and optional search |
| `GET` | `/api/students/:id` | Authenticated | Get one student |
| `PUT` | `/api/students/:id` | Admin | Replace all editable student fields |
| `DELETE` | `/api/students/:id` | Admin | Delete a student |

### Student request body

`POST /api/students` and `PUT /api/students/:id` require the complete body below. Unknown fields are rejected.

```json
{
  "fullName": "Ada Lovelace",
  "email": "ada@example.com",
  "course": "Computer Science",
  "age": 20
}
```

- `fullName`: 2–100 characters
- `email`: valid email address, stored lowercase and unique (case-insensitive by normalization)
- `course`: 2–100 characters
- `age`: whole number from 1 to 120

### Pagination and search

`GET /api/students?page=1&limit=10&search=ada`

- `page` defaults to `1` and must be at least `1`.
- `limit` defaults to `10` and must be between `1` and `100`.
- `search` is optional and performs a case-insensitive substring search on `fullName`.

The response contains `students` and `pagination` fields (`page`, `limit`, `total`, `totalPages`, `hasNextPage`, and `hasPreviousPage`).

### Status codes and errors

- `200`: read or update succeeded
- `201`: resource created
- `204`: student deleted
- `400`: invalid body, query, or ID
- `401`: missing/invalid token or invalid credentials
- `403`: signed in but not authorized for an admin-only operation
- `404`: route or student not found
- `409`: duplicate email
- `500`: unexpected server error

Validation errors return an `error` and a `details` array with field-level messages. Other errors return a JSON `error` message.

## Postman collection / demonstration

Import [`postman/Student-Management-API.postman_collection.json`](postman/Student-Management-API.postman_collection.json) into Postman. Set the collection variables:

- `baseUrl`: `http://localhost:3000`
- `adminEmail` and `adminPassword`: credentials used by `npm run seed:admin`

Run the requests in order. The collection registers a normal user and verifies that user cannot create students, logs in as the admin, and then creates, lists/searches, reads, updates, deletes, and verifies deletion of a student. Tokens and the created student ID are saved automatically. Postman test results provide the operation demonstration; screenshots can be captured from the Postman response and test tabs.

## Project layout

```text
src/
  config/       MongoDB connection
  controllers/  Request handlers
  middleware/   Authentication, validation, and error handling
  models/       Mongoose Student and User schemas
  routes/       Authentication and student endpoints
  scripts/      Initial admin creation
  validation/   Zod request schemas
test/           Request validation unit tests
postman/        CRUD and authorization demonstration collection
```
