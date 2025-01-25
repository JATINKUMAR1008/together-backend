"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.roleGuard = void 0;
const apiErrors_1 = require("./apiErrors");
const role_permission_1 = require("./role-permission");
const roleGuard = (role, requiredPermissions) => {
    const permissions = role_permission_1.RolePermissions[role];
    const hasPermission = requiredPermissions.every((permission) => permissions.includes(permission));
    if (!hasPermission) {
        throw new apiErrors_1.UnauthorizedException("You do not have the necessary permissions to perform this action");
    }
};
exports.roleGuard = roleGuard;
