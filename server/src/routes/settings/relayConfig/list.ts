import { Request, Response } from 'express';
import relayConfig from '../../../controllers/relays/models/relayConfig.js';
import responseC from '../../../resultConstructor/responseC.js';
import successData from '../../../resultConstructor/successData.js';
import internalError from "../../../resultConstructor/internalError.js";

export default async function (req: Request, res: Response) {
    try {
        const relayConfigs = await relayConfig.find();
        return responseC(res, 200, successData("settings.relay.get", relayConfigs));
    } catch (error) {
        return responseC(res, 500, internalError("settings.relay.get"));
    }
}
