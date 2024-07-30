const express = require("express");
const app = express();
const port = 8080;
const path = require("path");
const mongoose = require("mongoose");
const Listing = require("./models/listing.js");

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

app.set("view engnie", "ejs");

app.get("/", (req, res) => {
  res.send("Hi! I am groot");
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

app.listen(port, () => {
  console.log(`Server is listening on port :- ${port}`);
});
