// routes/conversions.js
const express = require('express');
const router = express.Router();
const auth = require('../middleware/auth');
const { upload } = require('../config/cloudinary');
const { convertPDFtoXML } = require('../utils/pdfConverter');
const Conversion = require('../models/Conversion');
const { generateFallbackXML } = require('../utils/pdfConverter'); // Assuming you have a utility for generating fallback XML
// @route   POST api/conversions
// @desc    Upload and convert PDF to XML
// @access  Private
// Update your convertPDFtoXML function to better handle errors
router.post('/', auth, upload.single('pdf'), async (req, res) => {
  try {
    console.log('Request file:', JSON.stringify(req.file, null, 2));  // Better logging
    console.log('Request body:', req.body);
    
    if (!req.file) {
      return res.status(400).json({ message: 'No PDF file uploaded' });
    }

    console.log('PDF URL path:', req.file.path); // Log the specific path
    
    if (!req.file.path) {
      return res.status(400).json({ message: 'File upload URL is missing' });
    }

    // Process PDF to XML conversion first
    try {
      const structureLevel = req.body.structureLevel || 'basic';
      console.log(`Converting PDF with structure level: ${structureLevel}`);
      console.log(`PDF URL being processed: ${req.file.path}`);
      
      const xmlContent = await convertPDFtoXML(req.file.path, structureLevel);
      
      // Create new conversion record AFTER conversion is complete
      const newConversion = new Conversion({
        user: req.user.id,
        originalFilename: req.file.originalname,
        pdfUrl: req.file.path,
        xmlContent: xmlContent, // Set the XML content from the conversion
        status: 'completed'
      });
      
      await newConversion.save();
      res.json(newConversion);
      
    } catch (conversionError) {
      console.error('Conversion error details:', conversionError);
      const fallbackXML = generateFallbackXML(conversionError);
      // Create a conversion record with failed status
      const failedConversion = new Conversion({
        user: req.user.id,
        originalFilename: req.file.originalname,
        pdfUrl: req.file.path,
        xmlContent: fallbackXML, // Provide minimal valid XML
        status: 'failed'
      });
      
      await failedConversion.save();
      
      res.status(500).json({ message: 'PDF conversion failed', error: conversionError.message });
    }
  } catch (err) {
    console.error('Server error details:', err);
    res.status(500).send('Server error');
  }
});
// @route   GET api/conversions
// @desc    Get all conversions for user
// @access  Private
router.get('/', auth, async (req, res) => {
  try {
    const conversions = await Conversion.find({ user: req.user.id })
      .sort({ createdAt: -1 });
    res.json(conversions);
  } catch (err) {
    console.error(err);
    res.status(500).send('Server error');
  }
});

// @route   GET api/conversions/:id
// @desc    Get conversion by ID
// @access  Private
router.get('/:id', auth, async (req, res) => {
  try {
    const conversion = await Conversion.findById(req.params.id);
    
    // Check if conversion exists
    if (!conversion) {
      return res.status(404).json({ message: 'Conversion not found' });
    }
    
    // Check user ownership
    if (conversion.user.toString() !== req.user.id) {
      return res.status(401).json({ message: 'User not authorized' });
    }
    
    res.json(conversion);
  } catch (err) {
    console.error(err);
    if (err.kind === 'ObjectId') {
      return res.status(404).json({ message: 'Conversion not found' });
    }
    res.status(500).send('Server error');
  }
});

module.exports = router;