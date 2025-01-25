import { Router } from "express";
import { changeWorkspaceMemberRoleController, createWorkspaceController, deleteWorkspaceByIdController, getAllWorkspacesUserIsMemberController, getWorkspaceAnalyticsController, getWorkspaceByIdController, getWorkspaceMembersController, updateWorkspaceByIdController } from "../controllers/workspace.controller";

const workspaceRouter = Router()

workspaceRouter.post("/create/new",createWorkspaceController)

workspaceRouter.put("/update/:id", updateWorkspaceByIdController);

workspaceRouter.put(
  "/change/member/role/:id",
  changeWorkspaceMemberRoleController
);

workspaceRouter.delete("/delete/:id", deleteWorkspaceByIdController);

workspaceRouter.get("/all", getAllWorkspacesUserIsMemberController);

workspaceRouter.get("/members/:id", getWorkspaceMembersController);
workspaceRouter.get("/analytics/:id", getWorkspaceAnalyticsController);

workspaceRouter.get("/:id", getWorkspaceByIdController);

export default workspaceRouter