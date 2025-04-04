# PDF to XML Converter

A web application that allows users to upload PDFs, convert them to XML format, and preview both the original and converted documents. Includes user authentication, multi-page support, sidebar history, and profile management.

## Setup and Run Instructions

### Backend
```bash
cd backend
npm install
nodemon server.js
```

### Frontend
```bash
cd frontend
npm install
npm run dev
```

## Technology Stack & Reasoning

| Technology | Reason |
|------------|--------|
| **Next.js** | Provides a powerful, SEO-friendly frontend with fast development and built-in routing |
| **Node.js (Express)** | Simple and scalable backend framework that integrates well with REST APIs |
| **MongoDB** | NoSQL database perfect for handling document-based data like user profiles and conversion logs |
| **Cloudinary** | Efficient storage and secure delivery of PDF files, supports signed URLs for enhanced privacy |
| **JWT (JSON Web Tokens)** | Industry-standard authentication mechanism for securing user sessions |
| **pdf-parse** | Efficient PDF parsing to extract raw text data |
| **xmlbuilder** | Enables dynamic creation of XML content from extracted text |
| **Axios** | For making HTTP requests, including downloading PDFs from Cloudinary |

This stack provides a robust, scalable foundation while enabling rapid development and deployment of full-stack features.

## Implemented Challenge Level

**Level 2 - Intermediate Implementation**

Features Included:
* ✅ File upload with Cloudinary
* ✅ Authentication with JWT
* ✅ Improved PDF-to-XML conversion with paragraph and header detection
* ✅ Multi-page XML structure
* ✅ Preview of both PDF and XML
* ✅ Sidebar for navigation/history
* ✅ User profile management
* ✅ Basic error handling and input validation

## Approach to PDF-to-XML Conversion

* **Download from Cloudinary** using signed URLs to ensure secure access
* **Extract text** using `pdf-parse`
* **Basic XML Conversion:** Wraps raw paragraphs into `<paragraph>` tags
* **Structured XML Conversion:**
   * Detects possible headers (shorter lines, capitalized text)
   * Groups related content into `<section>` blocks
   * Pages are nested in `<page number="x">` for multi-page documents

Example:
```xml
<document>
  <page number="1">
    <section id="s1">
      <heading>INTRODUCTION</heading>
      <paragraph id="p1">This document explains...</paragraph>
    </section>
  </page>
</document>
```

## Assumptions & Limitations

**Assumptions:**
* Paragraphs are separated by double line breaks
* Headers are usually short and start with uppercase letters/numbers
* Cloudinary will be used for all file uploads

**Limitations:**
* XML structure is still **basic** — true semantic structure like tables, lists, and accurate sections is **not fully implemented**
* Does **not preserve original font styles, sizes, or layout** (future improvement)
* Currently, **does not support sub-user roles or permissions**

## Future Improvements

* ✅ Enhance XML generation to better represent document **structure (headings, subheadings, lists, tables)**
* 🧪 Use an OCR library (e.g., Tesseract.js) to support scanned PDFs
* 🌐 Add support for uploading **local PDFs directly from the frontend**
* 🗃️ Implement **searchable history** for past conversions
* 🔐 Add **password reset** and OAuth login
* 📊 Analytics dashboard for admin view of usage

## Credits

Made with ❤️ by Sashakt Saxena
