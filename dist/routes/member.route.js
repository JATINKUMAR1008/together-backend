"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const member_controller_1 = require("../controllers/member.controller");
const memberRouter = (0, express_1.Router)();
memberRouter.post("/workspace/:inviteCode/join", member_controller_1.joinWorkspaceController);
exports.default = memberRouter;
