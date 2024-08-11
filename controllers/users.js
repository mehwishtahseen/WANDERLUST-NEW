const User = require("../models/user.js"); // Import User Model

//1.
module.exports.renderSignupForm = async (req, res) => {
  res.render("users/signupform.ejs");
};

//2.
module.exports.signUpUser = async (req, res, next) => {
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
};

//3.
module.exports.renderLoginForm = async (req, res) => {
  res.render("users/loginform.ejs");
};

//4.
module.exports.loginUser = async (req, res) => {
  req.flash("success", "Login Successfull !!");
  let redirectUrl = res.locals.redirectUrl || "/listings"; // Redirects the user to the desired page after logging in.
  res.redirect(redirectUrl);
};

//5.
module.exports.logOutUser = async (req, res, next) => {
  // `req.logout` is a Passport method that logs the user out of the current session
  req.logOut((err) => {
    if (err) {
      return next(err);
    }
    req.flash("success", "You're Logged out Successfully");
    res.redirect("/listings");
  });
};
