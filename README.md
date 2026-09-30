# Redis Live Leaderboard API 🏆

A high-concurrency, real-time leaderboard API. This project bypasses traditional database locking bottlenecks by using memory-isolated, atomic Redis operations.

## Features
- **Atomic Counter:** `INCR` for real-time post/article view counts.
- **Dynamic Scoring:** `ZINCRBY` to update player scores on the fly.
- **Instant Leaderboard:** `ZREVRANGE` to retrieve the top 10 players instantly.
- **User Ranks:** `ZREVRANK` to get any player's exact position (formatted to 1-indexed ranks).

## Tech Stack
- TypeScript
- Express
- ioredis
