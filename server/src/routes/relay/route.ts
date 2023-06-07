import responseC from '../../resultConstructor/responseC.js';
import { param, validationResult } from 'express-validator';
import success from '../../resultConstructor/success.js';
import errorCustomMessage from '../../resultConstructor/errorCustomMessage.js';
import badArguments from '../../resultConstructor/badArguments.js';
import { Router } from "express";
import toggle from "./toggle.js"
import list from "./list.js"

const router = Router();

router.use(toggle);
router.use(list);

export default router;