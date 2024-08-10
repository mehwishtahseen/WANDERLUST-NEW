const Listing = require("../models/listing.js");

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
  let url = req.file.path;
  let filename = req.file.filename;
  let newlist = new Listing(req.body.listing);
  newlist.owner = req.user._id;
  newlist.image = { url, filename };
  await newlist.save();
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
  res.render("./listings/update.ejs", { list });
};

//6.
module.exports.updateListing = async (req, res, next) => {
  let { id } = req.params;
  await Listing.findByIdAndUpdate(id, { ...req.body.listing });
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
