import "dotenv/config";
import express from "express";
import cookieParser from "cookie-parser";
import cors from "cors";
import { config } from "./config/app.config";
import connectDatabase from "./config/database.config";
import { errorHandler } from "./middleware/errorHandler.middleware";
import passport from "passport";
// Import the existing Passport configuration
import "./config/passport.config";
import authRouter from "./routes/auth.route";
import userRouter from "./routes/user.route";
import { authenticate } from "./middleware/auth.middleware";
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
    maxAge: 24 * 60 * 60 * 1000, // 1 day
    secure: config.NODE_ENV === "production", // Only send cookies over HTTPS in production // Prevent client-side JavaScript from accessing the cookie
    sameSite: "none", // Required for cross-origin requests
  })
);

app.use(passport.initialize());

// Configure CORS properly for both development and production
// Log frontend origin for debugging
console.log('Configuring CORS with frontend origin:', config.FRONTEND_ORIGIN);

// Log the FRONTEND_ORIGIN value for debugging
console.log('FRONTEND_ORIGIN value:', typeof config.FRONTEND_ORIGIN, config.FRONTEND_ORIGIN);

// Enable CORS with credentials
app.use(cors({
  origin: function(origin, callback) {
    console.log('Request from origin:', origin);
    
    // Handle allowing origins from our allowed list
    if (!origin) {
      // Allow requests with no origin (like mobile apps, curl, etc)
      callback(null, true);
      return;
    }
    
    // Handle both array and string FRONTEND_ORIGIN
    const allowedOrigins = Array.isArray(config.FRONTEND_ORIGIN) 
      ? config.FRONTEND_ORIGIN 
      : [config.FRONTEND_ORIGIN];
    
    if (allowedOrigins.indexOf(origin) !== -1 || config.NODE_ENV !== 'production') {
      callback(null, true);
    } else {
      console.log('Origin not allowed by CORS:', origin);
      console.log('Allowed origins:', allowedOrigins);
      callback(new Error('Not allowed by CORS'), false);
    }
  },
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Origin', 'X-Requested-With', 'Content-Type', 'Accept', 'Authorization'],
  exposedHeaders: ['Set-Cookie']
}));

// Add explicit CORS headers for preflight
app.options('*', (req, res) => {
  const origin = req.headers.origin;
  
  // Handle both array and string FRONTEND_ORIGIN
  const allowedOrigins = Array.isArray(config.FRONTEND_ORIGIN) 
    ? config.FRONTEND_ORIGIN 
    : [config.FRONTEND_ORIGIN];
  
  // Only set Allow-Origin for origins in our list
  if (origin && (allowedOrigins.indexOf(origin) !== -1 || config.NODE_ENV !== 'production')) {
    res.header('Access-Control-Allow-Origin', origin);
  }
  
  res.header('Access-Control-Allow-Credentials', 'true');
  res.header('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
  res.header('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept, Authorization');
  res.header('Access-Control-Max-Age', '86400'); // 24 hours
  res.status(204).end();
});

// One more middleware to ensure credentials header is present
app.use((req, res, next) => {
  res.header('Access-Control-Allow-Credentials', 'true');
  next();
});

app.use(`${BASE_PATH}/auth`, authRouter);
// Use our custom authentication middleware
app.use(`${BASE_PATH}/user`, authenticate, userRouter);
app.use(`${BASE_PATH}/workspace`, authenticate, workspaceRouter);
app.use(`${BASE_PATH}/project`, authenticate, projectRouter);
app.use(`${BASE_PATH}/task`, authenticate, taskRouter);
app.use(`${BASE_PATH}/member`, authenticate, memberRouter);

app.use(errorHandler);

app.listen(config.PORT, async () => {
  console.log(
    `Server is running on http://localhost:${config.PORT}${BASE_PATH}`
  );
  await connectDatabase();
});
