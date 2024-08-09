const express = require("express");
const wrapAsync = require("../utils/wrapAsync");
const router = express.Router();
const User = require("../models/user.js");
const passport = require("passport");

//1. Route to display form for Sign Up
router.get("/signup", (req, res) => {
  res.render("users/signupform.ejs");
});

//2. Route to Register user by data collected from form of ref(route 1)
router.post(
  "/signup",
  wrapAsync(async (req, res, next) => {
    try {
      let { username, email, password } = req.body;
      let newUser = new User({ email, username });

      // `User.register` is a method added by `passport-local-mongoose` for registering a new user with the provided password, which is hashed and stored in the database.

      let rgstuser = await User.register(newUser, password);
      console.log(rgstuser);

      // `req.login` is a Passport method used to establish a login session for the user basically it Automatically login user in the session after sign up using its details

      req.login(rgstuser, (err) => {
        if (err) {
          return next(err);
        }
        req.flash("success", "User was Registered");
        res.redirect("/listings");
      });
    } catch (e) {
      req.flash("error", e.message);
      res.redirect("/signup");
    }
  })
);

//3. Route for Displaying a login form
router.get("/login", (req, res) => {
  res.render("users/loginform.ejs");
});

//4. Route to Login user by data collected from form of ref(route 3)
router.post(
  "/login",

  // `passport.authenticate` is a middleware function used to authenticate users
  // It checks the provided credentials against the specified strategy (e.g., local)
  // basically this middleware automatically autenticates a users login info by checking registered users

  passport.authenticate("local", {
    failureRedirect: "/login",
    failureFlash: true,
  }),
  async (req, res) => {
    req.flash("success", "Login Successfull !!");
    res.redirect("/listings");
  }
);

//5. Route to logout a user
router.get("/logout", (req, res, next) => {
  // `req.logout` is a Passport method that logs the user out of the current session
  req.logOut((err) => {
    if (err) {
      return next(err);
    }
    req.flash("success", "You're Logged out Successfully");
    res.redirect("/listings");
  });
});

module.exports = router;
