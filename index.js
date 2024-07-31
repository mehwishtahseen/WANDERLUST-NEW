const express = require("express");
const app = express();
const port = 8080;
const path = require("path");
const mongoose = require("mongoose");
const Listing = require("./models/listing.js");
const methodOverride = require("method-override");
const ejsMate = require("ejs-mate");

main()
  .then((res) => {
    console.log("DATABASE CONNECTED");
  })
  .catch((err) => {
    console.log(err);
  });

async function main() {
  await mongoose.connect("mongodb://127.0.0.1:27017/wanderlust");
}

app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views"));
app.use(express.urlencoded({ extended: true }));
app.use(methodOverride("_method"));
app.engine("ejs", ejsMate);
app.use(express.static(path.join(__dirname, "public")));

app.get("/", async (req, res) => {
  res.send("Systummmmm");
});

app.get("/listings", async (req, res) => {
  let allListings = await Listing.find();
  res.render("./listings/listings.ejs", { allListings });
});

app.get("/listings/new", async (req, res) => {
  res.render("./listings/newlist.ejs");
});

app.get("/listings/:id", async (req, res) => {
  let { id } = req.params;
  let list = await Listing.findById(id);
  res.render("./listings/list.ejs", { list });
});

app.post("/listings", async (req, res) => {
  let newlist = new Listing(req.body.listing);
  console.log(newlist);
  await newlist.save();
  res.redirect("/listings");
});

app.get("/listings/:id/edit", async (req, res) => {
  let { id } = req.params;
  let list = await Listing.findById(id);
  res.render("./listings/update.ejs", { list });
});

app.put("/listings/:id", async (req, res) => {
  let { id } = req.params;
  await Listing.findByIdAndUpdate(id, { ...req.body.listing });
  res.redirect(`/listings/${id}`);
});

app.delete("/listings/:id", async (req, res) => {
  let { id } = req.params;
  await Listing.findByIdAndDelete(id);
  res.redirect("/listings");
});

app.listen(port, () => {
  console.log(`Server is listening on port :- ${port}`);
});

// app.get("/testListing", async (req, res) => {
//   let sampleListing = new Listing({
//     title: "My home",
//     description: "By the beach",
//     price: 12000000,
//     location: "Andaman and Nicobar Islands",
//     country: "India",
//   });

//   await sampleListing.save();
//   console.log("saved");
//   res.send("Sample send");
// });
