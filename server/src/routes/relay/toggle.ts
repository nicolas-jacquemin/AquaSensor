import responseC from '../../resultConstructor/responseC.js';
import { param, validationResult } from 'express-validator';
import success from '../../resultConstructor/success.js';
import errorCustomMessage from '../../resultConstructor/errorCustomMessage.js';
import badArguments from '../../resultConstructor/badArguments.js';
import { Router } from "express";
import arduino from '../../services/arduinoSerial.service.js';
import { default as checkPerm, hasPerm } from "../../middlewares/auth/checkPerm.js";
import auth from "../../middlewares/auth/verifyToken.js";

const requestName = "relay.toggle"

const router = Router();

router.post("/:relayId/:state",
    auth,
    checkPerm(requestName),
    param('relayId').notEmpty(),
    param('relayId').isInt( { min: Number(process.env.RELAY_LIST_MIN), max: Number(process.env.RELAY_LIST_MAX) }),
    param('state').notEmpty(),
    param('state').isString(),
    param('state').isIn(["on", "off"]),
    async (req, res) => {
        const result = validationResult(req);
        if (!result.isEmpty()) {
            return responseC(res, 400, badArguments(requestName, result.array()));
        }
        try {
            await arduino.relay(req.params!.relayId, (req.params!.state === "on" ? true : false));
            return responseC(res, 200, success(requestName, 200));
        } catch (error) {
            return responseC(res, 500, errorCustomMessage(requestName, "Arduino Communication Failed", 500));
        }
});

export default router;