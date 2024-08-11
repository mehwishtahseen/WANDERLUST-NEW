const express = require("express");
const wrapAsync = require("../utils/wrapAsync");
const router = express.Router();
const passport = require("passport"); // Import Passport, a middleware for authentication in Node.js applications.
const { saveRedirectUrl } = require("../middleware.js"); // Required necessary middleware functions
const userController = require("../controllers/users.js"); // Controller for User route handlers

router
  .route("/signup")
  //1. Route to display form for Sign Up
  .get(wrapAsync(userController.renderSignupForm))

  //2. Route to Register user by data sent ref(route 1)
  .post(wrapAsync(userController.signUpUser));

router
  .route("/login")
  //3. Route for Displaying a login form
  .get(wrapAsync(userController.renderLoginForm))

  //4. Route to Login user by data sent ref (route 3)
  .post(
    saveRedirectUrl,
    // `passport.authenticate` is a middleware function used to authenticate users
    // It checks the provided credentials against the specified strategy (e.g., local)
    // basically this middleware automatically autenticates a users login info by checking registered users
    passport.authenticate("local", {
      failureRedirect: "/login",
      failureFlash: true,
    }),
    wrapAsync(userController.loginUser)
  );

//5. Route to logout a user
router.get("/logout", wrapAsync(userController.logOutUser));

module.exports = router;
