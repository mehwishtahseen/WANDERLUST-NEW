// 1. Import necessary modules and initialize the router
const express = require("express"); // Import Express framework
const router = express.Router({ mergeParams: true }); // Create a new router object with merged parameters
const Listing = require("../models/listing.js"); // Import the Listing model (index.js, 1)
const Review = require("../models/review.js"); // Import the Review model (index.js, 1)
const wrapAsync = require("../utils/wrapAsync.js"); // Wrapper for async functions to catch errors and pass them to the error handler (index.js, 6)
const ExpressError = require("../utils/ExpressError.js"); // Custom error class for handling specific errors (index.js, 7)
const { reviewSchema } = require("../schema.js"); // Import schema for validating reviews (index.js, 3)

// 2. Middleware to validate review data
const validateReview = (req, res, next) => {
  let { error } = reviewSchema.validate(req.body); // Validate request body against review schema
  if (error) {
    let errMsg = error.details.map((el) => el.message).join(","); // Extract error messages from validation result
    throw new ExpressError(400, errMsg); // Throw custom error if validation fails (index.js, 7)
  } else {
    next(); // Pass control to the next middleware or route handler
  }
};

// 3. Route handler to create a new review for a listing
router.post(
  "/",
  validateReview, // Middleware to validate review data (this file, 2)
  wrapAsync(async (req, res, next) => {
    let { id } = req.params; // Extract the listing ID from the route parameters
    let listing = await Listing.findById(id); // Find the listing by ID (listings.js, 5)
    let review = new Review(req.body.review); // Create a new review from the request body (index.js, 1)
    listing.reviews.push(review); // Add the review to the listing's reviews array
    await review.save(); // Save the new review to the database
    await listing.save(); // Save the updated listing to the database
    res.redirect(`/listings/${listing._id}`); // Redirect to the listing page (listings.js, 9)
  })
);

// 4. Route handler to delete a review from a listing
router.delete(
  "/:reviewId",
  wrapAsync(async (req, res, next) => {
    let { id, reviewId } = req.params; // Extract the listing and review IDs from the route parameters
    await Listing.findByIdAndUpdate(id, { $pull: { reviews: reviewId } }); // Remove the review ID from the listing's reviews array (listings.js, 13)
    await Review.findByIdAndDelete(reviewId); // Delete the review from the database (index.js, 1)
    res.redirect(`/listings/${id}`); // Redirect to the listing page (listings.js, 9)
  })
);

module.exports = router; // Export the router to be used in the main application file (index.js, 8)
