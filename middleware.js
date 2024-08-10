const ExpressError = require("./utils/ExpressError.js");
const { listingSchema, reviewSchema } = require("./schema.js");
const Listing = require("./models/listing.js");
const Review = require("./models/review.js");

//1. Middleware to check if the user is logged in or not
module.exports.isLoggedIn = (req, res, next) => {
  //req.isAuthenticated() is a method provided by Passport that checks if the user is authenticated. It returns true if the user is logged in and false otherwise.

  if (!req.isAuthenticated()) {
    req.session.redirectUrl = req.originalUrl; // to get the url where user desires to go
    req.flash(
      "error",
      "You must be logged in to Create/Update/Delete a New Listing"
    );
    return res.redirect("/login");
  }
  next();
};

//2. Middleware to save the redirect URL in response locals so that it can be used after login
module.exports.saveRedirectUrl = (req, res, next) => {
  if (req.session.redirectUrl) {
    res.locals.redirectUrl = req.session.redirectUrl;
  }
  next();
};

//3. Middleware to check if the data sent for addition or updation of listing by user is valid or not
module.exports.validateListing = (req, res, next) => {
  let { error } = listingSchema.validate(req.body);
  if (error) {
    let errMsg = error.details.map((el) => el.message).join(",");
    throw new ExpressError(400, errMsg);
  } else {
    next();
  }
};

//4. Middleware to check if the data sent for addition of Review by user is valid or not
module.exports.validateReview = (req, res, next) => {
  let { error } = reviewSchema.validate(req.body);
  if (error) {
    let errMsg = error.details.map((el) => el.message).join(",");
    throw new ExpressError(400, errMsg);
  } else {
    next();
  }
};

// 5. Middleware for authorizing the owner of a listing
module.exports.isOwner = async (req, res, next) => {
  let { id } = req.params;
  let listing = await Listing.findById(id);
  if (!res.locals.currUser._id.equals(listing.owner._id)) {
    req.flash("error", "You are not the Owner of this Listing");
    return res.redirect(`/listings/${id}`);
  } else {
    next();
  }
};

// 6. Middleware for authorizing the author of a review
module.exports.isReviewAuthor = async (req, res, next) => {
  let { id, reviewId } = req.params;
  let review = await Review.findById(reviewId);
  if (!res.locals.currUser._id.equals(review.author._id)) {
    req.flash("error", "You are not the Author of this Review");
    return res.redirect(`/listings/${id}`);
  } else {
    next();
  }
};
