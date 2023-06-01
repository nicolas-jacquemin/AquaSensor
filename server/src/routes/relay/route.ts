import responseC from '../../resultConstructor/responseC.js';
import { param, validationResult } from 'express-validator';
import errorCustomMessage from '../../resultConstructor/errorCustomMessage.js';
import badArguments from '../../resultConstructor/badArguments.js';
import { Router } from "express";
import arduino from 'src/controllers/arduinoSerial.js';

const router = Router();

const requestName = "relay.toggle"

router.post("/:relayId/:state",
    param('relayId').notEmpty(),
    param('state').notEmpty(),
    async (req, res) => {
        const result = validationResult(req);
        if (!result.isEmpty()) {
            return responseC(res, 400, badArguments(requestName, result.array()));
        }
        try {
            arduino.relay(req.params!.relayId, req.params!.state);
            return responseC(res, 200, null);
        } catch (error) {
            return responseC(res, 500, errorCustomMessage(requestName, "Arduino Communication Failed", 500));
        }
});

export default router;