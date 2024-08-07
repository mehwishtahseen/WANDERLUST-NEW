// 1. Import necessary modules and initialize the router
const express = require("express"); // Import Express framework
const router = express.Router(); // Create a new router object
const Listing = require("../models/listing.js"); // Import the Listing model (index.js, 1)
const wrapAsync = require("../utils/wrapAsync.js"); // Wrapper for async functions to catch errors and pass them to the error handler (index.js, 6)
const ExpressError = require("../utils/ExpressError.js"); // Custom error class for handling specific errors (index.js, 7)
const { listingSchema } = require("../schema.js"); // Import schema for validating listings (index.js, 3)

// 2. Middleware to validate listing data
const validateListing = (req, res, next) => {
  let { error } = listingSchema.validate(req.body); // Validate request body against listing schema
  if (error) {
    let errMsg = error.details.map((el) => el.message).join(","); // Extract error messages from validation result
    throw new ExpressError(400, errMsg); // Throw custom error if validation fails (index.js, 7)
  } else {
    next(); // Pass control to the next middleware or route handler
  }
};

// 3. Route handler to display all listings
router.get(
  "/",
  wrapAsync(async (req, res, next) => {
    let allListings = await Listing.find(); // Retrieve all listings from the database
    res.render("./listings/listings.ejs", { allListings }); // Render the listings.ejs view with the listings data
  })
);

// 4. Route handler to display the form to create a new listing
router.get(
  "/new",
  wrapAsync(async (req, res, next) => {
    res.render("./listings/newlist.ejs"); // Render the newlist.ejs view to create a new listing
  })
);

// 5. Route handler to display a specific listing by ID
router.get(
  "/:id",
  wrapAsync(async (req, res, next) => {
    let { id } = req.params; // Extract the ID from the route parameters
    let list = await Listing.findById(id).populate("reviews"); // Find the listing by ID and populate reviews (index.js, 1)
    if (!list) {
      req.flash("failure", "Listing you requested for .. Does not Exists!");
      res.redirect("/listings");
    }
    res.render("./listings/list.ejs", { list }); // Render the list.ejs view with the listing data
  })
);

// 6. Route handler to create a new listing
router.post(
  "/",
  validateListing, // Middleware to validate listing data (this file, 2)
  wrapAsync(async (req, res, next) => {
    let newlist = new Listing(req.body.listing); // Create a new listing from the request body
    await newlist.save(); // Save the new listing to the database
    req.flash("success", "New Listing Created!");
    res.redirect("/listings"); // Redirect to the listings page (index.js, 7)
  })
);

// 7. Route handler to display the form to edit an existing listing
router.get(
  "/:id/edit",
  wrapAsync(async (req, res, next) => {
    let { id } = req.params; // Extract the ID from the route parameters
    let list = await Listing.findById(id); // Find the listing by ID
    if (!list) {
      req.flash("failure", "Listing you requested for .. Does not Exists!");
      res.redirect("/listings");
    }
    res.render("./listings/update.ejs", { list }); // Render the update.ejs view with the listing data
  })
);

// 8. Route handler to update an existing listing
router.put(
  "/:id",
  validateListing, // Middleware to validate listing data (this file, 2)
  wrapAsync(async (req, res, next) => {
    let { id } = req.params; // Extract the ID from the route parameters
    await Listing.findByIdAndUpdate(id, { ...req.body.listing }); // Update the listing in the database with the new data
    req.flash("success", "Listing Updated!");
    res.redirect(`/listings/${id}`); // Redirect to the updated listing page (index.js, 7)
  })
);

// 9. Route handler to delete an existing listing
router.delete(
  "/:id",
  wrapAsync(async (req, res, next) => {
    let { id } = req.params; // Extract the ID from the route parameters
    let deletedList = await Listing.findByIdAndDelete(id); // Delete the listing from the database
    console.log(deletedList);
    req.flash("success", "Listing Deleted!");
    res.redirect("/listings"); // Redirect to the listings page (index.js, 7)
  })
);

module.exports = router; // Export the router to be used in the main application file (index.js, 8)
