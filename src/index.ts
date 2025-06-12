import "dotenv/config";
import express from "express";
import session from "cookie-session";
import cors from "cors";
import { config } from "./config/app.config";
import connectDatabase from "./config/database.config";
import { errorHandler } from "./middleware/errorHandler.middleware";
import "./config/passport.config";
import passport from "passport";
import authRouter from "./routes/auth.route";
import userRouter from "./routes/user.route";
import isAuthenticated from "./middleware/isAuthenticated.middleware";
import workspaceRouter from "./routes/workspace.route";
import projectRouter from "./routes/project.route";
import taskRouter from "./routes/task.route";
import memberRouter from "./routes/member.route";
import { RedisStore } from "connect-redis";
import { createClient } from "redis";

const app = express();
const BASE_PATH = config.BASE_PATH;

// Trust Render's proxy to recognize HTTPS requests
app.set("trust proxy", 1);

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

const redisClient = createClient({
  username: config.REDIS_USERNAME || "default",
  password: config.REDIS_PASSWORD,
  socket: {
    host: config.REDIS_HOST,
    port: 12745,
  },
});
redisClient.connect().catch(console.error);

// CORS configuration for Vercel frontend
app.use(
  cors({
    origin: ["https://togethersync.vercel.app", "http://localhost:5173"],
    credentials: true,
  })
);

// Session middleware configuration
app.use(
  session({
    name: "session",
    keys: [config.SESSION_SECRET],
    maxAge: 24 * 60 * 60 * 1000, // 24 hours
    secure: config.NODE_ENV === "production",
    httpOnly: true,
    sameSite: config.NODE_ENV === "production" ? "none" : "lax",
    domain: config.NODE_ENV === "production" ? ".vercel.app" : undefined
  })
);

app.use(passport.initialize());
app.use(passport.session());

// Routes
app.use(`${BASE_PATH}/auth`, authRouter);
app.use(`${BASE_PATH}/user`, isAuthenticated, userRouter);
app.use(`${BASE_PATH}/workspace`, isAuthenticated, workspaceRouter);
app.use(`${BASE_PATH}/project`, isAuthenticated, projectRouter);
app.use(`${BASE_PATH}/task`, isAuthenticated, taskRouter);
app.use(`${BASE_PATH}/member`, isAuthenticated, memberRouter);

// Error handler
app.use(errorHandler);

// Start server
app.listen(config.PORT, async () => {
  console.log(
    `Server is running on http://localhost:${config.PORT}${BASE_PATH}`
  );
  await connectDatabase();
});
