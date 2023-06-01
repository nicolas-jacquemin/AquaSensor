import responseC from '../../resultConstructor/responseC.js';
import { param, validationResult } from 'express-validator';
import successData from '../../resultConstructor/successData.js';
import errorCustomMessage from '../../resultConstructor/errorCustomMessage.js';
import badArguments from '../../resultConstructor/badArguments.js';
import { Router } from "express";
import arduino from '../../controllers/arduinoSerial.js';
import { default as checkPerm, hasPerm } from "../../middlewares/auth/checkPerm.js";
import auth from "../../middlewares/auth/verifyToken.js";

const requestName = "relay.list"

const router = Router();

router.get("/",
    auth,
    checkPerm(requestName),
    async (req, res) => {
        responseC(res, 200, successData(requestName, arduino.getRelays()));
});

router.get("/:id",
    auth,
    checkPerm(requestName),
    param("id").isInt({ min: Number(process.env.RELAY_LIST_MIN), max: Number(process.env.RELAY_LIST_MAX) }),
    async (req, res) => {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            responseC(res, 400, badArguments(requestName, errors.array()));
            return;
        }
        responseC(res, 200, successData(requestName, arduino.getRelay(req.params!.id)));
});

export default router;
