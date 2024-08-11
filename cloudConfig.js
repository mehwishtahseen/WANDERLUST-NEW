// Import the Cloudinary library and the CloudinaryStorage class from multer-storage-cloudinary
const cloudinary = require("cloudinary").v2;
const { CloudinaryStorage } = require("multer-storage-cloudinary");

// Configure the Cloudinary instance with credentials from environment variables
cloudinary.config({
  cloud_name: process.env.CLOUD_NAME,
  api_key: process.env.CLOUD_API_KEY,
  api_secret: process.env.CLOUD_API_SECRET,
});

// Set up Cloudinary storage configuration for file uploads
const storage = new CloudinaryStorage({
  cloudinary: cloudinary, // Reference to the configured Cloudinary instance
  params: {
    folder: "wanderlust_Dev", // The folder in Cloudinary where uploaded files will be stored
    allowedFormats: ["png", "jpg", "jpeg"], // The allowed file formats for uploads
  },
});

module.exports = {
  cloudinary,
  storage,
};
