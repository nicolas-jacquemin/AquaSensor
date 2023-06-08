import express from 'express';
import Register from './register.js';
import Login from './login.js';
import Update from './update.js';
import Infos from './info.js';
import destroyTokenFamily from './destroyTokenFamily.js';
import listPermissions from './permission/listPermissions.js';
import addPermission from './permission/addPermission.js';
import removePermission from './permission/removePermission.js';
import renewToken from './renewToken.js';

const router = express.Router();

router.use(Register);
router.use(Login);
router.use(Update);
router.use(Infos);
router.use(destroyTokenFamily);
router.use(listPermissions);
router.use(addPermission);
router.use(removePermission);
router.use(renewToken);

export default router;