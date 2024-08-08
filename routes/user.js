const express = require("express");
const wrapAsync = require("../utils/wrapAsync");
const router = express.Router();
const User = require("../models/user.js");
const passport = require("passport");

router.get("/signup", (req, res) => {
  res.render("users/signupform.ejs");
});

router.post(
  "/signup",
  wrapAsync(async (req, res, next) => {
    try {
      let { username, email, password } = req.body;
      let newUser = new User({ email, username });
      let rgstuser = await User.register(newUser, password);
      console.log(rgstuser);
      req.flash("success", "User was Registered");
      res.redirect("/listings");
    } catch (e) {
      req.flash("failure", e.message);
      res.redirect("/signup");
    }
  })
);

router.get("/login", (req, res) => {
  res.render("users/loginform.ejs");
});

router.post(
  "/login",
  passport.authenticate("local", {
    failureRedirect: "/login",
    failureFlash: true,
  }),
  async (req, res) => {
    res.send("Welcoem");
  }
);

module.exports = router;
