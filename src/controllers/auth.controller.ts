import { config } from "../config/app.config";
import { asyncHandler } from "../middleware/asyncHandler.middleware";
import { NextFunction, Request, Response } from "express";
import { registerSchema } from "../validation/auth.validation";
import { registerUserService } from "../services/auth.service";
import { HTTPSTATUS } from "../config/http.config";
import passport from "passport";

export const googleLoginCallback = asyncHandler(
  async (req: Request, res: Response) => {
    const currentWorkspace = req.user?.currentWorkspace;

    if (!currentWorkspace) {
      console.log("No current workspace found for user, redirecting to failure URL");
      return res.redirect(
        `${config.FRONTEND_GOOGLE_CALLBACK_URL}?status=failure`
      );
    }

    // Session is already handled by cookie-session middleware
    console.log("Session ID after Google login:", req.session.id);
    console.log("User data in session:", req.user);
    console.log("Setting cookie with session data");
    return res.redirect(
      `${config.FRONTEND_ORIGIN}/workspace/${currentWorkspace}`
    );
  }
);

export const registerUserController = asyncHandler(
  async (req: Request, res: Response) => {
    const body = registerSchema.parse({
      ...req.body,
    });

    await registerUserService(body);

    return res.status(HTTPSTATUS.CREATED).json({
      message: "User created successfully",
    });
  }
);

export const loginController = asyncHandler(
  async (req: Request, res: Response, next: NextFunction) => {
    passport.authenticate(
      "local",
      (
        err: Error | null,
        user: Express.User | false,
        info: { message: string } | undefined
      ) => {
        if (err) {
          console.error("Authentication error:", err);
          return next(err);
        }

        if (!user) {
          console.log("Authentication failed:", info?.message);
          return res.status(HTTPSTATUS.UNAUTHORIZED).json({
            message: info?.message || "Invalid email or password",
          });
        }

        req.logIn(user, (err) => {
          if (err) {
            console.error("Login error:", err);
            return next(err);
          }

          // Session is already handled by cookie-session middleware
          console.log("Session ID after login:", req.session.id);
          console.log("User data in session:", user);
          console.log("Setting cookie with session data");
          return res.status(HTTPSTATUS.OK).json({
            message: "Logged in successfully",
            user,
          });
        });
      }
    )(req, res, next);
  }
);

export const logOutController = asyncHandler(
  async (req: Request, res: Response) => {
    req.logout((err) => {
      if (err) {
        console.error("Logout error:", err);
        return res
          .status(HTTPSTATUS.INTERNAL_SERVER_ERROR)
          .json({ error: "Failed to log out" });
      }

      req.session = null as any;

      return res
        .status(HTTPSTATUS.OK)
        .clearCookie("session")
        .json({ message: "Logged out successfully" });
    });
  }
);
