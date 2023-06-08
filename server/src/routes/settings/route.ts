import { Router } from "express";
import relayConfig from "./relayConfig/route.js";
const router = Router();

router.use("/relayConfig", relayConfig);

export default router;