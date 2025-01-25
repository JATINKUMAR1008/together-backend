"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const passport_1 = __importDefault(require("passport"));
const app_config_1 = require("../config/app.config");
const auth_controller_1 = require("../controllers/auth.controller");
const failedURL = app_config_1.config.FRONTEND_GOOGLE_CALLBACK_URL + "?status=failure";
const authRouter = (0, express_1.Router)();
authRouter.post("/register", auth_controller_1.registerUserController);
authRouter.post("/login", auth_controller_1.loginController);
authRouter.post("/logout", auth_controller_1.logOutController);
authRouter.get("/google", passport_1.default.authenticate("google", {
    scope: ["profile", "email"],
}));
authRouter.get("/google/callback", passport_1.default.authenticate("google", {
    failureRedirect: failedURL,
}), auth_controller_1.googleLoginCallback);
exports.default = authRouter;
