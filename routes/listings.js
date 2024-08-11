const express = require("express");
const router = express.Router();
const wrapAsync = require("../utils/wrapAsync.js");
const { isLoggedIn, validateListing, isOwner } = require("../middleware.js");
const listingController = require("../controllers/listings.js");
const multer = require("multer");
const { storage } = require("../cloudConfig.js");
const upload = multer({ storage });

router
  .route("/")
  //1.  Route for Display All Listings
  .get(wrapAsync(listingController.index))

  //2. Route to create a newlisting using data sent... ref(route 3) only if user is logged in
  .post(
    isLoggedIn,
    upload.single("listing[image]"),
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
