const express = require("express");
const router = express.Router();
const Listing = require("../models/listing.js");
const wrapAsync = require("../utils/wrapAsync.js");
const { isLoggedIn, validateListing } = require("../middleware.js");

//1.  Route for Display All Listings
router.get(
  "/",
  wrapAsync(async (req, res, next) => {
    let allListings = await Listing.find();
    res.render("./listings/listings.ejs", { allListings });
  })
);

//2. Route for Display form for a new Listing
router.get(
  "/new",
  isLoggedIn,
  wrapAsync(async (req, res, next) => {
    res.render("./listings/newlist.ejs");
  })
);

//3. Route for Display individual listing (by id)
router.get(
  "/:id",
  wrapAsync(async (req, res, next) => {
    let { id } = req.params;
    let list = await Listing.findById(id).populate("reviews");
    if (!list) {
      req.flash("error", "Listing you requested for .. Does not Exists!");
      res.redirect("/listings");
    }
    res.render("./listings/list.ejs", { list });
  })
);

//4. Route to create a newlisting using data from form of ref(route 2)
router.post(
  "/",
  isLoggedIn,
  validateListing,
  wrapAsync(async (req, res, next) => {
    let newlist = new Listing(req.body.listing);
    await newlist.save();
    req.flash("success", "New Listing Created!");
    res.redirect("/listings");
  })
);

//5. Route to generate a form to update a listing
router.get(
  "/:id/edit",
  isLoggedIn,
  wrapAsync(async (req, res, next) => {
    let { id } = req.params;
    let list = await Listing.findById(id);
    if (!list) {
      req.flash("error", "Listing you requested for .. Does not Exists!");
      res.redirect("/listings");
    }
    res.render("./listings/update.ejs", { list });
  })
);

//6. Route to update a newlisting using data from form of ref(route 5)
router.put(
  "/:id",
  isLoggedIn,
  validateListing,
  wrapAsync(async (req, res, next) => {
    let { id } = req.params;
    await Listing.findByIdAndUpdate(id, { ...req.body.listing });
    req.flash("success", "Listing Updated!");
    res.redirect(`/listings/${id}`);
  })
);

//7. Route to delete a particular listing
router.delete(
  "/:id",
  isLoggedIn,
  wrapAsync(async (req, res, next) => {
    let { id } = req.params;
    let deletedList = await Listing.findByIdAndDelete(id);
    console.log(deletedList);
    req.flash("success", "Listing Deleted!");
    res.redirect("/listings");
  })
);

module.exports = router;
