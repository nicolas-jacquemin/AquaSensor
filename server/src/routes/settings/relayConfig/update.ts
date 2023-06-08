import { Request, Response } from 'express';
import { validationResult } from 'express-validator';
import relayConfig from '../../../controllers/relays/models/relayConfig.js';
import responseC from '../../../resultConstructor/responseC.js';
import successData from '../../../resultConstructor/successData.js';
import internalError from "../../../resultConstructor/internalError.js";
import { default as arduino, getUpdatedRelays} from '../../../services/arduinoSerial.service.js';

export default async function (req: Request, res: Response) {
    const errors = validationResult(req);
    if (!errors.isEmpty())
        return responseC(res, 400, errors.array());
    try {
        await relayConfig.updateOne({
            relayId: req.params.id
        }, {
            name: req.body.name,
            normallyOpen: req.body.normallyOpen
        });
        const relayConfigs = await relayConfig.findOne({ relayId: req.params.id });
        if (!relayConfigs)
            return responseC(res, 500, internalError("settings.relay.create"));
        else
            responseC(res, 200, successData("settings.relay.create", relayConfigs));
         arduino.updateRelayConfig(await getUpdatedRelays());
    } catch (error) {
        return responseC(res, 500, internalError("settings.relay.update"));
    }
}
