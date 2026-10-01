export const swaggerDocument = {
  openapi: "3.0.0",
  info: {
    title: "Live Leaderboard API",
    version: "1.0.0",
    description:
      "Real-time leaderboard API utilizing Express and Redis Sorted Sets.",
  },
  servers: [
    {
      url: "https://live-leaderboard-redis.onrender.com",
      description: "Production Server",
    },
    {
      url: "http://localhost:5000",
      description: "Local Developement Server",
    },
  ],
  paths: {
    "/health": {
      get: {
        summary: "Check API health",
        description: "Returns a simple response to confirm the service is running.",
        responses: {
          200: {
            description: "Service is healthy",
            content: {
              "application/json": {
                schema: {
                  type: "object",
                  properties: {
                    message: {
                      type: "string",
                      example: "Hey Iam healthy!",
                    },
                  },
                  required: ["message"],
                },
              },
            },
          },
        },
      },
    },
    "/redis": {
      get: {
        summary: "Check Redis connection",
        description: "Pings Redis to verify the connection is healthy.",
        responses: {
          200: {
            description: "Redis is reachable",
            content: {
              "application/json": {
                schema: {
                  type: "object",
                  properties: {
                    redis: {
                      type: "string",
                      example: "PONG",
                    },
                  },
                  required: ["redis"],
                },
              },
            },
          },
          500: {
            description: "Internal server error",
          },
        },
      },
    },
    "/post/{id}/view": {
      post: {
        summary: "Increment post views",
        description: "Increments the view counter for a specific post in Redis.",
        parameters: [
          {
            in: "path",
            name: "id",
            required: true,
            schema: {
              type: "string",
            },
            description: "Unique post identifier",
          },
        ],
        responses: {
          200: {
            description: "View count incremented successfully",
            content: {
              "application/json": {
                schema: {
                  type: "object",
                  properties: {
                    success: { type: "boolean", example: true },
                    message: {
                      type: "string",
                      example: "View Count incremented for post 123",
                    },
                    data: {
                      type: "object",
                      properties: {
                        postId: { type: "string", example: "123" },
                        views: { type: "number", example: 1 },
                      },
                    },
                  },
                  required: ["success", "message", "data"],
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
                    success: { type: "boolean", example: false },
                    message: {
                      type: "string",
                      example: "Internal server error",
                    },
                  },
                  required: ["success", "message"],
                },
              },
            },
          },
        },
      },
    },
    "/leaderboard/score": {
      post: {
        summary: "Update score for a player",
        description: "Adds points to a player's score in the leaderboard sorted set.",
        requestBody: {
          required: true,
          content: {
            "application/json": {
              schema: {
                type: "object",
                required: ["userId", "points"],
                properties: {
                  userId: { type: "string", example: "42" },
                  points: { type: "number", example: 25 },
                },
              },
            },
          },
        },
        responses: {
          200: {
            description: "Score updated successfully",
            content: {
              "application/json": {
                schema: {
                  type: "object",
                  properties: {
                    success: { type: "boolean", example: true },
                    message: {
                      type: "string",
                      example: "Score updated for player 42",
                    },
                    data: {
                      type: "object",
                      properties: {
                        userId: { type: "string", example: "42" },
                        updatedScore: { type: "number", example: 250 },
                      },
                    },
                  },
                  required: ["success", "message", "data"],
                },
              },
            },
          },
          400: {
            description: "Invalid payload",
            content: {
              "application/json": {
                schema: {
                  type: "object",
                  properties: {
                    success: { type: "boolean", example: false },
                    message: {
                      type: "string",
                      example: "Invalid userId or points payload",
                    },
                  },
                  required: ["success", "message"],
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
                    success: { type: "boolean", example: false },
                    message: {
                      type: "string",
                      example: "Internal server error",
                    },
                  },
                  required: ["success", "message"],
                },
              },
            },
          },
        },
      },
    },
    "/leaderboard": {
      get: {
        summary: "Get top 10 leaderboard entries",
        description: "Fetches the highest-ranking players from the Redis sorted set.",
        responses: {
          200: {
            description: "Top 10 players retrieved successfully",
            content: {
              "application/json": {
                schema: {
                  type: "object",
                  properties: {
                    success: { type: "boolean", example: true },
                    message: {
                      type: "string",
                      example: "Fetched Top 10 players",
                    },
                    data: {
                      type: "object",
                      properties: {
                        top_10: {
                          type: "array",
                          items: {
                            type: "string",
                          },
                          example: ["player:42", "200", "player:7", "150"],
                        },
                      },
                    },
                  },
                  required: ["success", "message", "data"],
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
                    success: { type: "boolean", example: false },
                    message: {
                      type: "string",
                      example: "Internal server error",
                    },
                  },
                  required: ["success", "message"],
                },
              },
            },
          },
        },
      },
    },
    "/leaderboard/{userId}/rank": {
      get: {
        summary: "Get player rank",
        description: "Retrieves the rank of a specific player in the leaderboard.",
        parameters: [
          {
            in: "path",
            name: "userId",
            required: true,
            schema: {
              type: "string",
            },
            description: "Player identifier",
          },
        ],
        responses: {
          200: {
            description: "Player rank retrieved successfully",
            content: {
              "application/json": {
                schema: {
                  type: "object",
                  properties: {
                    success: { type: "boolean", example: true },
                    message: {
                      type: "string",
                      example: "Fetched rank for 42",
                    },
                    data: {
                      type: "object",
                      properties: {
                        player_rank: { type: "number", example: 1 },
                      },
                    },
                  },
                  required: ["success", "message", "data"],
                },
              },
            },
          },
          404: {
            description: "Player has no leaderboard rank yet",
            content: {
              "application/json": {
                schema: {
                  type: "object",
                  properties: {
                    success: { type: "boolean", example: false },
                    message: {
                      type: "string",
                      example: "Player 42 does not have a rank on the leaderboard yet.",
                    },
                  },
                  required: ["success", "message"],
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
                    success: { type: "boolean", example: false },
                    message: {
                      type: "string",
                      example: "Internal server error",
                    },
                  },
                  required: ["success", "message"],
                },
              },
            },
          },
        },
      },
    },
  },
};
