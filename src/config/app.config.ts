import { getEnv } from "../utils/get-env";

const appConfig = () =>({
    NODE_ENV: getEnv("NODE_ENV","development"),
    PORT: getEnv("PORT","4000"),
    BASE_PATH: getEnv("BASE_PATH","/api"),
    MONGO_URI: getEnv("MONGO_URI",""),

    // JWT Configuration
    JWT_SECRET: getEnv("JWT_SECRET", "your-jwt-secret-key"),
    JWT_EXPIRES_IN: getEnv("JWT_EXPIRES_IN", "1d"),
    JWT_REFRESH_SECRET: getEnv("JWT_REFRESH_SECRET", "your-refresh-secret-key"),
    JWT_REFRESH_EXPIRES_IN: getEnv("JWT_REFRESH_EXPIRES_IN", "7d"),
    
    // Cookie Configuration
    COOKIE_SECRET: getEnv("COOKIE_SECRET", "your-cookie-secret"),
    COOKIE_DOMAIN: getEnv("COOKIE_DOMAIN", ""), // Leave empty for default behavior
    
    // For OAuth (Google auth) - can be removed if not using
    GOOGLE_CLIENT_ID: getEnv("GOOGLE_CLIENT_ID"),
    GOOGLE_CLIENT_SECRET: getEnv("GOOGLE_CLIENT_SECRET"),
    GOOGLE_CALLBACK_URL: getEnv("GOOGLE_CALLBACK_URL"),

    FRONTEND_ORIGIN: getEnv("FRONTEND_ORIGIN","http://localhost:3000"),
    FRONTEND_GOOGLE_CALLBACK_URL: getEnv("FRONTEND_GOOGLE_CALLBACK_URL","http://localhost:3000/auth/google/callback"),
})

export const config = appConfig();
