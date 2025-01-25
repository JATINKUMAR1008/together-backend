import { Router } from "express";
import {
  createTaskController,
  deleteTaskController,
  getAllTasksController,
  getTaskByIdController,
  updateTaskController,
} from "../controllers/task.controller";

const taskRouter = Router();

taskRouter.post(
  "/project/:projectId/workspace/:workspaceId/create",
  createTaskController
);

taskRouter.delete("/:id/workspace/:workspaceId/delete", deleteTaskController);

taskRouter.put(
  "/:id/project/:projectId/workspace/:workspaceId/update",
  updateTaskController
);

taskRouter.get("/workspace/:workspaceId/all", getAllTasksController);

taskRouter.get(
  "/:id/project/:projectId/workspace/:workspaceId",
  getTaskByIdController
);

export default taskRouter;
