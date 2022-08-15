import express from "express";
import UsersController from "../../controllers/users/index.js";
import Authentication from "../../middleware/authentication.js";

const authenticationReq = new Authentication();
const userController = new UsersController();
const router = express.Router();

router.get('/user/:userId',
    userController.getUserDetailsById);

export default router;