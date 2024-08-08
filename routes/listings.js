const express = require("express");
const router = express.Router();
const Listing = require("../models/listing.js");
const wrapAsync = require("../utils/wrapAsync.js");
const ExpressError = require("../utils/ExpressError.js");
const { listingSchema } = require("../schema.js");

const validateListing = (req, res, next) => {
  let { error } = listingSchema.validate(req.body);
  if (error) {
    let errMsg = error.details.map((el) => el.message).join(",");
    throw new ExpressError(400, errMsg);
  } else {
    next();
  }
};

router.get(
  "/",
  wrapAsync(async (req, res, next) => {
    let allListings = await Listing.find();
    res.render("./listings/listings.ejs", { allListings });
  })
);

router.get(
  "/new",
  wrapAsync(async (req, res, next) => {
    res.render("./listings/newlist.ejs");
  })
);

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

router.post(
  "/",
  validateListing,
  wrapAsync(async (req, res, next) => {
    let newlist = new Listing(req.body.listing);
    await newlist.save();
    req.flash("success", "New Listing Created!");
    res.redirect("/listings");
  })
);

router.get(
  "/:id/edit",
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

router.put(
  "/:id",
  validateListing,
  wrapAsync(async (req, res, next) => {
    let { id } = req.params;
    await Listing.findByIdAndUpdate(id, { ...req.body.listing });
    req.flash("success", "Listing Updated!");
    res.redirect(`/listings/${id}`);
  })
);

router.delete(
  "/:id",
  wrapAsync(async (req, res, next) => {
    let { id } = req.params;
    let deletedList = await Listing.findByIdAndDelete(id);
    console.log(deletedList);
    req.flash("success", "Listing Deleted!");
    res.redirect("/listings");
  })
);

module.exports = router;
