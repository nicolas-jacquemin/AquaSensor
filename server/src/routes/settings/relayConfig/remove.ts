import { Request, Response } from 'express';
import { validationResult } from 'express-validator';
import relayConfig from '../../../controllers/relays/models/relayConfig.js';
import responseC from '../../../resultConstructor/responseC.js';
import success from '../../../resultConstructor/success.js';
import internalError from "../../../resultConstructor/internalError.js";
import { default as arduino, getUpdatedRelays} from '../../../services/arduinoSerial.service.js';

export default async function (req: Request, res: Response) {
    const errors = validationResult(req);
    if (!errors.isEmpty())
        return responseC(res, 400, errors.array());
    try {
        await relayConfig.deleteOne({
            relayId: req.params.id
        });
        arduino.updateRelayConfig(await getUpdatedRelays());
        return responseC(res, 200, success("settings.relay.remove"));
    } catch (error) {
        return responseC(res, 500, internalError("settings.relay.remove"));
    }
}
