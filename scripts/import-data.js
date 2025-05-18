#!/usr/bin/env node

/**
 * Import script for sample data into Directus
 * Usage: node scripts/import-data.js
 */

const { createDirectus, rest, staticToken } = require('@directus/sdk');
const fs = require('fs');
const path = require('path');
const FormData = require('form-data');
const dotenv = require('dotenv');
const axios = require('axios');

// Load environment variables
dotenv.config();

// Configuration
const DIRECTUS_URL = process.env.NEXT_PUBLIC_DIRECTUS_URL || 'http://localhost:8055';
const DIRECTUS_TOKEN = process.env.DIRECTUS_TOKEN;

if (!DIRECTUS_TOKEN) {
  console.error('Error: DIRECTUS_TOKEN is not set in your .env file');
  process.exit(1);
}

// Initialize Directus client
const directus = createDirectus(DIRECTUS_URL)
  .with(rest())
  .with(staticToken(DIRECTUS_TOKEN));

// Path to sample data
const sampleDataDir = path.join(__dirname, '..', 'sample-data');

/**
 * Upload a file to Directus
 */
async function uploadFile(filePath, fileNameOverride = null) {
  try {
    const fileName = fileNameOverride || path.basename(filePath);
    const form = new FormData();
    form.append('file', fs.createReadStream(filePath), { filename: fileName });

    // Use axios to handle form-data properly
    const response = await axios.post(`${DIRECTUS_URL}/files`, form, {
      headers: {
        ...form.getHeaders(),
        'Authorization': `Bearer ${DIRECTUS_TOKEN}`
      }
    });

    return response.data.data.id;
  } catch (error) {
    console.error(`Error uploading file ${filePath}:`, error.message);
    throw error;
  }
}

/**
 * Import destinations
 */
async function importDestinations() {
  try {
    console.log('Importing destinations...');
    const destinationsFile = path.join(sampleDataDir, 'destinations.json');
    let destinations = JSON.parse(fs.readFileSync(destinationsFile, 'utf8'));
    
    // Process and upload each destination
    for (const destination of destinations) {
      console.log(`Processing destination: ${destination.name}`);
      
      // Upload main image
      if (destination.main_image) {
        const dummyImagePath = path.join(sampleDataDir, 'images', 'dummy-destination.jpg');
        destination.main_image = await uploadFile(dummyImagePath, destination.main_image);
        console.log(`Uploaded main image for ${destination.name}`);
      }
      
      // Process gallery images
      if (destination.gallery && Array.isArray(destination.gallery)) {
        for (let i = 0; i < destination.gallery.length; i++) {
          const galleryItem = destination.gallery[i];
          if (galleryItem.image) {
            const dummyImagePath = path.join(sampleDataDir, 'images', 'dummy-gallery.jpg');
            galleryItem.image = await uploadFile(dummyImagePath, galleryItem.image);
            console.log(`Uploaded gallery image ${i+1} for ${destination.name}`);
          }
        }
      }
      
      // Process highlight images
      if (destination.highlights && Array.isArray(destination.highlights)) {
        for (let i = 0; i < destination.highlights.length; i++) {
          const highlight = destination.highlights[i];
          if (highlight.image) {
            const dummyImagePath = path.join(sampleDataDir, 'images', 'dummy-highlight.jpg');
            highlight.image = await uploadFile(dummyImagePath, highlight.image);
            console.log(`Uploaded highlight image ${i+1} for ${destination.name}`);
          }
        }
      }
      
      // Process activities images
      if (destination.activities && Array.isArray(destination.activities)) {
        for (let i = 0; i < destination.activities.length; i++) {
          const activity = destination.activities[i];
          if (activity.image) {
            const dummyImagePath = path.join(sampleDataDir, 'images', 'dummy-activity.jpg');
            activity.image = await uploadFile(dummyImagePath, activity.image);
            console.log(`Uploaded activity image ${i+1} for ${destination.name}`);
          }
        }
      }
      
      // Process dining images
      if (destination.dining && Array.isArray(destination.dining)) {
        for (let i = 0; i < destination.dining.length; i++) {
          const dining = destination.dining[i];
          if (dining.image) {
            const dummyImagePath = path.join(sampleDataDir, 'images', 'dummy-restaurant.jpg');
            dining.image = await uploadFile(dummyImagePath, dining.image);
            console.log(`Uploaded dining image ${i+1} for ${destination.name}`);
          }
        }
      }
      
      // Save destination to Directus
      try {
        const createdDestination = await directus.request(
          rest.createItem('destinations', destination)
        );
        console.log(`Imported destination: ${createdDestination.name} (ID: ${createdDestination.id})`);
      } catch (error) {
        console.error(`Error creating destination ${destination.name}:`, error.message);
      }
    }
    
    console.log('Destinations import completed');
  } catch (error) {
    console.error('Error importing destinations:', error);
  }
}

/**
 * Import hotels
 */
