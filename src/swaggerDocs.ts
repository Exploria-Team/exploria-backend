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
                description: "Bad Request",
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
                                            id: { type: "integer" },
                                            name: { type: "string" },
                                            email: { type: "string" },
                                            profilePictureUrl: {
                                                type: "string",
                                                nullable: true,
                                            },
                                            age: { type: "integer", nullable: true },
                                        },
                                    },
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
                                    message: { type: "string", example: "Invalid Authorization" }
                                }
                            }
                        }
                    }
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
                                name: { type: "string", example: "samsul" },
                                email: { type: "string", example: "samsul@gmail.com" },
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
                                    name: "samsul",
                                },
                            },
                            emailOnly: {
                                summary: "Update email only",
                                value: {
                                    email: "samsul@gmail.com",
                                },
                            },
                            fullUpdate: {
                                summary: "Full update with all fields",
                                value: {
                                    name: "samsul",
                                    email: "samsul@gmail.com",
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
                                            id: { type: "integer" },
                                            name: { type: "string" },
                                            email: { type: "string" },
                                            profilePictureUrl: { type: "string" },
                                            age: { type: "integer" },
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
                                                },
                                                path: { type: "string" },
                                            },
                                        },
                                    },
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
                                    message: { type: "string", example: "Invalid Authorization" }
                                }
                            }
                        }
                    }
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
                            message: { type: 'string' },
                            path: { type: 'string' },
                            },
                        },
                        },
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
                                message: { type: "string", example: "Invalid Authorization" }
                            }
                        }
                    }
                }
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
                                                id: { type: 'integer', example: 2 },
                                                destination: {
                                                    type: 'object',
                                                    properties: {
                                                        id: {
                                                            type: 'string',
                                                            format: 'uuid',
                                                        },
                                                        name: {
                                                            type: 'string',
                                                        },
                                                        description: {
                                                            type: 'string',
                                                        },
                                                        lat: {
                                                            type: 'number',
                                                            format: 'float',
                                                        },
                                                        lon: {
                                                            type: 'number',
                                                            format: 'float',
                                                        },
                                                        averageRating: {
                                                            type: 'number',
                                                            format: 'float',
                                                        },
                                                        entryFee: {
                                                            type: 'integer',
                                                            nullable: true,
                                                        },
                                                        visitDurationMinutes: {
                                                            type: 'integer',
                                                            nullable: true,
                                                        },
                                                        city: {
                                                            type: 'string',
                                                        },
                                                        photoUrls: {
                                                            type: 'array',
                                                            items: {
                                                                type: 'string',
                                                            },
                                                        },
                                                        categories: {
                                                            type: 'array',
                                                            items: {
                                                                type: 'string',
                                                            },
                                                        },
                                                    },
                                                },
                                                date: {
                                                    type: 'string',
                                                    format: 'date-time',
                                                    example: '2024-12-03T12:00:00Z',
                                                },
                                            },
                                        },
                                    },
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
                                    message: { type: "string", example: "Invalid Authorization" }
                                }
                            }
                        }
                    }
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
                            message: { type: 'string' },
                            path: { type: 'string' },
                            },
                        },
                        },
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
                                message: { type: "string", example: "Invalid Authorization" }
                            }
                        }
                    }
                }
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
                  401: {
                    description: "Unauthorized",
                    content: {
                        "application/json": {
                            schema: {
                                type: "object",
                                properties: {
                                    message: { type: "string", example: "Invalid Authorization" }
                                }
                            }
                        }
                    }
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
                            id: { type: "integer" },
                            name: { type: "string" },
                            description: { type: "string" },
                            lat: { type: "number", format: "float" },
                            lon: { type: "number", format: "float" },
                            averageRating: { type: "number", format: "float" },
                            entryFee: { type: "integer" },
                            visitDurationMinutes: { type: "integer" },
                            city: { type: "string" },
                            photoUrls: {
                            type: "array",
                            items: {
                                type: "string",
                            },
                            },
                            categories: {
                                type: "array",
                                items: {
                                    type: "string",
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
                            message: { type: "string" },
                            path: { type: "string" },
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
                schema: { type: "integer", default: 1 },
            },
            {
                name: "size",
                in: "query",
                required: false,
                description: "Number of items per page",
                schema: { type: "integer", default: 10 },
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
                                id: { type: "integer" },
                                name: { type: "string" },
                                description: { type: "string" },
                                lat: { type: "number", format: "float" },
                                lon: { type: "number", format: "float" },
                                averageRating: { type: "number", format: "float" },
                                entryFee: { type: "integer" },
                                visitDurationMinutes: { type: "integer" },
                                city: { type: "string" },
                                photoUrls: {
                                    type: "array",
                                    items: { type: "string" },
                                },
                                categories: {
                                    type: "array",
                                    items: {
                                        type: "string",
                                    },
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
                            message: { type: "string" },
                            path: { type: "string" },
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
              default: 1,
            },
          },
          {
            name: 'size',
            in: 'query',
            description: 'Number of items per page',
            required: false,
            schema: {
              type: 'integer',
              default: 10,
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
                                id: { type: 'string', example: "8f41316c-07e3-43a0-85ac-974fd89d3f0c" },
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
                                photoUrl: { type: 'string' },
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
                        message: { type: "string" },
                        path: { type: "string" },
                        },
                    },
                    },
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
                        id: { type: 'string', example: "8f41316c-07e3-43a0-85ac-974fd89d3f0c" },
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
                        photoUrl: { type: 'string' },
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
                        message: { type: "string" },
                        path: { type: "string" },
                        },
                    },
                    },
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
                                                        id: { type: 'string' },
                                                        reviewText: { type: 'string' },
                                                        rating: { type: 'integer', example: 5 },
                                                        reviewDate: { type: 'string', format: 'date-time', example: '2024-12-03T07:43:15.486Z', nullable: true },
                                                        user: {
                                                            type: 'object',
                                                            properties: {
                                                                id: { type: 'integer' },
                                                                name: { type: 'string' },
                                                                profilePictureUrl: { type: 'string', nullable: true },
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
                    'multipart/form-data': {
                        schema: {
                            type: 'object',
                            properties: {
                                destinationId: { type: 'integer', example: 5 },
                                reviewText: { type: 'string', example: 'Great place, enjoyed my visit!' },
                                rating: { type: 'integer', minimum: 1, maximum: 5, example: 4 },
                                reviewPhoto: {
                                    type: 'string',
                                    format: 'binary',
                                    description: 'Upload an optional review photo',
                                },
                            },
                            required: ['destinationId', 'reviewText', 'rating'],
                        },
                        examples: {
                            WithPhoto: {
                                summary: 'Review with photo',
                                value: {
                                    destinationId: 5,
                                    reviewText: 'Amazing experience at this place!',
                                    rating: 5,
                                    reviewPhoto: '(binary data)',
                                },
                            },
                        },
                    },
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
                        examples: {
                            WithoutPhoto: {
                                summary: 'Review without photo',
                                value: {
                                    destinationId: 5,
                                    reviewText: 'Had a fun trip, will come back!',
                                    rating: 4,
                                },
                            },
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
                                            id: { type: 'string' },
                                            userId: { type: 'integer' },
                                            destinationId: { type: 'integer' },
                                            reviewText: { type: 'string' },
                                            rating: { type: 'integer' },
                                            reviewDate: { type: 'string', format: 'date-time' },
                                            reviewPhotoUrl: {
                                                type: 'string',
                                                nullable: true,
                                                description: 'URL of the uploaded review photo, if available',
                                            },
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
                                    message: { type: 'array', items: { type: 'string' } },
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
                                    message: { type: "string", example: "Invalid Authorization" }
                                }
                            }
                        }
                    }
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
    "/travel-plan": {
        post: {
            summary: "Create a new travel plan",
            tags: ["Travel Plan"],
            security: [{ jwtAuth: [] }],
            requestBody: {
                required: true,
                content: {
                    "application/json": {
                        schema: {
                            type: "object",
                            properties: {
                                name: { type: "string", example: "travel plan 1" },
                                startDate: { type: "string", format: "date", example: "2024-12-8" },
                                endDate: { type: "string", format: "date", example: "2024-12-11" }
                            },
                            required: ["name", "startDate", "endDate"]
                        }
                    }
                }
            },
            responses: {
                201: {
                    description: "Travel plan created successfully",
                    content: {
                        "application/json": {
                            schema: {
                                type: "object",
                                properties: {
                                    status_code: { type: "integer", example: 201 },
                                    data: {
                                        type: "object",
                                        properties: {
                                            id: { type: "string", example: "0c124619-df40-412b-a823-89fc38691bcf" },
                                            name: { type: "string", example: "travel plan 1" },
                                            createdAt: { type: "string", format: "date-time", example: "2024-12-08T07:01:06.028Z" },
                                            startDate: { type: "string", format: "date-time", example: "2024-12-08T00:00:00.000Z" },
                                            endDate: { type: "string", format: "date-time", example: "2024-12-11T00:00:00.000Z" },
                                            totalDays: { type: "integer", example: 3 },
                                            userId: { type: "integer", example: 322 }
                                        }
                                    }
                                }
                            }
                        }
                    }
                },
                400: {
                    description: "Validation error",
                    content: {
                        "application/json": {
                            schema: {
                                type: "object",
                                properties: {
                                    status_code: { type: "integer", example: 400 },
                                    message: {
                                        type: "array",
                                        items: {
                                            type: "string"
                                        }
                                    }
                                }
                            }
                        }
                    }
                },
                401: {
                    description: "Unauthorized",
                    content: {
                        "application/json": {
                            schema: {
                                type: "object",
                                properties: {
                                    message: { type: "string", example: "Invalid Authorization" }
                                }
                            }
                        }
                    }
                },
                500: {
                    description: "Internal server error",
                    content: {
                        "application/json": {
                            schema: {
                                type: "object",
                                properties: {
                                    status_code: { type: "integer", example: 500 },
                                    message: { type: "string", example: "Failed to add plan" }
                                }
                            }
                        }
                    }
                }
            }
        }
        ,
        get: {
            summary: "Get user's travel plans",
            tags: ["Travel Plan"],
            security: [{ jwtAuth: [] }],
            responses: {
                200: {
                    description: "Travel plans retrieved successfully",
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
                                                id: { type: "string", example: "0c124619-df40-412b-a823-89fc38691bcf" },
                                                name: { type: "string", example: "travel plan 1" },
                                                createdAt: { type: "string", format: "date-time", example: "2024-12-08T07:01:06.028Z" },
                                                startDate: { type: "string", format: "date-time", example: "2024-12-08T00:00:00.000Z" },
                                                endDate: { type: "string", format: "date-time", example: "2024-12-11T00:00:00.000Z" },
                                                totalDays: { type: "integer", example: 3 },
                                                userId: { type: "integer", example: 322 }
                                            }
                                        }
                                    }
                                }
                            }
                        }
                    }
                },
                401: {
                    description: "Unauthorized",
                    content: {
                        "application/json": {
                            schema: {
                                type: "object",
                                properties: {
                                    message: { type: "string", example: "Invalid Authorization" }
                                }
                            }
                        }
                    }
                },
                500: {
                    description: "Internal server error",
                    content: {
                        "application/json": {
                            schema: {
                                type: "object",
                                properties: {
                                    status_code: { type: "integer", example: 500 },
                                    message: { type: "string", example: "Failed to fetch plans" }
                                }
                            }
                        }
                    }
                }
            }
        }
    }
    ,
    "/travel-plan/destination": {
        post: {
            summary: "Add destination to travel plan",
            tags: ["Travel Plan"],
            security: [{ jwtAuth: [] }],
            requestBody: {
                required: true,
                content: {
                    "application/json": {
                        schema: {
                            type: "object",
                            properties: {
                                planId: { type: "string", format: "uuid", example: "305840f9-676e-47d6-a96a-6a45c44cc875" },
                                destinationId: { type: "integer", example: 100 },
                                date: { type: "string", format: "date-time", example: "2024-11-25T00:00:00Z" }
                            },
                            required: ["planId", "destinationId", "date"]
                        }
                    }
                }
            },
            responses: {
                201: {
                    description: "Destination added to plan successfully",
                    content: {
                        "application/json": {
                            schema: {
                                type: "object",
                                properties: {
                                    status_code: { type: "integer", example: 201 },
                                    data: {
                                        type: "object",
                                        properties: {
                                            id: { type: "string", format: "uuid", example: "bbc67490-3977-429f-9f8d-6370042406f8" },
                                            planId: { type: "string", format: "uuid", example: "305840f9-676e-47d6-a96a-6a45c44cc875" },
                                            destinationId: { type: "integer", example: 100 },
                                            date: { type: "string", format: "date-time", example: "2024-11-25T00:00:00.000Z" }
                                        }
                                    }
                                }
                            }
                        }
                    }
                },
                400: {
                    description: "Validation error",
                    content: {
                        "application/json": {
                            schema: {
                                type: "object",
                                properties: {
                                    status_code: { type: "integer", example: 400 },
                                    message: { type: "array", items: { type: "string" } }
                                }
                            }
                        }
                    }
                },
                401: {
                    description: "Unauthorized",
                    content: {
                        "application/json": {
                            schema: {
                                type: "object",
                                properties: {
                                    message: { type: "string", example: "Invalid Authorization" }
                                }
                            }
                        }
                    }
                },
                500: {
                    description: "Internal server error",
                    content: {
                        "application/json": {
                            schema: {
                                type: "object",
                                properties: {
                                    status_code: { type: "integer", example: 500 },
                                    message: { type: "string", example: "Failed to add plan destination" }
                                }
                            }
                        }
                    }
                }
            }
        }
        ,
        get: {
            summary: "Get destinations for a travel plan",
            tags: ["Travel Plan"],
            security: [{ jwtAuth: [] }],
            parameters: [
                {
                    name: "planId",
                    in: "path",
                    required: true,
                    description: "ID of the travel plan",
                    schema: {
                        type: "string",
                        format: "uuid"
                    }
                }
            ],
            responses: {
                200: {
                    description: "List of destinations in the travel plan",
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
                                                id: { type: "string", format: "uuid" },
                                                planId: { type: "string", format: "uuid" },
                                                destinationId: { type: "integer" },
                                                date: { type: "string", format: "date-time" },
                                                destination: {
                                                    type: "object",
                                                    properties: {
                                                        id: { type: "integer" },
                                                        name: { type: "string" },
                                                        description: { type: "string" },
                                                        lat: { type: "number" },
                                                        lon: { type: "number" },
                                                        averageRating: { type: "number" },
                                                        entryFee: { type: "integer", nullable: true },
                                                        visitDurationMinutes: { type: "integer", nullable: true },
                                                        cityId: { type: "string" },
                                                        photoUrls: {
                                                            type: 'array',
                                                            items: {
                                                                type: 'string',
                                                            },
                                                        },
                                                        categories: {
                                                            type: 'array',
                                                            items: {
                                                                type: 'string',
                                                            },
                                                        },
                                                    }
                                                }
                                            }
                                        }
                                    }
                                }
                            }
                        }
                    }
                },
                401: {
                    description: "Unauthorized",
                    content: {
                        "application/json": {
                            schema: {
                                type: "object",
                                properties: {
                                    message: { type: "string", example: "Invalid Authorization" }
                                }
                            }
                        }
                    }
                },
                404: {
                    description: "Travel plan not found",
                    content: {
                      "application/json": {
                        schema: {
                          type: "object",
                          properties: {
                            status_code: { type: "integer", example: 404 },
                            message: { type: "string", example: "No destinations found in the plan" }
                          }
                        },
                        examples: {
                          "noDestinationsFound": {
                            summary: "No destinations found in the plan",
                            value: {
                              status_code: 404,
                              message: "No destinations found in the plan"
                            }
                          },
                          "planNotFound": {
                            summary: "Plan not found",
                            value: {
                              status_code: 404,
                              message: "Plan not found"
                            }
                          }
                        }
                      }
                    }
                  },
                500: {
                    description: "Internal server error",
                    content: {
                        "application/json": {
                            schema: {
                                type: "object",
                                properties: {
                                    status_code: { type: "integer", example: 500 },
                                    message: { type: "string", example: "Failed to fetch plan destinations" }
                                }
                            }
                        }
                    }
                }
            }
        }
    },
    "/travel-plan/{id}": {
        delete: {
            summary: "Delete a travel plan",
            tags: ["Travel Plan"],
            security: [{ jwtAuth: [] }],
            parameters: [
                {
                    name: "id",
                    in: "path",
                    required: true,
                    description: "ID of the travel plan",
                    schema: {
                        type: "string",
                        format: "uuid"
                    }
                }
            ],
            responses: {
                200: {
                    description: "Plan deleted successfully",
                    content: {
                        "application/json": {
                            schema: {
                                type: "object",
                                properties: {
                                    status_code: { type: "integer", example: 200 },
                                    message: { type: "string", example: "Plan deleted successfully" }
                                }
                            }
                        }
                    },
                },
                401: {
                    description: "Unauthorized",
                    content: {
                        "application/json": {
                            schema: {
                                type: "object",
                                properties: {
                                    message: { type: "string", example: "Invalid Authorization" }
                                }
                            }
                        }
                    }
                },
                404: {
                    description: "Travel plan not found",
                    content: {
                        "application/json": {
                            schema: {
                                type: "object",
                                properties: {
                                    status_code: { type: "integer", example: 404 },
                                    message: { type: "string", example: "Plan not found or not authorized" }
                                }
                            }
                        }
                    }
                },
                500: {
                    description: "Internal server error",
                    content: {
                        "application/json": {
                            schema: {
                                type: "object",
                                properties: {
                                    status_code: { type: "integer", example: 500 },
                                    message: { type: "string", example: "Failed to delete plan" }
                                }
                            }
                        }
                    }
                }
            }
        }
    },
    "/recommendation/normal-hybrid": {
        get: {
            summary: "Get normal hybrid recommendation",
            tags: ["Recommendation"],
            parameters: [
            {
                name: "page",
                in: "query",
                description: "Page number for pagination",
                required: false,
                schema: {
                type: "integer",
                default: 1,
                },
            },
            {
                name: "size",
                in: "query",
                description: "Number of items per page",
                required: false,
                schema: {
                type: "integer",
                default: 5,
                },
            },
            ],
            responses: {
            200: {
                description: "Successful response with paginated recommendations",
                content: {
                "application/json": {
                    schema: {
                    type: "object",
                    properties: {
                        status_code: {
                        type: "integer",
                        description: "Response status code",
                        },
                        data: {
                        type: "array",
                        items: {
                            type: "object",
                            properties: {
                            id: {
                                type: "integer",
                                description: "Destination ID",
                            },
                            name: {
                                type: "string",
                                description: "Destination name",
                            },
                            entryFee: {
                                type: "integer",
                                description: "Entry fee for the destination",
                            },
                            cityId: {
                                type: "integer",
                                description: "ID of the city where the destination is located",
                            },
                            photos: {
                                type: "array",
                                items: {
                                type: "string",
                                description: "URL of the photo",
                                },
                            },
                            averageRating: {
                                type: "number",
                                format: "float",
                                description: "Average rating of the destination",
                            },
                            },
                        },
                        },
                        pagination: {
                        type: "object",
                        properties: {
                            currentPage: {
                            type: "integer",
                            description: "Current page number",
                            },
                            pageSize: {
                            type: "integer",
                            description: "Number of items per page",
                            },
                            totalItems: {
                            type: "integer",
                            description: "Total number of items",
                            },
                            totalPages: {
                            type: "integer",
                            description: "Total number of pages available",
                            },
                        },
                        },
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
                                message: { type: "string", example: "Invalid Authorization" }
                            }
                        }
                    }
                }
            },
            500: {
                description: "Internal server error",
                content: {
                "application/json": {
                    schema: {
                    type: "object",
                    properties: {
                        status_code: {
                        type: "integer",
                        description: "Response status code",
                        },
                        message: {
                        type: "string",
                        description: "Error message",
                        },
                        error: {
                        type: "string",
                        description: "Detailed error message",
                        },
                    },
                    },
                },
                },
            },
        },
        },
    },
    "/recommendation/distance-hybrid/{destId}": {
        get: {
            summary: "Get distance hybrid recommendation",
            tags: ["Recommendation"],
            parameters: [
            {
                name: "destId",
                in: "path",
                required: true,
                schema: {
                type: "string",
                },
                description: "Destination ID",
            },
            {
                name: "page",
                in: "query",
                description: "Page number for pagination",
                required: false,
                schema: {
                type: "integer",
                default: 1,
                },
            },
            {
                name: "size",
                in: "query",
                description: "Number of items per page",
                required: false,
                schema: {
                type: "integer",
                default: 5,
                },
            },
            ],
            responses: {
            200: {
                description: "Successful response",
                content: {
                "application/json": {
                    schema: {
                    type: "object",
                    properties: {
                        status_code: {
                        type: "integer",
                        example: 200,
                        },
                        data: {
                        type: "array",
                        items: {
                            type: "object",
                            properties: {
                            id: { type: "integer" },
                            name: { type: "string" },
                            entryFee: { type: "integer", nullable: true },
                            cityId: { type: "integer" },
                            photos: {
                                type: "array",
                                items: { type: "string" },
                            },
                            averageRating: { type: "number" },
                            },
                        },
                        },
                        pagination: {
                        type: "object",
                        properties: {
                            currentPage: { type: "integer" },
                            pageSize: { type: "integer" },
                            totalItems: { type: "integer" },
                            totalPages: { type: "integer" },
                        },
                        },
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
                                message: { type: "string", example: "Invalid Authorization" }
                            }
                        }
                    }
                }
            },
            500: {
                description: "Internal server error",
                content: {
                "application/json": {
                    schema: {
                    type: "object",
                    properties: {
                        status_code: {
                        type: "integer",
                        description: "Response status code",
                        },
                        message: {
                        type: "string",
                        description: "Error message",
                        },
                        error: {
                        type: "string",
                        description: "Detailed error message",
                        },
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
    { name: "Travel Plan", description: "Create and manage travel plans" },
    { name: "Recommendation", description: "Get personalized destination recommendations" },
    { name: "Review", description: "Submit and retrieve user reviews" },
    { name: "Tour Guide", description: "Information about available tour guides" }
    ]
  };
  
  export default swaggerDocs;
