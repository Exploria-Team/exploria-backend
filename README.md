# Exploria Backend API

Exploria is a RESTful API built with Express.js designed to provide a modular and scalable backend for handling CRUD operations, authentication, database management, and API documentation using Swagger. This API is suitable for modern applications requiring robust server-side communication and data management.

## Pre-requirements
- Yarn Package Manager
- PostgreSQL Database
- Node.js version 18 or later

## Libraries/Tools Used

1. **TypeScript** - Type safety and robust code structure.
2. **Zod** - Data validation.
3. **Axios** - HTTP requests.
4. **JWT** - Authentication and security.
5. **Prisma** - Database ORM.
6. **Bcrypt** - Password hashing.
7. **Swagger UI Express** - API documentation.
8. **Google Cloud Storage SDK** - File storage.
9. **Multer** - File upload management.
10. **Dotenv** - Environment variable management.


## Installation

```bash
# Install dependencies
$ npm install

# Setup the database
$ npx prisma migrate dev
```


## Running the App

```bash
$ npm run start
```

## Environment Variables (.env)

```env
PORT=8080
DATABASE_URL=postgresql://<user>:<password>@<host>:<port>/<database>
JWT_SECRET=your_jwt_secret_key
ML_API_URL=ml_api_url
```

## API Documentation
API documentation is automatically generated using Swagger. To access the docs, visit:

```
http://localhost:8080/api-docs
```

### Built With
- **Express.js** - Backend Framework
- **Node.js** - Runtime Environment
- **Docker** - Container Management

## About the Team

Exploria’s Cloud Computing team consists of passionate individuals from Bangkit 2024 Batch 2:
| *Name*                | *Bangkit ID*       | *Path*           |
|--------------------------|----------------------|--------------------|
| Muhammad Ramdhan Fitra Hidayat | C012B4KY3025       | Cloud Computing   |
| Rahmi Anisa        | C308B4KX3639      | Cloud Computing   |

---

## License
Exploria Backend API is [MIT licensed](LICENSE).

---