async function importHotels() {
  try {
    console.log('Importing hotels...');
    const hotelsFile = path.join(sampleDataDir, 'hotels.json');
    let hotels = JSON.parse(fs.readFileSync(hotelsFile, 'utf8'));
    
    // Process and upload each hotel
    for (const hotel of hotels) {
      console.log(`Processing hotel: ${hotel.name}`);
      
      // Upload main image
      if (!hotel.main_image) {
        const dummyImagePath = path.join(sampleDataDir, 'images', 'dummy-hotel.jpg');
        hotel.main_image = await uploadFile(dummyImagePath, `hotel-${hotel.slug}.jpg`);
        console.log(`Uploaded main image for ${hotel.name}`);
      }
      
      // Save hotel to Directus
      try {
        const createdHotel = await directus.request(
          rest.createItem('hotels', hotel)
        );
        console.log(`Imported hotel: ${createdHotel.name} (ID: ${createdHotel.id})`);
      } catch (error) {
        console.error(`Error creating hotel ${hotel.name}:`, error.message);
      }
    }
    
    console.log('Hotels import completed');
  } catch (error) {
    console.error('Error importing hotels:', error);
  }
}

/**
 * Create sample categories
 */
async function createCategories() {
  try {
    console.log('Creating categories...');
    
    const categories = [
      {
        name: 'Mountains',
        slug: 'mountains',
        description: 'Hotels located in mountain regions, offering scenic views and access to hiking and skiing activities.',
        icon: 'mountains',
        type: 'both',
        featured: true,
        sort: 10
      },
      {
        name: 'Beach',
        slug: 'beach',
        description: 'Beachfront or near-beach properties with easy access to sea and sand.',
        icon: 'beach',
        type: 'both',
        featured: true,
        sort: 20
      },
      {
        name: 'City',
        slug: 'city',
        description: 'Urban hotels in the heart of vibrant cities, with easy access to cultural attractions and nightlife.',
        icon: 'city',
        type: 'both',
        featured: true,
        sort: 30
      },
      {
        name: 'Spa',
        slug: 'spa',
        description: 'Hotels with exceptional wellness facilities and spa services.',
        icon: 'spa',
        type: 'hotel',
        featured: true,
        sort: 40
      },
      {
        name: 'Design',
        slug: 'design',
        description: 'Hotels with exceptional architecture and interior design, often featured in design publications.',
        icon: 'design',
        type: 'hotel',
        featured: true,
        sort: 50
      },
      {
        name: 'Boutique',
        slug: 'boutique',
        description: 'Smaller, intimate hotels with unique character and personalized service.',
        icon: 'boutique',
        type: 'hotel',
        featured: false,
        sort: 60
      },
      {
        name: 'Luxury',
        slug: 'luxury',
        description: 'Five-star properties offering the highest standards of service, amenities, and comfort.',
        icon: 'luxury',
        type: 'hotel',
        featured: true,
        sort: 70
      },
      {
        name: 'Ski',
        slug: 'ski',
        description: 'Hotels with convenient access to ski slopes and winter sports facilities.',
        icon: 'ski',
        type: 'both',
        featured: false,
        sort: 80
      },
      {
        name: 'Lake',
        slug: 'lake',
        description: 'Hotels situated on or near lakes, offering water activities and scenic views.',
        icon: 'lake',
        type: 'both',
        featured: false,
        sort: 90
      },
      {
        name: 'Cultural',
        slug: 'cultural',
        description: 'Destinations with rich cultural heritage, historical sites, and authentic local experiences.',
        icon: 'cultural',
        type: 'destination',
        featured: true,
        sort: 100
      }
    ];
    
    for (const category of categories) {
      try {
        const createdCategory = await directus.request(
          rest.createItem('categories', category)
        );
        console.log(`Created category: ${createdCategory.name}`);
      } catch (error) {
        console.error(`Error creating category ${category.name}:`, error.message);
      }
    }
    
    console.log('Categories creation completed');
  } catch (error) {
    console.error('Error creating categories:', error);
  }
}

/**
 * Create sample pages
 */
