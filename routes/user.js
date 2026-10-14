const express = require("express");
const app = express();
const router = express.Router();
const User = require("../models/user.js");
const passport = require("passport");
const { saveRedirectUrl } = require("../middleware.js");
const userController = require("../controllers/users.js");



router.route("/signup")
.get(userController.renderSignup)
.post( userController.signUp
);


router.route("/login")
.get( userController.renderlogin
).post( 
    saveRedirectUrl,
    passport.authenticate("local", { failureRedirect: '/login', failureFlash: true }), userController.login)
             

// Handle Logout Logic
router.get("/logout", userController.logout);

module.exports = router;
