// utils/pdfConverter.js
const pdfParse = require('pdf-parse');
const axios = require('axios');
const xmlbuilder = require('xmlbuilder');
const cloudinary = require('cloudinary').v2;
require('dotenv').config();

// Configure Cloudinary with your credentials
cloudinary.config({ 
  cloud_name:  '', 
  api_key: '',
  api_secret: ''
});

async function downloadPDF(url) {
  console.log(`Attempting to download PDF from URL: ${url}`);
  try {
    // Check if the URL is from Cloudinary
    const isCloudinary = url.includes('cloudinary.com');
    
    if (isCloudinary) {
      // Extract the public ID from the URL
      const parts = url.split('/upload/');
      if (parts.length < 2) {
        throw new Error('Invalid Cloudinary URL format');
      }
      
      // Get everything after /upload/ (including version) but removing the file extension
      const fullPath = parts[1];
      const publicIdWithVersion = fullPath.replace(/\.[^.]+$/, ''); // Remove file extension
      
      console.log(`Extracted path from URL: ${publicIdWithVersion}`);
      
      // Generate a signed URL using the Cloudinary SDK
      const signedUrl = cloudinary.url(publicIdWithVersion, {
        resource_type: 'raw',
        type: 'upload',
        secure: true,
        sign_url: true
      });
      
      console.log(`Generated signed URL: ${signedUrl}`);
      
      // Use the signed URL for the download
      const response = await axios({
        url: signedUrl,
        method: 'GET',
        responseType: 'arraybuffer',
        maxContentLength: 50 * 1024 * 1024, // 50MB max
        timeout: 30000, // 30 second timeout
      });
      
      console.log(`PDF download successful, received ${response.data.length} bytes`);
      return response.data;
    } else {
      // For non-Cloudinary URLs, use the regular approach
      const response = await axios({
        url,
        method: 'GET',
        responseType: 'arraybuffer',
        maxContentLength: 50 * 1024 * 1024,
        timeout: 30000,
      });
      
      console.log(`PDF download successful, received ${response.data.length} bytes`);
      return response.data;
    }
  } catch (error) {
    console.error('PDF download error:', error.message);
    if (error.response) {
      console.error(`Status: ${error.response.status}`);
      console.error(`Headers: ${JSON.stringify(error.response.headers)}`);
    }
    throw new Error(`Failed to download PDF: ${error.message}`);
  }
}

function extractBasicXML(text) {
  // Basic conversion - just text content wrapped in XML elements
  const root = xmlbuilder.create('document');
  
  // Split text into paragraphs
  const paragraphs = text.split(/\n\s*\n/);
  
  paragraphs.forEach((paragraph, index) => {
    if (paragraph.trim()) {
      root.ele('paragraph', { id: `p${index + 1}` }).txt(paragraph.trim());
    }
  });
  
  return root.end({ pretty: true });
}

function extractStructuredXML(data) {
  // More structured conversion - attempt to identify headers and structure
  const root = xmlbuilder.create('document');
  
  // Split text into paragraphs
  const paragraphs = data.text.split(/\n\s*\n/);
  
  let currentPage = root.ele('page', { number: 1 });
  let pageCount = 1;
  let lastY = -1;
  let currentSection = null;
  
  paragraphs.forEach((paragraph, index) => {
    if (!paragraph.trim()) return;
    
    // Check if this might be a header (shorter text, often starts with numbers)
    const isHeader = paragraph.length < 100 && /^[A-Z0-9]/.test(paragraph);
    
    if (isHeader) {
      currentSection = currentPage.ele('section', { id: `s${index + 1}` });
      currentSection.ele('heading').txt(paragraph.trim());
    } else if (currentSection) {
      currentSection.ele('paragraph', { id: `p${index + 1}` }).txt(paragraph.trim());
    } else {
      currentPage.ele('paragraph', { id: `p${index + 1}` }).txt(paragraph.trim());
    }
  });
  
  return root.end({ pretty: true });
}

async function convertPDFtoXML(pdfUrl, structureLevel = 'basic') {
  try {
    const pdfBuffer = await downloadPDF(pdfUrl);
    const data = await pdfParse(pdfBuffer);
    
    if (structureLevel === 'basic') {
      return extractBasicXML(data.text);
    } else {
      return extractStructuredXML(data);
    }
  } catch (error) {
    console.error('PDF conversion error:', error);
    throw new Error('Failed to convert PDF to XML');
  }
}

// Add a fallback function that provides valid XML even when conversion fails
function generateFallbackXML(error) {
  const root = xmlbuilder.create('document');
  root.ele('error').txt(`Conversion failed: ${error.message}`);
  return root.end({ pretty: true });
}

// Export with the new fallback function
module.exports = { convertPDFtoXML, generateFallbackXML };