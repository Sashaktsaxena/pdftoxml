// config/cloudinary.js
const cloudinary = require('cloudinary').v2;
const { CloudinaryStorage } = require('multer-storage-cloudinary');
const multer = require('multer');

cloudinary.config({
  cloud_name: "",
  api_key: "",
  api_secret: "",
});

// Log Cloudinary connection status
// console.log('Cloudinary configuration loaded:', 
//   process.env.CLOUDINARY_CLOUD_NAME ? 'Cloud name is set' : 'Cloud name is MISSING',
//   process.env.CLOUDINARY_API_KEY ? 'API key is set' : 'API key is MISSING',
//   process.env.CLOUDINARY_API_SECRET ? 'API secret is set' : 'API secret is MISSING'
// );

// const storage = new CloudinaryStorage({
//   cloudinary: cloudinary,
//   params: {
//     folder: 'pdf-converter',
//     resource_type: 'raw',
//     format: 'pdf',
//     public_id: (req, file) => {
//       // Generate a unique name for the uploaded file
//       const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1e9);
//       const filename = file.originalname.replace(/\.[^/.]+$/, "");
//       return `${filename}-${uniqueSuffix}`;
//     }
//   }
// });
const storage = new CloudinaryStorage({
  cloudinary: cloudinary,
  params: {
    folder: 'pdf-converter',
    resource_type: 'raw', // Important for PDF files
    // Make sure this is set to 'authenticated' if your files should be private
    access_mode: 'public', // Or 'authenticated' if your files should be protected
    // Include any other Cloudinary options you need
  }
});

// Create file filter to ensure only PDFs are uploaded
const fileFilter = (req, file, cb) => {
  if (file.mimetype === 'application/pdf') {
    cb(null, true);
  } else {
    cb(new Error('Only PDF files are allowed!'), false);
  }
};

const upload = multer({ 
  storage: storage,
  fileFilter: fileFilter,
  limits: { fileSize: 10 * 1024 * 1024 } // 10MB limit
});

module.exports = {
  cloudinary,
  upload
};