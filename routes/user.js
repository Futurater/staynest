const express = require("express");
const router = express.Router();
const wrapAsync = require("../utils/wrapAsync.js");
const passport = require("passport");
const userController = require("../controllers/user.js");

router.route("/signup")
    .get((req, res) => {
        res.render("users/signup.ejs")
    })
    .post(wrapAsync(userController.postSignup));


router.get("/login", (req, res) => {
    res.render("users/login.ejs");
}
)
router.post("/login", passport.authenticate("local",
    {
        failureRedirect: '/login',
        failureFlash: true
    })
    , userController.postLogin);

router.get("/logout", userController.logout)

module.exports = router; 
