// 1. Import necessary modules and initialize the app
const express = require("express");
const app = express();
const port = 8080;
const path = require("path");
const mongoose = require("mongoose");
const Listing = require("./models/listing.js"); // Import the Listing model
const methodOverride = require("method-override"); // Middleware to use HTTP verbs such as PUT or DELETE
const ejsMate = require("ejs-mate"); // Layouts and partials for EJS templates
const wrapAsync = require("./utils/wrapAsync.js"); // Wrapper for async functions to catch errors
const ExpressError = require("./utils/ExpressError.js"); // Custom error class
const { listingSchema } = require("./schema.js"); // Import listing schema for validation

// 2. Connect to the MongoDB database
main()
  .then((res) => {
    console.log("DATABASE CONNECTED");
  })
  .catch((err) => {
    console.log(err); // Log any errors that occur during the connection attempt (ref: 16)
  });

async function main() {
  await mongoose.connect("mongodb://127.0.0.1:27017/wanderlust"); // Connect to the MongoDB database
}

// 3. Set up the view engine and views directory
app.set("view engine", "ejs"); // Set EJS as the view engine
app.set("views", path.join(__dirname, "views")); // Set the directory for views

// 4. Middleware to parse URL-encoded data and override HTTP methods
app.use(express.urlencoded({ extended: true })); // Parse URL-encoded bodies
app.use(methodOverride("_method")); // Override HTTP methods

// 5. Set up EJS Mate for layout support
app.engine("ejs", ejsMate); // Use ejs-mate for all .ejs files

// 6. Serve static files from the "public" directory
app.use(express.static(path.join(__dirname, "public"))); // Serve static files

// 7. Root route handler
app.get("/", async (req, res, next) => {
  // ref: 16
  res.send("Systummmmm"); // Send a response with the text "Systummmmm"
});

const validateListing = (req, res, next) => {
  let { error } = listingSchema.validate(req.body); // Validate request body against schema
  if (error) {
    let errMsg = error.details.map((el) => el.message).join(","); // Extract error messages
    throw new ExpressError(400, errMsg); // Throw custom error if validation fails
  } else {
    next(); // Pass control to the next middleware or route handler
  }
};

// 8. Route handler to display all listings
app.get(
  "/listings",
  wrapAsync(async (req, res, next) => {
    // ref: 16
    let allListings = await Listing.find(); // Retrieve all listings from the database
    res.render("./listings/listings.ejs", { allListings }); // Render the listings.ejs view with the listings data
  })
);

// 9. Route handler to display the form to create a new listing
app.get(
  "/listings/new",
  wrapAsync(async (req, res, next) => {
    // ref: 16
    res.render("./listings/newlist.ejs"); // Render the newlist.ejs view
  })
);

// 10. Route handler to display a specific listing by ID
app.get(
  "/listings/:id",
  wrapAsync(async (req, res, next) => {
    // ref: 16
    let { id } = req.params; // Extract the ID from the route parameters
    let list = await Listing.findById(id); // Find the listing by ID
    res.render("./listings/list.ejs", { list }); // Render the list.ejs view with the listing data
  })
);

// 11. Route handler to create a new listing
app.post(
  "/listings",
  validateListing, // Middleware to validate listing data
  wrapAsync(async (req, res, next) => {
    let newlist = new Listing(req.body.listing); // Create a new listing from the request body
    console.log(newlist);
    await newlist.save(); // Save the new listing to the database
    res.redirect("/listings"); // Redirect to the listings page
  })
);

// 12. Route handler to display the form to edit an existing listing
app.get(
  "/listings/:id/edit",
  wrapAsync(async (req, res, next) => {
    // ref: 16
    let { id } = req.params; // Extract the ID from the route parameters
    let list = await Listing.findById(id); // Find the listing by ID
    res.render("./listings/update.ejs", { list }); // Render the update.ejs view with the listing data
  })
);

// 13. Route handler to update an existing listing
app.put(
  "/listings/:id",
  validateListing, // Middleware to validate listing data
  wrapAsync(async (req, res, next) => {
    // ref: 16
    let { id } = req.params; // Extract the ID from the route parameters
    await Listing.findByIdAndUpdate(id, {
      ...req.body.listing,
    }); // Update the listing in the database
    res.redirect(`/listings/${id}`); // Redirect to the updated listing page
  })
);

// 14. Route handler to delete an existing listing
app.delete(
  "/listings/:id",
  wrapAsync(async (req, res, next) => {
    // ref: 16
    let { id } = req.params; // Extract the ID from the route parameters
    let deletedList = await Listing.findByIdAndDelete(id); // Delete the listing from the database
    console.log(deletedList);
    res.redirect("/listings"); // Redirect to the listings page
  })
);

// 15. Catch-all route handler for undefined routes
app.all("*", (req, res, next) => {
  next(new ExpressError(404, "Page Not Found")); // ref: 16
});

// 16. Error-handling middleware to handle any errors that occur in the app
app.use((err, req, res, next) => {
  // ref: 2, 7, 8, 9, 10, 11, 12, 13, 14, 15
  let { status = 500, message = "Something Went Wrong" } = err;
  res.render("./listings/error.ejs", { err }); // Send a generic error response
});

// 17. Start the server and listen on the specified port
app.listen(port, () => {
  console.log(`Server is listening on port :- ${port}`); // Log a message indicating that the server is running
});
