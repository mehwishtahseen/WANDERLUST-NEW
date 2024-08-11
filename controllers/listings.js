const Listing = require("../models/listing.js");
const mbxGeocoding = require("@mapbox/mapbox-sdk/services/geocoding");
const mapToken = process.env.MAP_TOKEN;
const geocodingClient = mbxGeocoding({ accessToken: mapToken });

//1.
module.exports.index = async (req, res, next) => {
  let allListings = await Listing.find();
  res.render("./listings/listings.ejs", { allListings });
};

//2.
module.exports.renderNewForm = async (req, res, next) => {
  res.render("./listings/newlist.ejs");
};

//3.
module.exports.showListings = async (req, res, next) => {
  let { id } = req.params;
  //Here as we need full detials of reviews,owners, and also author of reviews, so we populated it
  let list = await Listing.findById(id)
    .populate({
      path: "reviews",
      populate: {
        path: "author",
      },
    })
    .populate("owner");
  if (!list) {
    req.flash("error", "Listing you requested for .. Does not Exists!");
    res.redirect("/listings");
  }
  res.render("./listings/list.ejs", { list });
};

//4.
module.exports.createListing = async (req, res, next) => {
  let cordinate = await geocodingClient
    .forwardGeocode({
      query: req.body.listing.location,
      limit: 1,
    })
    .send();

  let url = req.file.path;
  let filename = req.file.filename;
  let newlist = new Listing(req.body.listing);
  newlist.owner = req.user._id;
  newlist.image = { url, filename };
  newlist.geometry = cordinate.body.features[0].geometry;
  let savedList = await newlist.save();
  console.log(savedList);
  req.flash("success", "New Listing Created!");
  res.redirect("/listings");
};

//5.
module.exports.renderUpdateForm = async (req, res, next) => {
  let { id } = req.params;
  let list = await Listing.findById(id);
  if (!list) {
    req.flash("error", "Listing you requested for .. Does not Exists!");
    res.redirect("/listings");
  }
  let orignalImageUrl = list.image.url;
  orignalImageUrl = orignalImageUrl.replace("/upload", "/upload/w_250");
  res.render("./listings/update.ejs", { list, orignalImageUrl });
};

//6.
module.exports.updateListing = async (req, res, next) => {
  let cordinate = await geocodingClient
    .forwardGeocode({
      query: req.body.listing.location,
      limit: 1,
    })
    .send();

  let { id } = req.params;
  let listing = await Listing.findByIdAndUpdate(id, { ...req.body.listing });
  if (typeof req.file !== "undefined") {
    let url = req.file.path;
    let filename = req.file.filename;
    listing.image = { url, filename };
  }
  listing.geometry = cordinate.body.features[0].geometry;
  await listing.save();
  req.flash("success", "Listing Updated!");
  res.redirect(`/listings/${id}`);
};

//7.
module.exports.deleteListing = async (req, res, next) => {
  let { id } = req.params;
  let deletedList = await Listing.findByIdAndDelete(id);
  console.log(deletedList);
  req.flash("success", "Listing Deleted!");
  res.redirect("/listings");
};
