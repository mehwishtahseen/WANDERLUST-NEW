// 1. Import necessary modules and initialize the app
const express = require("express"); // Import Express framework
const app = express(); // Create an instance of the Express application
const port = 8080; // Define the port number for the server
const path = require("path"); // Import path module for working with file and directory paths
const mongoose = require("mongoose"); // Import Mongoose for MongoDB object modeling
const Listing = require("./models/listing.js"); // Import the Listing model (ref: 8, 9, 10, 11, 12, 13, 14, 17)
const methodOverride = require("method-override"); // Middleware to use HTTP verbs such as PUT or DELETE in places where the client doesn't support it
const ejsMate = require("ejs-mate"); // Layouts and partials for EJS templates
const wrapAsync = require("./utils/wrapAsync.js"); // Wrapper for async functions to catch errors and pass them to the error handler (ref: 8, 9, 10, 11, 12, 13, 14, 17, 18)
const ExpressError = require("./utils/ExpressError.js"); // Custom error class for handling specific errors (ref: 8, 9, 10, 11, 12, 13, 14, 15, 19)
const { listingSchema, reviewSchema } = require("./schema.js"); // Import schemas for validating listings and reviews (ref: 8, 9, 10, 11, 12, 13, 14, 17)
const Review = require("./models/review.js"); // Import the Review model (ref: 17, 18)

// 2. Connect to the MongoDB database
main()
  .then((res) => {
    console.log("DATABASE CONNECTED"); // Log a success message if the database connection is successful
  })
  .catch((err) => {
    console.log(err); // Log any errors that occur during the connection attempt
  });

async function main() {
  await mongoose.connect("mongodb://127.0.0.1:27017/wanderlust"); // Connect to the MongoDB database
}

// 3. Set up the view engine and views directory
app.set("view engine", "ejs"); // Set EJS as the view engine
app.set("views", path.join(__dirname, "views")); // Set the directory for EJS views

// 4. Middleware to parse URL-encoded data and override HTTP methods
app.use(express.urlencoded({ extended: true })); // Parse URL-encoded bodies (form data)
app.use(methodOverride("_method")); // Override HTTP methods with query parameter "_method"

// 5. Set up EJS Mate for layout support
app.engine("ejs", ejsMate); // Use ejs-mate for all .ejs files

// 6. Serve static files from the "public" directory
app.use(express.static(path.join(__dirname, "public"))); // Serve static files (CSS, JavaScript, images) from the "public" directory

// 7. Root route handler
app.get("/", async (req, res, next) => {
  res.send("Systummmmm"); // Send a response with the text "Systummmmm" for the root route
});

// 8. Middleware to validate listing data
const validateListing = (req, res, next) => {
  let { error } = listingSchema.validate(req.body); // Validate request body against listing schema (ref: 11, 13)
  if (error) {
    let errMsg = error.details.map((el) => el.message).join(","); // Extract error messages from validation result
    throw new ExpressError(400, errMsg); // Throw custom error if validation fails
  } else {
    next(); // Pass control to the next middleware or route handler
  }
};

// 9. Middleware to validate review data
const validateReview = (req, res, next) => {
  let { error } = reviewSchema.validate(req.body); // Validate request body against review schema (ref: 17)
  if (error) {
    let errMsg = error.details.map((el) => el.message).join(","); // Extract error messages from validation result
    throw new ExpressError(400, errMsg); // Throw custom error if validation fails
  } else {
    next(); // Pass control to the next middleware or route handler
  }
};

// 10. Route handler to display all listings
app.get(
  "/listings",
  wrapAsync(async (req, res, next) => {
    let allListings = await Listing.find(); // Retrieve all listings from the database
    res.render("./listings/listings.ejs", { allListings }); // Render the listings.ejs view with the listings data
  })
);

// 11. Route handler to display the form to create a new listing
app.get(
  "/listings/new",
  wrapAsync(async (req, res, next) => {
    res.render("./listings/newlist.ejs"); // Render the newlist.ejs view to create a new listing
  })
);

