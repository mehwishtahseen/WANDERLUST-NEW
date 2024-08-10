const Listing = require("../models/listing.js");
const Review = require("../models/review.js");

//1.
module.exports.createReview = async (req, res, next) => {
  let { id } = req.params;
  let listing = await Listing.findById(id);
  let review = new Review(req.body.review);
  review.author = req.user._id;
  listing.reviews.push(review);
  await review.save();
  await listing.save();
  req.flash("success", "New Review Created!");
  res.redirect(`/listings/${listing._id}`);
};

//2.
module.exports.deleteReview = async (req, res, next) => {
  let { id, reviewId } = req.params;
  await Listing.findByIdAndUpdate(id, { $pull: { reviews: reviewId } });
  await Review.findByIdAndDelete(reviewId);
  req.flash("success", "Review Deleted!");
  res.redirect(`/listings/${id}`);
};
