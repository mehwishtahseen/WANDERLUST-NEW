// 1. Import necessary modules and initialize the app
const express = require("express"); // Import Express framework
const app = express(); // Create an instance of the Express application
const port = 8080; // Define the port number for the server
const path = require("path"); // Import path module for working with file and directory paths
const mongoose = require("mongoose"); // Import Mongoose for MongoDB object modeling
const Listing = require("./models/listing.js"); // Import the Listing model (listings.js, 1)
const methodOverride = require("method-override"); // Middleware to use HTTP verbs such as PUT or DELETE in places where the client doesn't support it
const ejsMate = require("ejs-mate"); // Layouts and partials for EJS templates
const wrapAsync = require("./utils/wrapAsync.js"); // Wrapper for async functions to catch errors and pass them to the error handler (listings.js, 6)
const ExpressError = require("./utils/ExpressError.js"); // Custom error class for handling specific errors (listings.js, 7)
const { listingSchema, reviewSchema } = require("./schema.js"); // Import schemas for validating listings and reviews (listings.js, 3)
const Review = require("./models/review.js"); // Import the Review model (reviews.js, 1)
const listings = require("./routes/listings.js"); // Import the listings routes (listings.js, 8)
const reviews = require("./routes/review.js"); // Import the reviews routes (reviews.js, 3)

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
  res.redirect("/listings"); // Redirects to listings (listings.js, 14)
});

// 8. Use listings and reviews routes
app.use("/listings", listings); // Use listings routes for all "/listings" paths (listings.js, 14)
app.use("/listings/:id/review", reviews); // Use reviews routes for all "/listings/:id/review" paths (reviews.js, 2)

// 9. Catch-all route handler for undefined routes
app.all("*", (req, res, next) => {
  next(new ExpressError(404, "Page Not Found")); // Pass a 404 error to the error handler for undefined routes (listings.js, 7)
});

// 10. Error-handling middleware to handle any errors that occur in the app
app.use((err, req, res, next) => {
  let { status = 500, message = "Something Went Wrong" } = err; // Default to a 500 status code and generic error message
  res.render("./listings/error.ejs", { err }); // Render the error.ejs view with the error data (listings.js, 14)
});

// 11. Start the server and listen on the specified port
app.listen(port, () => {
  console.log(`Server is listening on port :- ${port}`); // Log a message indicating that the server is running
});
