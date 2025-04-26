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

const app = express();
const BASE_PATH = config.BASE_PATH;

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use(
  session({
    name: "session",
    keys: [config.SESSION_SECRET],
    maxAge: 24 * 60 * 60 * 1000,
    secure: config.NODE_ENV === "production",
    httpOnly: true,
    sameSite: "none",
  })
);

app.use(passport.initialize());
app.use(passport.session());

app.use(
  cors({
    origin: config.FRONTEND_ORIGIN,
    credentials: true,
  })
);

app.use(`${BASE_PATH}/auth`, authRouter);
app.use(`${BASE_PATH}/user`, isAuthenticated, userRouter);
app.use(`${BASE_PATH}/workspace`, isAuthenticated, workspaceRouter);
app.use(`${BASE_PATH}/project`, isAuthenticated, projectRouter);
app.use(`${BASE_PATH}/task`, isAuthenticated, taskRouter);
app.use(`${BASE_PATH}/member`, isAuthenticated, memberRouter);

app.use(errorHandler);

app.listen(config.PORT, async () => {
  console.log(
    `Server is running on http://localhost:${config.PORT}${BASE_PATH}`
  );
  await connectDatabase();
});
