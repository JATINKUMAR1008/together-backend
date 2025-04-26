import { Router } from "express";
import passport from "passport";
import { config } from "../config/app.config";
import { 
  googleLoginCallback, 
  loginController, 
  logOutController, 
  refreshTokenController, 
  registerUserController 
} from "../controllers/auth.controller";

const failedURL = config.FRONTEND_GOOGLE_CALLBACK_URL + "?status=failure";

const authRouter = Router();

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