async function createPages() {
  try {
    console.log('Creating pages...');
    
    const pages = [
      {
        status: 'published',
        title: 'About CinCin Hotels',
        slug: 'about',
        content: `<h2>Our Story</h2>
<p>CinCin Hotels was founded in 2015 with a simple mission: to curate a collection of the most exceptional boutique and design hotels across Europe's most beautiful destinations.</p>

<p>What began as a passion project by founders Marie and Thomas Weber, who spent years traveling throughout Europe discovering hidden gems, has evolved into a carefully curated selection of properties that each tell their own unique story.</p>

<h2>Our Philosophy</h2>
<p>We believe that where you stay is as important as where you go. Each hotel in our collection has been personally visited and selected based on its distinctive character, exceptional design, commitment to sustainability, and authentic connection to its location.</p>

<p>We focus on quality over quantity, seeking out properties that offer unique experiences rather than standardized luxury. Each CinCin hotel provides a genuine sense of place, whether it's a restored farmhouse in Tuscany, a minimalist retreat in the Swiss Alps, or a bohemian beach hotel on a Greek island.</p>

<h2>Our Commitment</h2>
<p>At CinCin Hotels, we are committed to:</p>
<ul>
  <li>Supporting independent hotels and local communities</li>
  <li>Promoting sustainable tourism practices</li>
  <li>Providing authentic, memorable experiences for our guests</li>
  <li>Offering personalized service and expert destination advice</li>
</ul>

<p>We believe that travel should enrich both the traveler and the destination, and we strive to create connections that benefit both.</p>`,
        template: 'default',
        meta_title: 'About CinCin Hotels | Our Story & Philosophy',
        meta_description: 'Learn about CinCin Hotels, our curated collection of exceptional boutique and design hotels across Europe's most beautiful destinations.',
        show_in_navigation: true,
        sort: 10
      },
      {
        status: 'published',
        title: 'Contact Us',
        slug: 'contact',
        content: `<h2>Get in Touch</h2>
<p>We'd love to hear from you. Whether you have questions about a specific hotel, need help planning your trip, or want to provide feedback on your experience, our team is here to assist you.</p>

<h3>Contact Information</h3>
<p><strong>Email:</strong> info@cincinhotels.com</p>
<p><strong>Phone:</strong> +41 44 123 4567</p>
<p><strong>Address:</strong><br>
CinCin Hotels AG<br>
Bahnhofstrasse 42<br>
8001 Zürich<br>
Switzerland</p>

<h3>Send Us a Message</h3>
<p>Please fill out the form below, and we'll get back to you as soon as possible.</p>

<div class="contact-form-placeholder">
  <!-- Form will be rendered by the frontend application -->
  <p>Contact form will appear here</p>
</div>`,
        template: 'sidebar',
        meta_title: 'Contact CinCin Hotels | Get in Touch',
        meta_description: 'Contact the CinCin Hotels team for assistance with bookings, travel planning, or any questions about our curated collection of European boutique hotels.',
        show_in_navigation: true,
        sort: 20
      },
      {
        status: 'published',
        title: 'Privacy Policy',
        slug: 'privacy-policy',
        content: `<h2>Privacy Policy</h2>
<p>Last updated: May 1, 2023</p>

<p>At CinCin Hotels, we respect your privacy and are committed to protecting your personal data. This privacy policy explains how we collect, use, and safeguard your information when you visit our website or use our services.</p>

<h3>Information We Collect</h3>
<p>We may collect the following types of information:</p>
<ul>
  <li>Personal identification information (name, email address, phone number, etc.)</li>
  <li>Booking information (travel dates, hotel preferences, special requests)</li>
  <li>Payment information (processed through secure third-party payment providers)</li>
  <li>Technical data (IP address, browser type, device information)</li>
  <li>Usage data (pages visited, time spent on site, interactions)</li>
</ul>

<h3>How We Use Your Information</h3>
<p>We use your information to:</p>
<ul>
  <li>Process and manage your hotel bookings</li>
  <li>Communicate with you about your reservations</li>
  <li>Provide customer support</li>
  <li>Improve our website and services</li>
  <li>Send marketing communications (with your consent)</li>
  <li>Comply with legal obligations</li>
</ul>

<h3>Data Security</h3>
<p>We implement appropriate security measures to protect your personal information against unauthorized access, alteration, disclosure, or destruction.</p>

<h3>Your Rights</h3>
<p>Depending on your location, you may have rights related to your personal data, including:</p>
<ul>
  <li>Access to your personal data</li>
  <li>Correction of inaccurate data</li>
  <li>Deletion of your data</li>
  <li>Restriction of processing</li>
  <li>Data portability</li>
  <li>Objection to processing</li>
</ul>

<h3>Cookies</h3>
<p>We use cookies to enhance your experience on our website. You can set your browser to refuse all or some browser cookies, but this may affect some functionality of our site.</p>

<h3>Changes to This Policy</h3>
<p>We may update this privacy policy from time to time. The latest version will always be posted on our website.</p>

<h3>Contact Us</h3>
<p>If you have questions about this privacy policy or our data practices, please contact us at privacy@cincinhotels.com.</p>`,
        template: 'default',
        meta_title: 'Privacy Policy | CinCin Hotels',
        meta_description: 'Read CinCin Hotels' privacy policy to understand how we collect, use, and protect your personal information when you use our website and services.',
        show_in_navigation: false,
        sort: 30
      }
    ];
    
    for (const page of pages) {
      try {
        const createdPage = await directus.request(
          rest.createItem('pages', page)
        );
        console.log(`Created page: ${createdPage.title}`);
      } catch (error) {
        console.error(`Error creating page ${page.title}:`, error.message);
      }
    }
    
    console.log('Pages creation completed');
  } catch (error) {
    console.error('Error creating pages:', error);
  }
}

/**
 * Run the import process
 */
async function runImport() {
  try {
    console.log('Starting import process...');
    
    // Create categories first (they're referenced by hotels and destinations)
    await createCategories();
    
    // Import destinations (they're referenced by hotels)
    await importDestinations();
    
    // Import hotels
    await importHotels();
    
    // Create pages
    await createPages();
    
    console.log('Import process completed successfully');
  } catch (error) {
    console.error('Error during import process:', error);
    process.exit(1);
  }
}

// Run the import
runImport();