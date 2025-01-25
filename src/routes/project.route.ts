import { Router } from "express";
import {
  createProjectController,
  deleteProjectController,
  getAllProjectsInWorkspaceController,
  getProjectAnalyticsController,
  getProjectByIdAndWorkspaceIdController,
  updateProjectController,
} from "../controllers/project.controller";

const projectRouter = Router();

projectRouter.post("/workspace/:workspaceId/create", createProjectController);

projectRouter.put(
  "/:id/workspace/:workspaceId/update",
  updateProjectController
);

projectRouter.delete(
  "/:id/workspace/:workspaceId/delete",
  deleteProjectController
);

projectRouter.get(
  "/workspace/:workspaceId/all",
  getAllProjectsInWorkspaceController
);

projectRouter.get(
  "/:id/workspace/:workspaceId/analytics",
  getProjectAnalyticsController
);

projectRouter.get(
  "/:id/workspace/:workspaceId",
  getProjectByIdAndWorkspaceIdController
);

export default projectRouter;