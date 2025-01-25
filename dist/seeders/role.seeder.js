"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
require("dotenv/config");
const mongoose_1 = __importDefault(require("mongoose"));
const database_config_1 = __importDefault(require("../config/database.config"));
const roles_permission_model_1 = __importDefault(require("../models/roles-permission.model"));
const role_permission_1 = require("../utils/role-permission");
const seedRoles = async () => {
    console.log("Seeding roles started ...");
    try {
        await (0, database_config_1.default)();
        const mongooseSession = await mongoose_1.default.startSession();
        mongooseSession.startTransaction();
        console.log("Clearing roles collection ...");
        await roles_permission_model_1.default.deleteMany({}, { session: mongooseSession });
        for (const roleName in role_permission_1.RolePermissions) {
            const role = roleName;
            const permissions = role_permission_1.RolePermissions[role];
            const existingRole = await roles_permission_model_1.default.findOne({ name: role }).session(mongooseSession);
            if (!existingRole) {
                console.log(`Creating role ${role} ...`);
                await roles_permission_model_1.default.create([{ name: role, permissions }], {
                    session: mongooseSession,
                });
            }
            else {
                console.log(`Role ${role} already exists ...`);
            }
        }
        await mongooseSession.commitTransaction();
        mongooseSession.endSession();
        console.log("Seeding roles completed ...");
    }
    catch (error) {
        console.error("Seeding roles failed ...", error);
    }
};
seedRoles().catch((error) => console.error("Error while seeding roles: ", error));
