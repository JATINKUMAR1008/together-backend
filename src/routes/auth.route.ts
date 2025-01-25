import { Router } from "express";
import passport from "passport";
import { config } from "../config/app.config";
import { googleLoginCallback, loginController, logOutController, registerUserController } from "../controllers/auth.controller";

const failedURL = config.FRONTEND_GOOGLE_CALLBACK_URL + "?status=failure";

const authRouter = Router();

authRouter.post("/register", registerUserController)

authRouter.post("/login",loginController)

authRouter.post("/logout", logOutController)

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
  }),
  googleLoginCallback
);

export default authRouter;
