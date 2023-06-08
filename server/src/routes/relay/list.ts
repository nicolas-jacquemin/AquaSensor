import responseC from '../../resultConstructor/responseC.js';
import { param, validationResult } from 'express-validator';
import successData from '../../resultConstructor/successData.js';
import errorCustomMessage from '../../resultConstructor/errorCustomMessage.js';
import badArguments from '../../resultConstructor/badArguments.js';
import { Router } from "express";
import arduino from '../../services/arduinoSerial.service.js';
import { default as checkPerm, hasPerm } from "../../middlewares/auth/checkPerm.js";
import auth from "../../middlewares/auth/verifyToken.js";
import relayConfig from '../../controllers/relays/models/relayConfig.js';

const requestName = "relay.list"

const router = Router();

router.get("/",
    auth,
    checkPerm(requestName),
    async (req, res) => {
        let relays = await relayConfig.find({}, { _id: 0, __v: 0  });
        for (let i = 0; i < relays.length; i++) {
            (relays[i] as any).state = arduino.getRelay(relays[i].id);
        }
        responseC(res, 200, successData(requestName, relays));
});

router.get("/:id",
    auth,
    checkPerm(requestName),
    param("id").isInt(),
    async (req, res) => {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            responseC(res, 400, badArguments(requestName, errors.array()));
            return;
        }
        let relay = await relayConfig.findOne({ id: req.params!.id }, { _id: 0, __v: 0  });if (!relay) {
            responseC(res, 404, errorCustomMessage(requestName, "Relay not found", 404));
            return;
        }
        (relay as any).state = arduino.getRelay(req.params!.id);
        responseC(res, 200, successData(requestName, relay));
});

export default router;
