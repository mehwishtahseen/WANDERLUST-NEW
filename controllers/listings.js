const Listing = require("../models/listing.js"); // Import the Listing model
const mbxGeocoding = require("@mapbox/mapbox-sdk/services/geocoding"); // Import the Mapbox geocoding service
const mapToken = process.env.MAP_TOKEN; // Access the Mapbox API token from environment variables
const geocodingClient = mbxGeocoding({ accessToken: mapToken }); // Initialize the geocoding client with the API token
// Basically it creates a geocoding client configured with your API token,
// allowing you to interact with the Mapbox Geocoding API for converting addresses into coordinates.

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
  // If the listing is not found, flash an error message and redirect
  if (!list) {
    req.flash("error", "Listing you requested for .. Does not Exists!");
    res.redirect("/listings");
  }
  res.render("./listings/list.ejs", { list });
};

//4.
module.exports.createListing = async (req, res, next) => {
  // Generating Coordinates for the location entered by user
  let cordinate = await geocodingClient
    .forwardGeocode({
      query: req.body.listing.location,
      limit: 1,
    })
    .send();

  let url = req.file.path; // Get the image URL from Cloudinary
  let filename = req.file.filename; // Get the image filename from Cloudinary
  let newlist = new Listing(req.body.listing); // All details of listing form will be accessed
  newlist.owner = req.user._id; // Assign the currently logged-in user as the owner
  newlist.image = { url, filename }; // Attach the image URL and filename to the listing
  newlist.geometry = cordinate.body.features[0].geometry; // Saving the location cordinates in listing
  let savedList = await newlist.save();
  console.log(savedList);
  req.flash("success", "New Listing Created!");
  res.redirect("/listings");
};

//5.
module.exports.renderUpdateForm = async (req, res, next) => {
  let { id } = req.params;
  let list = await Listing.findById(id);
  // Render form only if listing exists
  if (!list) {
    req.flash("error", "Listing you requested for .. Does not Exists!");
    res.redirect("/listings");
  }
  let orignalImageUrl = list.image.url;
  orignalImageUrl = orignalImageUrl.replace("/upload", "/upload/w_250"); // Adjust the URL to resize the image for Preview
  res.render("./listings/update.ejs", { list, orignalImageUrl });
};

//6.
module.exports.updateListing = async (req, res, next) => {
  // Generating new Coordinates for the updated location entered by user
  let cordinate = await geocodingClient
    .forwardGeocode({
      query: req.body.listing.location,
      limit: 1,
    })
    .send();

  let { id } = req.params;
  let listing = await Listing.findByIdAndUpdate(id, { ...req.body.listing });
  // If someone has not updated the image in form, we do not want to save its path and name
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

//8.
module.exports.showCategories = async (req, res, next) => {
  let { category } = req.params;
  let allListings = await Listing.find({ category: category });
  res.render("./listings/listings.ejs", { allListings });
};
