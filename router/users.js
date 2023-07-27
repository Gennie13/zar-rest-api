const express = require("express");
const {
    createRegisterUser,
    login,
    logOut,
    getUsers,
    getUser,
    updateUser,
    deleteUser,
    postUserForgotPassword,
    postUserResetPassword,
    getUserZaruud
} = require("../controller/useerController");
// const {getUserZaruud} = require("../controller/zarController");
const router = express.Router();
const {protect, authorize} = require("../middleware/protect");


router.route("/login").post(login);
router.route("/logout").get(logOut);
router.route("/register").post(createRegisterUser);
router.route("/forgot-password").post(postUserForgotPassword);
router.route("/reset-password").post(postUserResetPassword);
router.use(protect);
router.route("/").get(authorize("admin") ,getUsers);
router.route("/:id")
                .get(authorize("admin", "user"), getUser)
                .put(authorize("admin", "user"), updateUser)
                .delete(authorize("admin","user"), deleteUser);
// router.route("/:id/categories").get(getUserZaruud);
router.route("/:userId/zaruud").get(getUserZaruud);

module.exports = router;