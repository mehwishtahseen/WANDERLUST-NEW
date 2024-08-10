if (process.env.NODE_ENV != "production") {
  require("dotenv").config();
}
const express = require("express");
const app = express();
const port = 8080;
const path = require("path");
const mongoose = require("mongoose");
const methodOverride = require("method-override");
const ejsMate = require("ejs-mate");
const ExpressError = require("./utils/ExpressError.js");
const session = require("express-session");
const flash = require("connect-flash");
const passport = require("passport");
const LocalStrategy = require("passport-local");
const User = require("./models/user.js");
const listingRouter = require("./routes/listings.js");
const reviewRouter = require("./routes/review.js");
const userRouter = require("./routes/user.js");

//1. Connecting with Database
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

//2. Setting up Express and some Middlewares
app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views"));
app.use(express.urlencoded({ extended: true }));
app.use(methodOverride("_method"));
app.engine("ejs", ejsMate);
app.use(express.static(path.join(__dirname, "public")));

//3. Setting up Session Configuration
const sessionOptions = {
  secret: "mysupersecretcode", // Secret key for signing the session ID cookie
  resave: false, // Don't save the session if it's unmodified
  saveUninitialized: true, // Save new sessions to the store
  cookie: {
    expires: Date.now() + 7 * 24 * 60 * 60 * 1000, // Cookie expiration time (1 week)
    maxAge: 7 * 24 * 60 * 60 * 1000, // Cookie max age (1 week)
    httpOnly: true,
  },
};

app.use(session(sessionOptions));
app.use(flash()); // For flash messages

//4. Setting up Passport for Authentication
app.use(passport.initialize()); // Initialize Passport
app.use(passport.session()); // This line of code enables Passport to use sessions to keep users logged in across multiple requests.
passport.use(new LocalStrategy(User.authenticate())); // Use local strategy for authentication

// These methods are used to manage how user data is stored and retrieved from the session.

passport.serializeUser(User.serializeUser()); // Serialize user for the session
passport.deserializeUser(User.deserializeUser()); // Deserialize user from the session

//5. Middleware for Flash Messages and Current User
app.use((req, res, next) => {
  res.locals.success = req.flash("success"); // Success messages
  res.locals.error = req.flash("error"); // Error messages
  res.locals.currUser = req.user; // Current logged-in user
  next();
});

//6. Home Route
app.get("/", async (req, res, next) => {
  res.redirect("/listings");
});

//7. Directing towards routes of various functionalities
app.use("/listings", listingRouter);
app.use("/listings/:id/review", reviewRouter);
app.use("/", userRouter);

//8. Middleware to detect error for every route if any
app.all("*", (req, res, next) => {
  next(new ExpressError(404, "Page Not Found"));
});

//9. Error Handling Middleware
app.use((err, req, res, next) => {
  let { status = 500, message = "Something Went Wrong" } = err;
  res.render("./listings/error.ejs", { err });
});

//10. Defining Port
app.listen(port, () => {
  console.log(`Server is listening on port :- ${port}`);
});
