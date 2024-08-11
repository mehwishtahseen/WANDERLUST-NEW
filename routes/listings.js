const express = require("express");
const router = express.Router(); // Router for managing routes in Express
const wrapAsync = require("../utils/wrapAsync.js"); // Utility function to manage async errors
const { isLoggedIn, validateListing, isOwner } = require("../middleware.js"); // Required necessary middleware functions
const listingController = require("../controllers/listings.js"); // Controller for listing route handlers
const multer = require("multer"); // Multer middleware middleware for handling multipart/form-data and file uploads
const { storage } = require("../cloudConfig.js"); // Cloudinary configuration
// The storage object contains settings like the Cloudinary account credentials,
// folder names, file naming conventions, and any transformations
// that should be applied to the images during upload.
const upload = multer({ storage }); // Multer setup for uploading files to Cloudinary

router
  .route("/")
  //1. Route for Display All Listings
  .get(wrapAsync(listingController.index))

  //2. Route to create a newlisting using data sent... ref(route 3) only if user is logged in
  .post(
    isLoggedIn,
    upload.single("listing[image]"), // Upload a single file to Cloudinary
    validateListing,
    wrapAsync(listingController.createListing)
  );

//3. Route for Display form for a new Listing if user is logged in
router.get("/new", isLoggedIn, wrapAsync(listingController.renderNewForm));

router
  .route("/:id")
  //4. Route for Display individual listing (by id)
  .get(wrapAsync(listingController.showListings))

  //5. Route to update a listing using data sent in request ref(route 7) only if user is logged in and owner of the listing
  .put(
    isLoggedIn,
    isOwner,
    upload.single("listing[image]"),
    validateListing,
    wrapAsync(listingController.updateListing)
  )

  //6. Route to delete a particular listing  only if user is logged in and owner of the listing
  .delete(isLoggedIn, isOwner, wrapAsync(listingController.deleteListing));

//7. Route to generate a form to update a listing only if user is logged in and owner of it
router.get(
  "/:id/edit",
  isLoggedIn,
  isOwner,
  wrapAsync(listingController.renderUpdateForm)
);

module.exports = router;
