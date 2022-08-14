import express from "express";
import UsersController from "../../controllers/users";
import Authentication from "../../middleware/authentication";

const authneticationReq = new Authentication();
const userController = new UsersController();
const router = express.Router();

router.get('/user/:id',authneticationReq.tokenExistsInRequest,userController.getUserDetailsById)