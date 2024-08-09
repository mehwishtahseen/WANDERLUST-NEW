const ExpressError = require("./utils/ExpressError.js");
const { listingSchema, reviewSchema } = require("./schema.js");

//1. Middleware to check if the user is logged in or not
module.exports.isLoggedIn = (req, res, next) => {
  //req.isAuthenticated() is a method provided by Passport that checks if the user is authenticated. It returns true if the user is logged in and false otherwise.

  if (!req.isAuthenticated()) {
    req.flash(
      "error",
      "You must be logged in to Create/Update/Delete a New Listing"
    );
    return res.redirect("/login");
  }
  next();
};

//2. Middleware to check if the data sent for addition or updation of listing by user is valid or not
module.exports.validateListing = (req, res, next) => {
  let { error } = listingSchema.validate(req.body);
  if (error) {
    let errMsg = error.details.map((el) => el.message).join(",");
    throw new ExpressError(400, errMsg);
  } else {
    next();
  }
};

//3. Middleware to check if the data sent for addition of Review by user is valid or not
module.exports.validateReview = (req, res, next) => {
  let { error } = reviewSchema.validate(req.body);
  if (error) {
    let errMsg = error.details.map((el) => el.message).join(",");
    throw new ExpressError(400, errMsg);
  } else {
    next();
  }
};