// 12. Route handler to display a specific listing by ID
app.get(
  "/listings/:id",
  wrapAsync(async (req, res, next) => {
    let { id } = req.params; // Extract the ID from the route parameters
    let list = await Listing.findById(id).populate("reviews"); // Find the listing by ID and populate reviews
    res.render("./listings/list.ejs", { list }); // Render the list.ejs view with the listing data
  })
);

// 13. Route handler to create a new listing
app.post(
  "/listings",
  validateListing, // Middleware to validate listing data (ref: 8)
  wrapAsync(async (req, res, next) => {
    let newlist = new Listing(req.body.listing); // Create a new listing from the request body
    await newlist.save(); // Save the new listing to the database
    res.redirect("/listings"); // Redirect to the listings page
  })
);

// 14. Route handler to display the form to edit an existing listing
app.get(
  "/listings/:id/edit",
  wrapAsync(async (req, res, next) => {
    let { id } = req.params; // Extract the ID from the route parameters
    let list = await Listing.findById(id); // Find the listing by ID
    res.render("./listings/update.ejs", { list }); // Render the update.ejs view with the listing data
  })
);

// 15. Route handler to update an existing listing
app.put(
  "/listings/:id",
  validateListing, // Middleware to validate listing data (ref: 8)
  wrapAsync(async (req, res, next) => {
    let { id } = req.params; // Extract the ID from the route parameters
    await Listing.findByIdAndUpdate(id, { ...req.body.listing }); // Update the listing in the database with the new data
    res.redirect(`/listings/${id}`); // Redirect to the updated listing page
  })
);

// 16. Route handler to delete an existing listing
app.delete(
  "/listings/:id",
  wrapAsync(async (req, res, next) => {
    let { id } = req.params; // Extract the ID from the route parameters
    let deletedList = await Listing.findByIdAndDelete(id); // Delete the listing from the database
    res.redirect("/listings"); // Redirect to the listings page
  })
);

// 17. Route handler to create a new review for a listing
app.post(
  "/listings/:id/review",
  validateReview, // Middleware to validate review data (ref: 9)
  wrapAsync(async (req, res, next) => {
    let { id } = req.params; // Extract the listing ID from the route parameters
    let listing = await Listing.findById(id); // Find the listing by ID
    let newReview = new Review(req.body.review); // Create a new review from the request body
    listing.reviews.push(newReview); // Add the new review to the listing's reviews array
    await newReview.save(); // Save the new review to the database
    await listing.save(); // Save the updated listing to the database
    res.redirect(`/listings/${listing._id}`); // Redirect to the listing page
  })
);

// 18. Route handler to delete a review from a listing
app.delete(
  "/listings/:id/review/:reviewId",
  wrapAsync(async (req, res, next) => {
    let { id, reviewId } = req.params; // Extract the listing ID and review ID from the route parameters
    let updatedListing = await Listing.findByIdAndUpdate(
      id,
      { $pull: { reviews: reviewId } }, // Remove the review ID from the listing's reviews array
      { new: true }
    );
    await Review.findByIdAndDelete(reviewId); // Delete the review from the database
    res.redirect(`/listings/${id}`); // Redirect to the listing page
  })
);

// 19. Catch-all route handler for undefined routes
app.all("*", (req, res, next) => {
  next(new ExpressError(404, "Page Not Found")); // Pass a 404 error to the error handler for undefined routes
});

// 20. Error-handling middleware to handle any errors that occur in the app
app.use((err, req, res, next) => {
  let { status = 500, message = "Something Went Wrong" } = err; // Default to a 500 status code and generic error message
  res.render("./listings/error.ejs", { err }); // Render the error.ejs view with the error data
});

// 21. Start the server and listen on the specified port
app.listen(port, () => {
  console.log(`Server is listening on port :- ${port}`); // Log a message indicating that the server is running
});
