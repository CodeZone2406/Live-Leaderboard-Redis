import "./config/env.js";
import express, { Application, Request, Response, NextFunction } from "express";
import morgan from "morgan";
import redis from "./config/redis.js";
const app: Application = express();
const PORT = process.env.PORT || 5000;
app.use(morgan("dev"));
app.use(express.json());

app.get("/health", async (req: Request, res: Response) => {
  res.json({ message: "Hey Iam healthy!" });
});

app.get("/redis", async (req: Request, res: Response) => {
  const reply = await redis.ping();
  res.json({ redis: reply });
});

app.post("/post/:id/view", async (req: Request, res: Response) => {
  try {
    const postId = req.params.id;
    const postKey = `post:views:${postId}`;
    const updatedViews = await redis.incr(postKey);

    return res.status(200).json({
      success: true,
      message: `View Count incremented for post ${postId}`,
      data: { postId, views: updatedViews },
    });
  } catch (error) {
    return res
      .status(500)
      .json({ success: false, message: "Internal server error" });
  }
});

app.post("/leaderboard/score", async (req: Request, res: Response) => {
  try {
    const { userId, points } = req.body;

    if (!userId || isNaN(Number(points))) {
      return res
        .status(400)
        .json({ success: false, message: "Invalid userId or points payload" });
    }

    const updatedScore = await redis.zincrby(
      "leaderboard:score",
      Number(points),
      `player:${userId}`,
    );

    return res.status(200).json({
      success: true,
      message: `Score updated for player ${userId}`,
      data: { userId, updatedScore: Number(updatedScore) },
    });
  } catch (error) {
    return res
      .status(500)
      .json({ success: false, message: "Internal server error" });
  }
});

app.get("/leaderboard", async (req: Request, res: Response) => {
  try {
    const top_10 = await redis.zrevrange(
      "leaderboard:score",
      0,
      9,
      "WITHSCORES",
    );

    return res.status(200).json({
      success: true,
      message: `Fetched Top 10 players`,
      data: { top_10 },
    });
  } catch (error) {
    return res
      .status(500)
      .json({ success: false, message: "Internal server error" });
  }
});

app.get("/leaderboard/:userId/rank", async (req: Request, res: Response) => {
  try {
    const userId = req.params.userId;
    const playerRank = await redis.zrevrank(
      "leaderboard:score",
      `player:${userId}`,
    );

    if (playerRank === null) {
      return res.status(404).json({
        success: false,
        message: `Player ${userId} does not have a rank on the leaderboard yet.`,
      });
    }

    const formattedRank = playerRank + 1;

    return res.status(200).json({
      success: true,
      message: `Fetched rank for ${userId}`,
      data: { player_rank: formattedRank },
    });
  } catch (error) {
    return res
      .status(500)
      .json({ success: false, message: "Internal server error" });
  }
});

app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
