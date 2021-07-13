const userRouter = require("express").Router();
const db = require("../database");
const UserController = require("../controller/UsersController");
const authentication = require("../middleware/authentication");
require("dotenv").config();

userRouter.post("/user/register", UserController.userRegister);

userRouter.post("/user/login", UserController.userLogin);

userRouter.patch("/user/deactive",authentication, UserController.userDeactive);

userRouter.patch("/user/activate",authentication, UserController.userActivate);

userRouter.patch("/user/close",authentication, UserController.userClosed);

module.exports = userRouter;
