# Redis Live Leaderboard Engine 🏆

A high-throughput, low-latency RESTful API designed to handle concurrent player score updates and real-time rank retrievals. 

The backend relies entirely on in-memory data structures (Redis Sorted Sets) to eliminate standard database write bottlenecks, ensuring sub-millisecond execution times.

🔴 **[Test the Live API via Swagger UI](https://live-leaderboard-redis.onrender.com/api-docs)**

## 🚀 Architecture & Tech Stack

| Component | Technology | Purpose |
| :--- | :--- | :--- |
| **Core Runtime** | Node.js, TypeScript, Express.js | API Gateway and route handling |
| **In-Memory Store** | Redis (`ioredis`) | High-speed data caching and ranking |
| **Validation** | Zod | Type-safe schema validation for request payloads |
| **Containerization**| Docker | Environment parity and rapid deployment |
| **Cloud Hosting** | Render, Upstash Redis | Serverless state management and microservice hosting |

## ⚡ Core Redis Commands Utilized
* `ZADD`: O(log(N)) complexity for inserting or updating a player's score.
* `ZREVRANGE`: O(log(N)+M) complexity for fetching the top-ranked players in descending order.
* `ZREVRANK`: O(log(N)) complexity for querying a specific player's exact leaderboard position.

## 🛠️ Local Development (Quick Start)

The easiest way to run the service locally is using Docker. This ensures both the Node API and the Redis instance spin up together without requiring a local Redis installation.

1. **Clone the repository:**
   ```bash
   git clone [https://github.com/CodeZone2406/Live-Leaderboard-Redis.git](https://github.com/CodeZone2406/Live-Leaderboard-Redis.git)
   cd Live-Leaderboard-Redis
2. **Run with Docker Compose:**
   ```bash
   docker-compose up --build
   ```
   The API will be available at http://localhost:5000 and Swagger docs at http://localhost:5000/docs.
