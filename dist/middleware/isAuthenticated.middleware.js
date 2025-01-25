"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const apiErrors_1 = require("../utils/apiErrors");
const isAuthenticated = (req, res, next) => {
    if (!req.user || !req.user._id) {
        throw new apiErrors_1.UnauthorizedException("Unauthorized. Please log in.");
    }
    next();
};
exports.default = isAuthenticated;
