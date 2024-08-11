module.exports = (fn) => {
  return function (req, res, next) {
    fn(req, res, next).catch(next);
  };
};

// This function is a higher-order function that takes an asynchronous function `fn` as an argument
// and returns a new function. The returned function is designed to handle errors in asynchronous
// Express route handlers or middleware.
// it Call the asynchronous function `fn` with the request, response, and next parameters.
// If an error is thrown, it will be caught and passed to the `next` middleware, which is
// typically used to handle errors in Express.
