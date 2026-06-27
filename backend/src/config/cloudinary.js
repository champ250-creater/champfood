import { v2 as cloudinary } from 'cloudinary';
import { CloudinaryStorage } from 'multer-storage-cloudinary';
import multer from 'multer';
import dotenv from 'dotenv';

dotenv.config();

// 1. Connect to your Cloudinary account using the keys Render has
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

// 2. Tell Cloudinary where to save the files and what types are allowed
const storage = new CloudinaryStorage({
  cloudinary: cloudinary,
  params: {
    folder: 'techbite_kigali_menu', // It will create this folder in your Cloudinary account
    allowedFormats: ['jpeg', 'png', 'jpg', 'webp'],
  },
});

// 3. Create the 'upload' middleware we will use in our routes
export const upload = multer({ storage: storage });

// 4. Export the configured cloudinary instance for other files to use
export default cloudinary;