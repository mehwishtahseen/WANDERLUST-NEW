const Listing = require("../models/listing.js"); // Import Listing Model
const Review = require("../models/review.js"); // Import Review Model

//1. Controller for Creating a review by using data sent
module.exports.createReview = async (req, res, next) => {
  let { id } = req.params;
  let listing = await Listing.findById(id);
  let review = new Review(req.body.review); // All details of Review form will be accessed
  review.author = req.user._id; // Assign logged in user as author of the review
  listing.reviews.push(review); // Add the new review to the listing's reviews array
  await review.save();
  await listing.save();
  req.flash("success", "New Review Created!");
  res.redirect(`/listings/${listing._id}`);
};

//2. Controller for Deleting a review by id
module.exports.deleteReview = async (req, res, next) => {
  let { id, reviewId } = req.params;
  await Listing.findByIdAndUpdate(id, { $pull: { reviews: reviewId } }); // Remove the reference to the review from the listing's reviews array
  await Review.findByIdAndDelete(reviewId);
  req.flash("success", "Review Deleted!");
  res.redirect(`/listings/${id}`);
};
