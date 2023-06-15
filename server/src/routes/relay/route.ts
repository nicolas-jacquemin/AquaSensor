import { Router } from "express";
import toggle from "./toggle.js"
import list from "./list.js"

const router = Router();

router.use(toggle);
router.use(list);

export default router;