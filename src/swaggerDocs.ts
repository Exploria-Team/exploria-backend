const swaggerDocs = {
    openapi: "3.0.0",
    info: {
      title: "Exploria API Documentation",
    },
    servers: [
        {
          url: "http://localhost:3000/api/v1",
          description: "Local",
        },
      ],
    paths: {
      "/auth/signup": {
        post: {
          summary: "Sign up a new user",
          tags: ["Auth"],
          requestBody: {
            required: true,
            content: {
              "application/json": {
                schema: {
                  type: "object",
                  properties: {
                    email: { type: "string", example: "samsul@gmail.com" },
                    password: { type: "string", example: "12345678" },
                    name: { type: "string", example: "samsul" },
                  },
                  required: ["email", "password", "name"],
                },
              },
            },
          },
          responses: {
            200: {
              description: "User created successfully",
              content: {
                "application/json": {
                  schema: {
                    type: "object",
                    properties: {
                      id: { type: "integer" },
                      name: { type: "string" },
                      email: { type: "string" },
                      password: { type: "string" },
                      createdAt: { type: "string", format: "date-time" },
                      updatedAt: { type: "string", format: "date-time" },
                      profilePictureUrl: { type: "string", nullable: true },
                      age: { type: "integer", nullable: true },
                    },
                  },
                },
              },
            },
            400: {
              description: "User already exists",
              content: {
                "application/json": {
                  schema: {
                    type: "object",
                    properties: {
                      message: { type: "string", example: "User already exists" },
                    },
                  },
                },
              },
            },
            500: {
                description: "Server error",
                content: {
                    "application/json": {
                        schema: {
                            type: "object",
                            properties: {
                                message: { type: "string", example: "Invalid parameters" }
                            }
                        }
                    }
                }
            }
          },
        },
      },
      "/auth/login": {
        post: {
            summary: "Login a user",
            tags: ["Auth"],
            requestBody: {
            required: true,
            content: {
                "application/json": {
                schema: {
                    type: "object",
                    properties: {
                    email: { type: "string", example: "samsul@gmail.com" },
                    password: { type: "string", example: "12345678" },
                    },
                    required: ["email", "password"],
                },
                },
            },
            },
            responses: {
            200: {
                description: "User logged in successfully",
                content: {
                "application/json": {
                    schema: {
                    type: "object",
                    properties: {
                        user: {
                        type: "object",
                        properties: {
                            id: { type: "integer" },
                            name: { type: "string" },
                            email: { type: "string" },
                            password: { type: "string" },
                            createdAt: { type: "string", format: "date-time" },
                            updatedAt: { type: "string", format: "date-time" },
                            profilePictureUrl: { type: "string", nullable: true },
                            age: { type: "integer", nullable: true },
                        },
                        },
                        token: { type: "string" },
                    },
                    },
                },
                },
            },
            400: {
                description: "Bad Request - Invalid credentials or account not found",
                content: {
                "application/json": {
                    schema: {
                    type: "object",
                    properties: {
                        message: { type: "string" },
                    },
                    },
                    examples: {
                    AccountNotFound: {
                        summary: "Account Not Found",
                        value: {
                        message: "Account Not Found",
                        },
                    },
                    InvalidPassword: {
                        summary: "Invalid Password",
                        value: {
                        message: "Invalid Password",
                        },
                    },
                    },
                },
                },
            },
            },
        },
     },
     "/auth/me": {
        get: {
            summary: "Get current user details",
            tags: ["Auth"],
            security: [{ jwtAuth: [] }],
            responses: {
            200: {
                description: "Current user details",
                content: {
                "application/json": {
                    schema: {
                    type: "object",
                    properties: {
                        id: { type: "integer" },
                        name: { type: "string" },
                        email: { type: "string" },
                        password: { type: "string" }, // Password included
                        createdAt: { type: "string", format: "date-time" },
                        updatedAt: { type: "string", format: "date-time" },
                        profilePictureUrl: { type: "string", nullable: true },
                        age: { type: "integer", nullable: true },
                    },
                    },

                },
                },
            },
            401: {
                description: "Unauthorized",
                content: {
                "application/json": {
                    schema: {
                    type: "object",
                    properties: {
                        message: { type: "string" },
                    },
                    },
                    example: {
                    message: "Invalid Authorization",
                    },
                },
                },
            },
            },
        },
    },
    
    '/user/{id}': {
        get: {
            summary: "Get user by ID",
            tags: ["User"],
            security: [{ jwtAuth: [] }],
            description: "Retrieve user details by their ID",
            parameters: [
                {
                    name: "id",
                    in: "path",
                    required: true,
                    description: "ID of the user to retrieve",
                    schema: {
                        type: "integer",
                        example: 1,
                    },
                },
            ],
            responses: {
                200: {
                    description: "User details retrieved successfully",
                    content: {
                        "application/json": {
                            schema: {
                                type: "object",
                                properties: {
                                    status_code: { type: "integer", example: 200 },
                                    data: {
                                        type: "object",
                                        properties: {
                                            id: { type: "integer", example: 1 },
                                            name: { type: "string", example: "John Doe" },
                                            email: { type: "string", example: "john.doe@example.com" },
                                            profilePictureUrl: {
                                                type: "string",
                                                nullable: true,
                                                example: "https://example.com/path/to/profile-picture.jpg",
                                            },
                                            age: { type: "integer", nullable: true, example: 30 },
                                        },
                                    },
                                },
                            },
                        },
                    },
                },
                404: {
                    description: "User not found",
                    content: {
                        "application/json": {
                            schema: {
                                type: "object",
                                properties: {
                                    status_code: { type: "integer", example: 404 },
                                    message: { type: "string", example: "User not found" },
                                },
                            },
                        },
                    },
                },
                500: {
                    description: "Internal server error",
                    content: {
                        "application/json": {
                            schema: {
                                type: "object",
                                properties: {
                                    status_code: { type: "integer", example: 500 },
                                    message: {
                                        type: "string",
                                        example: "Failed to fetch user data",
                                    },
                                },
                            },
                        },
                    },
                },
            },
        },
        put: {
            summary: "Update user",
            tags: ["User"],
            security: [{ jwtAuth: [] }],
            description: "Update user information by user ID. At least one field in the request body must be provided.",
            parameters: [
                {
                    name: "id",
                    in: "path",
                    required: true,
                    description: "ID of the user to be updated",
                    schema: {
                        type: "integer",
                        example: 1,
                    },
                },
            ],
            requestBody: {
                required: true,
                content: {
                    "application/json": {
                        schema: {
                            type: "object",
                            properties: {
                                name: { type: "string", example: "John Doe" },
                                email: { type: "string", example: "john.doe@example.com" },
                                age: { type: "integer", example: 30 },
                                profilePictureUrl: {
                                    type: "string",
                                    example: "https://example.com/path/to/profile-picture.jpg",
                                },
                            },
                            additionalProperties: false,
                        },
                        examples: {
                            minimal: {
                                summary: "Update name only",
                                value: {
                                    name: "John Doe",
                                },
                            },
                            emailOnly: {
                                summary: "Update email only",
                                value: {
                                    email: "john.doe@example.com",
                                },
                            },
                            fullUpdate: {
                                summary: "Full update with all fields",
                                value: {
                                    name: "John Doe",
                                    email: "john.doe@example.com",
                                    age: 30,
                                    profilePictureUrl: "https://example.com/path/to/profile-picture.jpg",
                                },
                            },
                            ageOnly: {
                                summary: "Update age only",
                                value: {
                                    age: 35,
                                },
                            },
                        },
                    },
                },
            },
            responses: {
                200: {
                    description: "User updated successfully",
                    content: {
                        "application/json": {
                            schema: {
                                type: "object",
                                properties: {
                                    status_code: { type: "integer", example: 200 },
                                    data: {
                                        type: "object",
                                        properties: {
                                            id: { type: "integer", example: 1 },
                                            name: { type: "string", example: "John Doe" },
                                            email: { type: "string", example: "john.doe@example.com" },
                                            profilePictureUrl: {
                                                type: "string",
                                                example: "https://example.com/path/to/profile-picture.jpg",
                                            },
                                            age: { type: "integer", example: 30 },
                                        },
                                    },
                                },
                            },
                        },
                    },
                },
                400: {
                    description: "Validation failed",
                    content: {
                        "application/json": {
                            schema: {
                                type: "object",
                                properties: {
                                    status_code: { type: "integer", example: 400 },
                                    message: { type: "string", example: "Validation failed" },
                                    errors: {
                                        type: "array",
                                        items: {
                                            type: "object",
                                            properties: {
                                                message: {
                                                    type: "string",
                                                    example: "Request body cannot be empty",
                                                },
                                                path: { type: "string", example: "name" },
                                            },
                                        },
                                    },
                                },
                            },
                        },
                    },
                },
                404: {
                    description: "User not found",
                    content: {
                        "application/json": {
                            schema: {
                                type: "object",
                                properties: {
                                    status_code: { type: "integer", example: 404 },
                                    message: { type: "string", example: "User not found" },
                                },
                            },
                        },
                    },
                },
                500: {
                    description: "Internal server error",
                    content: {
                        "application/json": {
                            schema: {
                                type: "object",
                                properties: {
                                    status_code: { type: "integer", example: 500 },
                                    message: {
                                        type: "string",
                                        example: "Failed to update user",
                                    },
                                },
                            },
                        },
                    },
                },
            },
        },
    },
    '/user/favorite': {
        post: {
            summary: 'Add or remove destination to/from favorites',
            tags: ['User'],
            security: [{ jwtAuth: [] }],
            description: 'Add a destination to the user’s favorites. If the destination is already in favorites, it will be removed.',
            requestBody: {
            required: true,
            content: {
                'application/json': {
                schema: {
                    type: 'object',
                    properties: {
                    destinationId: { type: 'string', format: 'uuid', example: 'e7a2b6bb-9e74-4c77-8d87-d57f6f5035b5' },
                    },
                    required: ['destinationId'],
                },
                example: {
                    destinationId: 'e7a2b6bb-9e74-4c77-8d87-d57f6f5035b5',
                },
                },
            },
            },
            responses: {
            201: {
                description: 'Favorite added successfully',
                content: {
                'application/json': {
                    schema: {
                    type: 'object',
                    properties: {
                        status_code: { type: 'integer', example: 201 },
                        message: { type: 'string', example: 'Favorite added' },
                        data: {
                        type: 'object',
                        properties: {
                            id: { type: 'integer', example: 1 },
                            destinationId: { type: 'string', format: 'uuid', example: 'e7a2b6bb-9e74-4c77-8d87-d57f6f5035b5' },
                            userId: { type: 'integer', example: 1 },
                            date: { type: 'string', format: 'date-time', example: '2024-12-03T12:00:00Z' },
                        },
                        },
                    },
                    },
                },
                },
            },
            200: {
                description: 'Favorite removed successfully',
                content: {
                'application/json': {
                    schema: {
                    type: 'object',
                    properties: {
                        status_code: { type: 'integer', example: 200 },
                        message: { type: 'string', example: 'Favorite removed' },
                    },
                    },
                },
                },
            },
            400: {
                description: 'Validation failed',
                content: {
                'application/json': {
                    schema: {
                    type: 'object',
                    properties: {
                        status_code: { type: 'integer', example: 400 },
                        message: { type: 'string', example: 'Validation failed' },
                        errors: {
                        type: 'array',
                        items: {
                            type: 'object',
                            properties: {
                            message: { type: 'string', example: 'Invalid destination ID format' },
                            path: { type: 'string', example: 'destinationId' },
                            },
                        },
                        },
                    },
                    },
                },
                },
            },
            500: {
                description: 'Internal server error',
                content: {
                'application/json': {
                    schema: {
                    type: 'object',
                    properties: {
                        status_code: { type: 'integer', example: 500 },
                        message: { type: 'string', example: 'Failed to set favorite' },
                    },
                    },
                },
                },
            },
            },
        },
        get: {
            summary: 'Get user favorites',
            tags: ['User'],
            security: [{ jwtAuth: [] }],
            description: 'Retrieve the list of favorite destinations for the authenticated user.',
            responses: {
            200: {
                description: 'List of favorites retrieved successfully',
                content: {
                'application/json': {
                    schema: {
                    type: 'object',
                    properties: {
                        status_code: { type: 'integer', example: 200 },
                        data: {
                        type: 'array',
                        items: {
                            type: 'object',
                            properties: {
                            id: { type: 'integer', example: 1 },
                            destination: {
                                type: 'object',
                                properties: {
                                id: { type: 'string', format: 'uuid', example: 'e7a2b6bb-9e74-4c77-8d87-d57f6f5035b5' },
                                name: { type: 'string', example: 'Kota Tua' },
                                description: { type: 'string', example: 'A historical landmark in Jakarta.' },
                                averageRating: { type: 'number', format: 'float', example: 4.5 },
                                city: { type: 'string', example: 'Jakarta' },
                                },
                            },
                            date: { type: 'string', format: 'date-time', example: '2024-12-03T12:00:00Z' },
                            },
                        },
                        },
                    },
                    },
                },
                },
            },
            404: {
                description: 'No favorites found',
                content: {
                'application/json': {
                    schema: {
                    type: 'object',
                    properties: {
                        status_code: { type: 'integer', example: 404 },
                        message: { type: 'string', example: 'No favorites found' },
                    },
                    },
                },
                },
            },
            500: {
                description: 'Internal server error',
                content: {
                'application/json': {
                    schema: {
                    type: 'object',
                    properties: {
                        status_code: { type: 'integer', example: 500 },
                        message: { type: 'string', example: 'Failed to fetch favorites' },
                    },
                    },
                },
                },
            },
            },
        },
    },
    '/user/preference': {
        post: {
            summary: 'Set user preferences',
            tags: ['User'],
            security: [{ jwtAuth: [] }],
            requestBody: {
            required: true,
            content: {
                'application/json': {
                schema: {
                    type: 'object',
                    properties: {
                    preferences: {
                        type: 'array',
                        items: { type: 'integer' },
                        description: 'Array of category IDs for user preferences',
                    },
                    },
                    required: ['preferences'],
                },
                example: {
                    preferences: [1, 2, 3],
                },
                },
            },
            },
            responses: {
            201: {
                description: 'Preferences set successfully',
                content: {
                'application/json': {
                    schema: {
                    type: 'object',
                    properties: {
                        status_code: { type: 'integer', example: 201 },
                        message: { type: 'string', example: 'Preferences set successfully' },
                    },
                    },
                },
                },
            },
            400: {
                description: 'Validation failed',
                content: {
                'application/json': {
                    schema: {
                    type: 'object',
                    properties: {
                        status_code: { type: 'integer', example: 400 },
                        message: { type: 'string', example: 'Validation failed' },
                        errors: {
                        type: 'array',
                        items: {
                            type: 'object',
                            properties: {
                            message: { type: 'string', example: 'Invalid category ID' },
                            path: { type: 'string', example: 'preferences[0]' },
                            },
                        },
                        },
                    },
                    },
                },
                },
            },
            500: {
                description: 'Internal server error',
                content: {
                'application/json': {
                    schema: {
                    type: 'object',
                    properties: {
                        status_code: { type: 'integer', example: 500 },
                        message: { type: 'string', example: 'Failed to set preferences' },
                    },
                    },
                },
                },
            },
            },
        },
        get: {
            summary: 'Get user preferences',
            tags: ['User'],
            security: [{ jwtAuth: [] }],
            responses: {
                200: {
                    description: "List of user preferences",
                    content: {
                      "application/json": {
                        schema: {
                          type: "object",
                          properties: {
                            status_code: { type: "integer", example: 200 },
                            data: {
                              type: "array",
                              items: {
                                type: "object",
                                properties: {
                                  id: { type: "integer", example: 1 },
                                  name: { type: "string", example: "Bahari" },
                                  group: {
                                    type: "string",
                                    example: "Wisata Alam dan Petualangan",
                                  },
                                },
                              },
                            },
                          },
                        },
                        example: {
                          status_code: 200,
                          data: [
                            {
                              id: 1,
                              name: "Bahari",
                              group: "Wisata Alam dan Petualangan",
                            },
                            {
                              id: 3,
                              name: "Cagar Alam",
                              group: "Wisata Alam dan Petualangan",
                            },
                            {
                              id: 4,
                              name: "Hutan Lindung",
                              group: "Wisata Alam dan Petualangan",
                            },
                          ],
                        },
                      },
                    },
                  },                  
            404: {
                description: 'No preferences found',
                content: {
                'application/json': {
                    schema: {
                    type: 'object',
                    properties: {
                        status_code: { type: 'integer', example: 404 },
                        message: { type: 'string', example: 'No preferences found' },
                    },
                    },
                },
                },
            },
            500: {
                description: 'Internal server error',
                content: {
                'application/json': {
                    schema: {
                    type: 'object',
                    properties: {
                        status_code: { type: 'integer', example: 500 },
                        message: { type: 'string', example: 'Failed to fetch user preferences' },
                    },
                    },
                },
                },
            },
            },
        },
    },
    "/destination/{id}": {
        get: {
            summary: "Get destination by ID",
            tags: ["Destination"],
            parameters: [
            {
                name: "id",
                in: "path",
                required: true,
                description: "ID of the destination to retrieve",
                schema: {
                type: "integer",
                example: 9,
                },
            },
            ],
            responses: {
            200: {
                description: "Details of the destination",
                content: {
                "application/json": {
                    schema: {
                    type: "object",
                    properties: {
                        status_code: { type: "integer", example: 200 },
                        data: {
                        type: "object",
                        properties: {
                            id: { type: "integer", example: 9 },
                            name: { type: "string", example: "Pelabuhan Marina" },
                            description: {
                            type: "string",
                            example:
                                "Pelabuhan Marina Ancol berada di kawasan Taman Impian Jaya Ancol, Jakarta.",
                            },
                            lat: { type: "number", format: "float", example: 1.07888 },
                            lon: { type: "number", format: "float", example: 103.931398 },
                            averageRating: { type: "number", format: "float", example: 4.4 },
                            entryFee: { type: "integer", example: 175000 },
                            city: { type: "string", example: "Jakarta" },
                            photoUrls: {
                            type: "array",
                            items: {
                                type: "string",
                            },
                            example: [
                                "https://storage.googleapis.com/exploria-testing-bucket/images_output/Pelabuhan%20Marina/Pelabuhan%20Marina_0.jpg",
                                "https://storage.googleapis.com/exploria-testing-bucket/images_output/Pelabuhan%20Marina/Pelabuhan%20Marina_1.jpg",
                            ],
                            },
                        },
                        },
                    },
                    },
                },
                },
            },
            400: {
                description: "Validation failed",
                content: {
                "application/json": {
                    schema: {
                    type: "object",
                    properties: {
                        status_code: { type: "integer", example: 400 },
                        message: { type: "string", example: "Validation failed" },
                        errors: {
                        type: "array",
                        items: {
                            type: "object",
                            properties: {
                            message: { type: "string", example: "Invalid ID format" },
                            path: { type: "string", example: "id" },
                            },
                        },
                        },
                    },
                    },
                },
                },
            },
            404: {
                description: "Destination not found",
                content: {
                "application/json": {
                    schema: {
                    type: "object",
                    properties: {
                        status_code: { type: "integer", example: 404 },
                        message: { type: "string", example: "Destination not found" },
                    },
                    },
                },
                },
            },
            500: {
                description: "Internal server error",
                content: {
                "application/json": {
                    schema: {
                    type: "object",
                    properties: {
                        status_code: { type: "integer", example: 500 },
                        message: {
                        type: "string",
                        example: "Internal server error",
                        },
                    },
                    },
                },
                },
            },
            },
        },
    },
    "/destination": {
        get: {
            summary: "Search / get all destinations",
            tags: ["Destination"],
            parameters: [
            {
                name: "search",
                in: "query",
                required: false,
                description: "Keyword to search destinations",
                schema: { type: "string", example: "museum" },
            },
            {
                name: "city",
                in: "query",
                required: false,
                description: "Filter by city",
                schema: { type: "string", example: "Jakarta" },
            },
            {
                name: "page",
                in: "query",
                required: false,
                description: "Page number",
                schema: { type: "integer", example: 1 },
            },
            {
                name: "size",
                in: "query",
                required: false,
                description: "Number of items per page",
                schema: { type: "integer", example: 2 },
            },
            ],
            responses: {
            200: {
                description: "List of destinations",
                content: {
                "application/json": {
                    schema: {
                    type: "object",
                    properties: {
                        status_code: { type: "integer", example: 200 },
                        data: {
                        type: "object",
                        properties: {
                            destinations: {
                            type: "array",
                            items: {
                                type: "object",
                                properties: {
                                id: { type: "integer", example: 2 },
                                name: { type: "string", example: "Kota Tua" },
                                description: {
                                    type: "string",
                                    example: "Kota tua di Jakarta, yang juga bernama Kota Tua, berpusat di Alun-Alun Fatahillah...",
                                },
                                lat: { type: "number", format: "float", example: -6.1376448 },
                                lon: { type: "number", format: "float", example: 106.8171245 },
                                averageRating: { type: "number", format: "float", example: 4.6 },
                                entryFee: { type: "integer", example: null },
                                city: { type: "string", example: "Jakarta" },
                                photoUrls: {
                                    type: "array",
                                    items: { type: "string" },
                                    example: [
                                    "https://storage.googleapis.com/exploria-testing-bucket/images_output/Kota%20Tua/Kota%20Tua_0.jpg",
                                    "https://storage.googleapis.com/exploria-testing-bucket/images_output/Kota%20Tua/Kota%20Tua_1.jpg",
                                    ],
                                },
                                },
                            },
                            },
                            pagination: {
                            type: "object",
                            properties: {
                                currentPage: { type: "integer", example: 1 },
                                pageSize: { type: "integer", example: 2 },
                                totalItems: { type: "integer", example: 23 },
                                totalPages: { type: "integer", example: 12 },
                            },
                            },
                        },
                        },
                    },
                    },
                },
                },
            },
            400: {
                description: "Validation failed",
                content: {
                "application/json": {
                    schema: {
                    type: "object",
                    properties: {
                        status_code: { type: "integer", example: 400 },
                        message: { type: "string", example: "Validation failed" },
                        errors: {
                        type: "array",
                        items: {
                            type: "object",
                            properties: {
                            message: { type: "string", example: "Invalid page format" },
                            path: { type: "string", example: "page" },
                            },
                        },
                        },
                    },
                    },
                },
                },
            },
            404: {
                description: "No destinations found",
                content: {
                "application/json": {
                    schema: {
                    type: "object",
                    properties: {
                        status_code: { type: "integer", example: 404 },
                        message: { type: "string", example: "No destinations found" },
                    },
                    },
                },
                },
            },
            500: {
                description: "Internal server error",
                content: {
                "application/json": {
                    schema: {
                    type: "object",
                    properties: {
                        status_code: { type: "integer", example: 500 },
                        message: { type: "string", example: "Internal server error" },
                    },
                    },
                },
                },
            },
            },
        },
    },
    '/tour-guides': {
      get: {
        summary: 'Get list of tour guides',
        tags: ["Tour Guide"],
        description: 'Fetches a paginated list of tour guides with optional search filtering',
        parameters: [
          {
            name: 'search',
            in: 'query',
            description: 'Search term to filter tour guides by name, city, or category',
            required: false,
            schema: {
              type: 'string',
            },
          },
          {
            name: 'page',
            in: 'query',
            description: 'Page number for pagination',
            required: false,
            schema: {
              type: 'integer',
              example: 1,
            },
          },
          {
            name: 'size',
            in: 'query',
            description: 'Number of items per page',
            required: false,
            schema: {
              type: 'integer',
              example: 5,
            },
          },
        ],
        responses: {
          200: {
            description: 'A list of tour guides',
            content: {
              'application/json': {
                schema: {
                  type: 'object',
                  properties: {
                    status_code: { type: 'integer', example: 200 },
                    data: {
                      type: 'object',
                      properties: {
                        tourGuides: {
                          type: 'array',
                          items: {
                            type: 'object',
                            properties: {
                              id: { type: 'string' },
                              name: { type: 'string' },
                              email: { type: 'string' },
                              waNumber: { type: 'string' },
                              location: { type: 'string' },
                              price: { type: 'integer' },
                              category: { type: 'string' },
                              categoryGroup: { type: 'string' },
                              verified: { type: 'boolean' },
                              bio: { type: 'string' },
                              gender: { type: 'string' },
                            },
                          },
                        },
                        pagination: {
                          type: 'object',
                          properties: {
                            currentPage: { type: 'integer' },
                            pageSize: { type: 'integer' },
                            totalItems: { type: 'integer' },
                            totalPages: { type: 'integer' },
                          },
                        },
                      },
                    },
                  },
                },
              },
            },
          },
          404: {
            description: 'No tour guides found',
            content: {
              'application/json': {
                schema: {
                  type: 'object',
                  properties: {
                    status_code: { type: 'integer', example: 404 },
                    message: { type: 'string', example: 'No tour guides found' },
                  },
                },
              },
            },
          },
          400: {
            description: 'Validation failed',
            content: {
              'application/json': {
                schema: {
                  type: 'object',
                  properties: {
                    status_code: { type: 'integer', example: 400 },
                    message: { type: 'string', example: 'Validation failed' },
                    errors: { type: 'array', items: { type: 'string' } },
                  },
                },
              },
            },
          },
          500: {
            description: 'Failed to search tour guides',
            content: {
              'application/json': {
                schema: {
                  type: 'object',
                  properties: {
                    status_code: { type: 'integer', example: 500 },
                    message: { type: 'string', example: 'Failed to search tour guides' },
                  },
                },
              },
            },
          },
        },
      },
    },
    '/tour-guides/{id}': {
      get: {
        summary: 'Get a tour guide by ID',
        tags: ["Tour Guide"],
        description: 'Fetches the details of a specific tour guide by their ID',
        parameters: [
          {
            name: 'id',
            in: 'path',
            description: 'The ID of the tour guide to retrieve',
            required: true,
            schema: {
              type: 'string',
            },
          },
        ],
        responses: {
          200: {
            description: 'A single tour guide',
            content: {
              'application/json': {
                schema: {
                  type: 'object',
                  properties: {
                    status_code: { type: 'integer', example: 200 },
                    data: {
                      type: 'object',
                      properties: {
                        id: { type: 'string' },
                        name: { type: 'string' },
                        email: { type: 'string' },
                        waNumber: { type: 'string' },
                        location: { type: 'string' },
                        price: { type: 'integer' },
                        category: { type: 'string' },
                        categoryGroup: { type: 'string' },
                        verified: { type: 'boolean' },
                        bio: { type: 'string' },
                        gender: { type: 'string' },
                      },
                    },
                  },
                },
              },
            },
          },
          404: {
            description: 'Tour guide not found',
            content: {
              'application/json': {
                schema: {
                  type: 'object',
                  properties: {
                    status_code: { type: 'integer', example: 404 },
                    message: { type: 'string', example: 'Tour guide not found' },
                  },
                },
              },
            },
          },
          400: {
            description: 'Validation failed',
            content: {
              'application/json': {
                schema: {
                  type: 'object',
                  properties: {
                    status_code: { type: 'integer', example: 400 },
                    message: { type: 'string', example: 'Validation failed' },
                    errors: { type: 'array', items: { type: 'string' } },
                  },
                },
              },
            },
          },
          500: {
            description: 'Failed to fetch tour guide details',
            content: {
              'application/json': {
                schema: {
                  type: 'object',
                  properties: {
                    status_code: { type: 'integer', example: 500 },
                    message: { type: 'string', example: 'Failed to fetch tour guide details' },
                  },
                },
              },
            },
          },
        },
      },
    },
    '/review/destination/{destinationId}': {
        get: {
            summary: 'Get reviews for a destination',
            tags: ['Review'],
            parameters: [
                {
                    name: 'destinationId',
                    in: 'path',
                    required: true,
                    description: 'ID of the destination',
                    schema: { type: 'integer', example: 5 },
                },
                {
                    name: 'page',
                    in: 'query',
                    description: 'Page number',
                    schema: { type: 'integer', example: 1 },
                },
                {
                    name: 'size',
                    in: 'query',
                    description: 'Items per page',
                    schema: { type: 'integer', example: 5 },
                },
            ],
            responses: {
                200: {
                    description: 'Reviews found',
                    content: {
                        'application/json': {
                            schema: {
                                type: 'object',
                                properties: {
                                    status_code: { type: 'integer', example: 200 },
                                    data: {
                                        type: 'object',
                                        properties: {
                                            reviews: {
                                                type: 'array',
                                                items: {
                                                    type: 'object',
                                                    properties: {
                                                        id: { type: 'string', example: '525856db-c331-4ddd-bf20-c1f14e59df3f' },
                                                        reviewText: { type: 'string', example: 'Amazing destination, highly recommended!' },
                                                        rating: { type: 'integer', example: 5 },
                                                        reviewDate: { type: 'string', format: 'date-time', example: '2024-12-03T07:43:15.486Z', nullable: true },
                                                        user: {
                                                            type: 'object',
                                                            properties: {
                                                                id: { type: 'integer', example: 1 },
                                                                name: { type: 'string', example: 'John Doe' },
                                                                profilePictureUrl: { type: 'string', example: 'https://example.com/path/to/profile.jpg', nullable: true },
                                                            },
                                                        },
                                                    },
                                                },
                                            },
                                            pagination: {
                                                type: 'object',
                                                properties: {
                                                    currentPage: { type: 'integer', example: 1 },
                                                    pageSize: { type: 'integer', example: 5 },
                                                    totalItems: { type: 'integer', example: 23 },
                                                    totalPages: { type: 'integer', example: 5 },
                                                },
                                            },
                                        },
                                    },
                                },
                            },
                        },
                    },
                },
                404: {
                    description: 'No reviews found',
                    content: {
                        'application/json': {
                            schema: {
                                type: 'object',
                                properties: {
                                    status_code: { type: 'integer', example: 404 },
                                    message: { type: 'string', example: 'No reviews found' },
                                },
                            },
                        },
                    },
                },
                400: {
                    description: 'Invalid destinationId parameter',
                    content: {
                        'application/json': {
                            schema: {
                                type: 'object',
                                properties: {
                                    status_code: { type: 'integer', example: 400 },
                                    message: { type: 'string', example: 'Invalid destinationId parameter' },
                                },
                            },
                        },
                    },
                },
                500: {
                    description: 'Internal server error',
                    content: {
                        'application/json': {
                            schema: {
                                type: 'object',
                                properties: {
                                    status_code: { type: 'integer', example: 500 },
                                    message: { type: 'string', example: 'Failed to fetch reviews' },
                                },
                            },
                        },
                    },
                },
            },
        },
    },
    '/review': {
        post: {
            summary: 'Create a new review',
            tags: ['Review'],
            security: [{ jwtAuth: [] }],
            requestBody: {
                required: true,
                content: {
                    'application/json': {
                        schema: {
                            type: 'object',
                            properties: {
                                destinationId: { type: 'integer', example: 5 },
                                reviewText: { type: 'string', example: 'Great place, enjoyed my visit!' },
                                rating: { type: 'integer', minimum: 1, maximum: 5, example: 4 },
                            },
                            required: ['destinationId', 'reviewText', 'rating'],
                        },
                    },
                },
            },
            responses: {
                201: {
                    description: 'Review created successfully',
                    content: {
                        'application/json': {
                            schema: {
                                type: 'object',
                                properties: {
                                    status_code: { type: 'integer', example: 201 },
                                    data: {
                                        type: 'object',
                                        properties: {
                                            id: { type: 'string', example: 'cdda5e08-c565-46a4-a7d1-30f87f9f4039' },
                                            userId: { type: 'integer', example: 301 },
                                            destinationId: { type: 'integer', example: 5 },
                                            reviewText: { type: 'string', example: 'Great place, enjoyed my visit!' },
                                            rating: { type: 'integer', example: 4 },
                                            reviewDate: { type: 'string', format: 'date-time', example: '2024-12-03T07:43:15.486Z' },
                                        },
                                    },
                                },
                            },
                        },
                    },
                },
                400: {
                    description: 'Invalid input',
                    content: {
                        'application/json': {
                            schema: {
                                type: 'object',
                                properties: {
                                    status_code: { type: 'integer', example: 400 },
                                    message: { type: 'array', items: { type: 'string', example: 'Review text cannot be empty' } },
                                },
                            },
                        },
                    },
                },
                500: {
                    description: 'Internal server error',
                    content: {
                        'application/json': {
                            schema: {
                                type: 'object',
                                properties: {
                                    status_code: { type: 'integer', example: 500 },
                                    message: { type: 'string', example: 'Failed to create review' },
                                },
                            },
                        },
                    },
                },
            },
        },
    },
},
components: {
    securitySchemes: {
      jwtAuth: {
        type: 'apiKey',
        name: 'Authorization',
        in: 'header', 
      },
    },
  },
    tags: [
    { name: "Auth", description: "Handle user authentication" },
    { name: "User", description: "Manage user data and preferences" },
    { name: "Destination", description: "Manage destinations and related info" },
    { name: "Tour Guide", description: "Information about available tour guides" },
    { name: "Review", description: "Submit and retrieve user reviews" },
    { name: "Travel Plan", description: "Create and manage travel plans" }
    ]
  };
  
  export default swaggerDocs;
  