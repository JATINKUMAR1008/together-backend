import { Router, Request, Response, NextFunction } from "express";
import passport from "passport";
import { 
  googleLoginCallback, 
  loginController, 
  logOutController, 
  refreshTokenController, 
  registerUserController 
} from "../controllers/auth.controller";
import { asyncHandler } from "../middleware/asyncHandler.middleware";
import { config } from "../config/app.config";

const failedURL = config.FRONTEND_GOOGLE_CALLBACK_URL + "?status=failure";

const authRouter = Router();

// Test endpoint for cookie setting
authRouter.get("/test-cookie", asyncHandler(async (req: Request, res: Response) => {
  console.log("💡 TEST COOKIE - Request received");
  console.log("💡 TEST COOKIE - Headers:", req.headers);
  
  const isProduction = config.NODE_ENV === 'production';
  const cookieOptions = {
    httpOnly: true,
    secure: isProduction,
    sameSite: isProduction ? 'none' as const : 'lax' as const,
    domain: config.COOKIE_DOMAIN || undefined,
    path: '/',
    maxAge: 24 * 60 * 60 * 1000 // 1 day
  };
  
  console.log("💡 TEST COOKIE - Setting test cookie with options:", JSON.stringify(cookieOptions, null, 2));
  
  res.cookie('test_cookie', 'test_value', cookieOptions);
  
  return res.status(200).json({
    message: "Test cookie set",
    cookieOptions,
    headers: req.headers,
    origin: req.headers.origin
  });
}));

// Registration and Authentication routes
authRouter.post("/register", registerUserController);
authRouter.post("/login", loginController);
authRouter.post("/logout", logOutController);
authRouter.post("/refresh-token", refreshTokenController);

// Google OAuth routes
authRouter.get(
  "/google",
  passport.authenticate("google", {
    scope: ["profile", "email"],
  })
);

authRouter.get(
  "/google/callback",
  passport.authenticate("google", {
    failureRedirect: failedURL,
    session: false, // Don't use sessions, we're using JWT tokens
  }),
  googleLoginCallback
);

export default authRouter;
