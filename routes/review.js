const express = require("express");
const router = express.Router({ mergeParams: true });
// mergeParams allows the router to access parameters from its parent routes
// ensuring that route parameters (like listing ID) from the parent route are accessible in this router.
const wrapAsync = require("../utils/wrapAsync.js");
// Required necessary middleware functions
const {
  validateReview,
  isLoggedIn,
  isReviewAuthor,
} = require("../middleware.js");
const reviewController = require("../controllers/reviews.js"); // Controller for Review route handlers

//1. Route for Creating a review by using data sent ...  ref(route 3)in listings.js only if logged in
router.post(
  "/",
  isLoggedIn,
  validateReview,
  wrapAsync(reviewController.createReview)
);

//2. Route for Deleting a review by id and also deleting its refrence in listing collection only by the owner
router.delete(
  "/:reviewId",
  isLoggedIn,
  isReviewAuthor,
  wrapAsync(reviewController.deleteReview)
);

module.exports = router;
