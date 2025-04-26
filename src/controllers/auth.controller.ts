import { config } from "../config/app.config";
import { asyncHandler } from "../middleware/asyncHandler.middleware";
import { Request, Response } from 'express';
import { registerUserService, verifyUserService } from "../services/auth.service";
import { HTTPSTATUS } from "../config/http.config";
import { generateToken, generateRefreshToken, verifyRefreshToken } from "../utils/jwt.utils";
import passport from 'passport';
import { registerSchema, loginSchema } from "../validation/auth.validation";

export const googleLoginCallback = asyncHandler(
  async (req: Request, res: Response) => {
    const user = req.user;
    
    if (!user || !user._id) {
      return res.redirect(
        `${config.FRONTEND_GOOGLE_CALLBACK_URL}?status=failure`
      );
    }
    
    // Generate JWT tokens
    const accessToken = generateToken({
      userId: String(user._id),
      workspaceId: user.currentWorkspace ? String(user.currentWorkspace) : undefined,
      email: user.email
    });
    
    const refreshToken = generateRefreshToken({
      userId: String(user._id),
      workspaceId: user.currentWorkspace ? String(user.currentWorkspace) : undefined,
      email: user.email
    });
    
    // Set cookies
    setCookies(res, accessToken, refreshToken);
    
    // Redirect to frontend with the currentWorkspace
    return res.redirect(
      `${config.FRONTEND_ORIGIN}/workspace/${user.currentWorkspace}`
    );
  }
);

export const registerUserController = asyncHandler(
  async (req: Request, res: Response) => {
    const body = registerSchema.parse({
      ...req.body,
    });

    const result = await registerUserService(body);
    
    // Generate tokens
    const accessToken = generateToken({
      userId: String(result.userId),
      workspaceId: String(result.workspaceId)
    });
    
    const refreshToken = generateRefreshToken({
      userId: String(result.userId),
      workspaceId: String(result.workspaceId)
    });
    
    // Set cookies
    setCookies(res, accessToken, refreshToken);

    return res.status(HTTPSTATUS.CREATED).json({
      message: "User created successfully",
      userId: result.userId,
      workspaceId: result.workspaceId
    });
  }
);

export const loginController = asyncHandler(
  async (req: Request, res: Response) => {
    const { email, password } = loginSchema.parse(req.body);
    
    try {
      const user = await verifyUserService({ email, password });
      
      // Generate tokens
      const accessToken = generateToken({
        userId: String(user._id),
        workspaceId: user.currentWorkspace ? String(user.currentWorkspace) : undefined,
        email: user.email
      });
      
      const refreshToken = generateRefreshToken({
        userId: String(user._id),
        workspaceId: user.currentWorkspace ? String(user.currentWorkspace) : undefined,
        email: user.email
      });
      
      // Set cookies
      setCookies(res, accessToken, refreshToken);
      
      return res.status(HTTPSTATUS.OK).json({
        message: "Logged in successfully",
        user
      });
    } catch (error) {
      return res.status(HTTPSTATUS.UNAUTHORIZED).json({
        message: error instanceof Error ? error.message : "Invalid email or password"
      });
    }
  }
);

export const logOutController = asyncHandler(
  async (req: Request, res: Response) => {
    // Clear cookies with same settings as when they were set
    const isProduction = config.NODE_ENV === 'production';
    const cookieOptions = {
      httpOnly: true,
      secure: isProduction,
      sameSite: isProduction ? 'none' as const : 'lax' as const,
      path: '/'
    };
    
    res.clearCookie('access_token', cookieOptions);
    res.clearCookie('refresh_token', cookieOptions);
    
    return res
      .status(HTTPSTATUS.OK)
      .json({ message: "Logged out successfully" });
  }
);

// Helper function to set authentication cookies
const setCookies = (res: Response, accessToken: string, refreshToken: string) => {
  // Configure cookie options based on environment
  const isProduction = config.NODE_ENV === 'production';
  const cookieOptions = {
    httpOnly: true,
    secure: isProduction, // HTTPS in production
    sameSite: isProduction ? 'none' as const : 'lax' as const,
    // Remove domain setting for cross-origin cookies in production
    path: '/',
    maxAge: undefined as number | undefined
  };
  
  // Set access token cookie with shorter expiration
  res.cookie('access_token', accessToken, {
    ...cookieOptions,
    maxAge: 24 * 60 * 60 * 1000, // 1 day in milliseconds
  });
  
  // Set refresh token cookie with longer expiration
  res.cookie('refresh_token', refreshToken, {
    ...cookieOptions,
    maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days in milliseconds
  });
};

// Add token refresh endpoint
export const refreshTokenController = asyncHandler(
  async (req: Request, res: Response) => {
    const refreshToken = req.cookies.refresh_token;
    
    if (!refreshToken) {
      return res.status(HTTPSTATUS.UNAUTHORIZED).json({
        message: "Refresh token not found"
      });
    }
    
    try {
      // Verify refresh token using the util function
      const decoded = verifyRefreshToken(refreshToken);
      
      // Generate new access token
      const accessToken = generateToken({
        userId: decoded.userId,
        workspaceId: decoded.workspaceId,
        email: decoded.email
      });
      
      // Set only the access token cookie
      const isProduction = config.NODE_ENV === 'production';
      res.cookie('access_token', accessToken, {
        httpOnly: true,
        secure: isProduction,
        sameSite: isProduction ? 'none' as const : 'lax' as const,
        // Remove domain setting for cross-origin cookies in production
        path: '/',
        maxAge: 24 * 60 * 60 * 1000, // 1 day
      });
      
      return res.status(HTTPSTATUS.OK).json({
        message: "Token refreshed successfully"
      });
    } catch (error) {
      // Clear cookies on refresh token failure
      res.clearCookie('access_token');
      res.clearCookie('refresh_token');
      
      return res.status(HTTPSTATUS.UNAUTHORIZED).json({
        message: "Invalid refresh token"
      });
    }
  }
);
