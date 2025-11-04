import express from 'express';
import multer from 'multer';
import { v2 as cloudinary } from 'cloudinary';
import { CloudinaryStorage } from 'multer-storage-cloudinary';

const router = express.Router();

// Configure Cloudinary
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

// Set up multer memory storage
const memoryStorage = multer.memoryStorage();
const upload = multer({ 
  storage: memoryStorage,
  limits: {
    fileSize: 5 * 1024 * 1024, // 5MB limit
  },
  fileFilter: (req, file, cb) => {
    if (file.mimetype.startsWith('image/')) {
      cb(null, true);
    } else {
      cb(new Error('Only image files are allowed'), false);
    }
  },
});

// Upload image to Cloudinary
router.post('/image', upload.single('image'), async (req, res) => {
  console.log('Upload request received', {
    headers: req.headers,
    file: req.file ? {
      originalname: req.file.originalname,
      mimetype: req.file.mimetype,
      size: req.file.size
    } : 'No file received'
  });
  
  if (!req.file) {
    console.error('No file in request');
    return res.status(400).json({ 
      success: false,
      error: 'No file uploaded or file type not allowed. Please upload an image file (JPEG, PNG, etc.)',
      allowedTypes: ['image/jpeg', 'image/png', 'image/webp', 'image/gif']
    });
  }

  try {
    console.log('Processing file for Cloudinary:', {
      originalname: req.file.originalname,
      mimetype: req.file.mimetype,
      size: req.file.size
    });
    
    // Verify Cloudinary config
    if (!process.env.CLOUDINARY_CLOUD_NAME || !process.env.CLOUDINARY_API_KEY || !process.env.CLOUDINARY_API_SECRET) {
      throw new Error('Cloudinary configuration is incomplete');
    }
    
    // Convert buffer to base64
    const base64Data = `data:${req.file.mimetype};base64,${req.file.buffer.toString('base64')}`;
    
    console.log('Uploading to Cloudinary...');
    
    // Upload to Cloudinary with error handling
    const result = await cloudinary.uploader.upload(base64Data, {
      folder: 'prakritee',
      resource_type: 'auto',
      transformation: [
        { width: 800, height: 800, crop: 'limit' },
        { quality: 'auto' },
        { fetch_format: 'auto' }
      ]
    }).catch(cloudinaryError => {
      console.error('Cloudinary upload error:', {
        message: cloudinaryError.message,
        http_code: cloudinaryError.http_code,
        name: cloudinaryError.name
      });
      throw new Error(`Cloudinary upload failed: ${cloudinaryError.message}`);
    });
    
    console.log('Cloudinary upload successful:', {
      url: result.secure_url,
      publicId: result.public_id,
      format: result.format,
      bytes: result.bytes
    });
    
    res.json({
      success: true,
      message: 'Image uploaded successfully',
      imageUrl: result.secure_url,
      publicId: result.public_id,
      format: result.format,
      bytes: result.bytes
    });
    
  } catch (error) {
    console.error('Upload error details:', {
      error: error.message,
      stack: error.stack,
      name: error.name,
      code: error.code
    });
    
    res.status(500).json({ 
      success: false,
      error: 'Failed to upload image',
      message: error.message,
      ...(process.env.NODE_ENV === 'development' && {
        stack: error.stack,
        code: error.code
      })
    });
  }
});

export default router;
