import { Router } from "express";
import list from "./list.js";
import update from "./update.js";
import create from "./create.js";
import remove from "./remove.js";
import { param, body, validationResult } from "express-validator";
import auth from "../../../middlewares/auth/verifyToken.js";
import checkPerm from "../../../middlewares/auth/checkPerm.js";
const router = Router();

router.get("/", auth, checkPerm("settings.relay.get"), list);
router.post("/", auth, checkPerm("settings.relay.create"), 
    body("id").notEmpty(),
    body("id").isInt(),
    body("name").notEmpty(),
    body("name").isString(),
    body("normallyOpen").notEmpty(),
    body("normallyOpen").isBoolean(),
 create);
router.put("/:id", auth, checkPerm("settings.relay.update"),
    param("id").notEmpty(),
    param("id").isInt(),
 update);
router.delete("/:id", auth, checkPerm("settings.relay.remove"),
    param("id").notEmpty(),
    param("id").isInt(),
 remove);

export default router;