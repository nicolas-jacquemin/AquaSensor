import { Router } from "express";
import { validationResult, param } from 'express-validator';
import userM from "../../../controllers/auth/models/user.js";
import responseC from '../../../resultConstructor/responseC.js';
import internalError from "../../../resultConstructor/internalError.js";
import badArguments from "../../../resultConstructor/badArguments.js";
import successData from "../../../resultConstructor/successData.js";
import auth from "../../../middlewares/auth/verifyToken.js";
import checkPerm from "../../../middlewares/auth/checkPerm.js";
import permissions from "../../../config/permissions.json" assert {
    type: "json"
};

export const router = Router();

const requestName = "auth.permission.list";

router.get("/permission/:username",
    auth,
    checkPerm("auth.permission.list"),
    param("username").isString(),
    param("username").custom(async value => {
        if (await userM.findOne({ slug: value })) {
            return true;
        }
        return Promise.reject(new Error("User does not exist"));
    }),
    async (req, res) => {
        const result = validationResult(req);
        if (!result.isEmpty()) {
            responseC(res, 400, badArguments(requestName, result.array()));
            return;
        }
        let userData = await userM.findOne({
            slug: req.params!.username
        });
        if (!userData || !userData.permissions) {
            responseC(res, 500, internalError(requestName));
            return;
        }
        // TODO : list all system permissions + assign true/false to each
        responseC(res, 200, successData(requestName, userData.permissions));
    });

export default router;