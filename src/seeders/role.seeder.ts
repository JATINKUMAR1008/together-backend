import "dotenv/config";
import mongoose from "mongoose";
import connectDatabase from "../config/database.config";
import RoleModel from "../models/roles-permission.model";
import { RolePermissions } from "../utils/role-permission";

const seedRoles = async () => {
  console.log("Seeding roles started ...");
  try {
    await connectDatabase();
    const mongooseSession = await mongoose.startSession();
    mongooseSession.startTransaction();
    console.log("Clearing roles collection ...");
    await RoleModel.deleteMany({}, { session: mongooseSession });

    for (const roleName in RolePermissions) {
      const role = roleName as keyof typeof RolePermissions;
      const permissions = RolePermissions[role];

      const existingRole = await RoleModel.findOne({ name: role }).session(
        mongooseSession
      );
      if (!existingRole) {
        console.log(`Creating role ${role} ...`);
        await RoleModel.create([{ name: role, permissions }], {
          session: mongooseSession,
        });
      } else {
        console.log(`Role ${role} already exists ...`);
      }
    }

    await mongooseSession.commitTransaction();
    mongooseSession.endSession();
    console.log("Seeding roles completed ...");
  } catch (error) {
    console.error("Seeding roles failed ...", error);
  }
};

seedRoles().catch((error) =>
  console.error("Error while seeding roles: ", error)
);
