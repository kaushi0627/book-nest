const express = require("express")
const router = express.Router()
const User = require("../models/user.js")
const wrapAsync = require("../utils/wrapAsync.js")
const passport = require("passport")
const { saveRedirected } = require("../middleware.js")

const userController = require("../controller/userController.js")

router
    .route("/signup")
    .get(userController.renderSignupFrom)
    .post( wrapAsync(userController.signup))

router
    .route("/login")
    .get(userController.renderLoginForm)
    .post(saveRedirected, passport.authenticate("local",{failureFlash : true , failureRedirect : "/login"}) ,userController.login)

//logout
router.get("/logout",userController.logout)

module.exports = router;