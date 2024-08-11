class ExpressError extends Error {
  constructor(status, message) {
    super();
    this.status = status;
    this.message = message;
  }
}

module.exports = ExpressError;

// This class extends the built-in Error class to create custom errors for your Express application.
// It allows you to specify both an HTTP status code and a custom error message,
// which can then be used to handle errors more effectively throughout your application.
