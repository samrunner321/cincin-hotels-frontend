/**
 * Mock-Daten für CMS-Seiten
 */

export const mockPages = [
  {
    id: '1',
    status: 'published',
    title: 'About Us',
    slug: 'about',
    content: `
      # About CinCin Hotels
      
      CinCin Hotels represents a carefully curated collection of exceptional properties throughout Europe's most captivating destinations. Our name, derived from the Italian toast "cin cin" (cheers), embodies our philosophy of celebrating life's special moments through extraordinary hospitality experiences.
      
      ## Our Vision
      
      We believe that a truly memorable stay goes beyond luxury amenities and beautiful surroundings. It's about creating connections - to a destination, to local culture, and to moments that become cherished memories. Each CinCin property is selected for its distinctive character and ability to offer authentic experiences that reflect its unique location.
      
      ## Our Collection
      
      Our collection spans from historic boutique hotels in cultural centers to contemporary mountain retreats and Mediterranean seaside resorts. While each property maintains its individual identity and charm, all share our commitment to exceptional service, attention to detail, and environmental responsibility.
      
      ## Sustainability Commitment
      
      At CinCin Hotels, we believe in preserving the beauty of the destinations we call home. We are committed to sustainable practices that minimize environmental impact while supporting local communities. From energy-efficient operations to partnerships with local producers and artisans, sustainability is integrated into everything we do.
      
      ## Join Us
      
      We invite you to explore our collection and discover the perfect setting for your next journey. Whether you're seeking a cultural city break, a rejuvenating mountain retreat, or a relaxing beach escape, CinCin Hotels offers distinctive properties that celebrate the essence of European hospitality.
    `,
    featured_image: {
      id: 'about-page-image',
      title: 'CinCin Hotels Values',
      description: 'Elegant hotel lobby representing CinCin Hotels philosophy',
      width: 1600,
      height: 900
    },
    template: 'default',
    meta_title: 'About CinCin Hotels | Curated Luxury Hotel Collection',
    meta_description: "Discover CinCin Hotels, a curated collection of distinctive luxury properties across Europe's most beautiful destinations. Learn about our vision and values.",
    show_in_navigation: true,
    sort: 1,
    date_created: '2022-01-10T09:00:00Z',
    date_updated: '2023-06-15T14:30:00Z'
  },
  {
    id: '2',
    status: 'published',
    title: 'Contact',
    slug: 'contact',
    content: `
      # Contact Us
      
      We are here to assist you with any inquiries about our hotels, destinations, or booking process. Please feel free to reach out through any of the following channels:
      
      ## General Inquiries
      
      **Email:** info@cincinhotels.com  
      **Telephone:** +41 44 123 4567  
      **Hours:** Monday to Friday, 9:00 AM - 6:00 PM CET
      
      ## Reservations
      
      **Email:** reservations@cincinhotels.com  
      **Telephone:** +41 44 123 4568  
      **Hours:** Monday to Sunday, 8:00 AM - 8:00 PM CET
      
      ## Media Inquiries
      
      **Email:** press@cincinhotels.com  
      **Telephone:** +41 44 123 4569
      
      ## Head Office
      
      CinCin Hotels AG  
      Bahnhofstrasse 42  
      8001 Zürich  
      Switzerland
      
      ## Send Us a Message
      
      Please use the form below to send us your inquiry. Our team will respond as soon as possible, typically within 24 hours during business days.
      
      [Contact Form]
    `,
    featured_image: {
      id: 'contact-page-image',
      title: 'Contact CinCin Hotels',
      description: 'Elegant reception desk representing CinCin Hotels customer service',
      width: 1600,
      height: 900
    },
    template: 'sidebar',
    meta_title: 'Contact CinCin Hotels | Customer Service & Support',
    meta_description: "Get in touch with CinCin Hotels. We're here to help with reservations, inquiries, and anything else you might need during your journey with us.",
    show_in_navigation: true,
    sort: 2,
    date_created: '2022-01-10T10:00:00Z',
    date_updated: '2023-06-16T11:15:00Z'
  },
  {
    id: '3',
    status: 'published',
    title: 'Privacy Policy',
    slug: 'privacy',
    content: `
      # Privacy Policy
      
      At CinCin Hotels, we are committed to protecting your privacy and ensuring the security of your personal information. This Privacy Policy explains how we collect, use, and safeguard your data when you visit our website or interact with our services.
      
      ## Information We Collect
      
      We may collect the following types of information:
      
      **Personal Information:** Name, email address, phone number, postal address, payment information, and other details you provide when making reservations or creating an account.
      
      **Usage Data:** Information about how you interact with our website, including pages visited, time spent, and links clicked.
      
      **Cookies and Tracking Technologies:** We use cookies and similar technologies to enhance your experience, analyze usage patterns, and deliver personalized content.
      
      ## How We Use Your Information
      
      We use your information for the following purposes:
      
      - To process and confirm your hotel reservations
      - To provide customer support and respond to inquiries
      - To send administrative information and service updates
      - To personalize your experience and recommend relevant offerings
      - To improve our website, services, and marketing efforts
      - To comply with legal obligations
      
      ## Data Security
      
      We implement appropriate technical and organizational measures to protect your personal information against unauthorized access, alteration, disclosure, or destruction.
      
      ## Your Rights
      
      Depending on your location, you may have rights regarding your personal information, including:
      
      - The right to access and receive a copy of your personal information
      - The right to rectify or update your personal information
      - The right to erasure (the "right to be forgotten")
      - The right to restrict processing of your personal information
      - The right to data portability
      - The right to object to processing of your personal information
      
      ## Contact Us
      
      If you have questions about this Privacy Policy or our data practices, please contact our Data Protection Officer at privacy@cincinhotels.com.
      
      This Privacy Policy was last updated on June 1, 2023.
    `,
    featured_image: null,
    template: 'default',
    meta_title: 'Privacy Policy | CinCin Hotels',
    meta_description: "Read CinCin Hotels' Privacy Policy to understand how we collect, use, and protect your personal information when you use our services.",
    show_in_navigation: false,
    sort: 3,
    date_created: '2022-01-10T11:00:00Z',
    date_updated: '2023-06-01T16:45:00Z'
  },
  {
    id: '4',
    status: 'published',
    title: 'Terms and Conditions',
    slug: 'terms',
    content: `
      # Terms and Conditions
      
      Please read these Terms and Conditions carefully before using the CinCin Hotels website or making a reservation. By accessing our website or using our services, you agree to be bound by these Terms and Conditions.
      
      ## Reservations and Cancellations
      
      **Reservation Policy:** All reservations require a valid credit card to guarantee the booking. Specific payment and guarantee policies may vary by hotel and rate type.
      
      **Cancellation Policy:** Cancellation policies vary by hotel, room type, and rate selected. Please review the specific cancellation policy associated with your reservation before confirming your booking.
      
      **No-Show Policy:** If you fail to arrive on your scheduled check-in date without prior notification, your reservation may be cancelled, and you may be charged according to the hotel's no-show policy.
      
      ## Check-In and Check-Out
      
      Standard check-in time is from 3:00 PM, and check-out time is by 12:00 PM. Early check-in and late check-out may be available upon request but cannot be guaranteed and may incur additional charges.
      
      ## Hotel Rules and Regulations
      
      Guests are expected to comply with each hotel's specific rules and regulations, which will be made available upon check-in. These may include policies regarding noise, smoking, pets, and use of facilities.
      
      ## Liability
      
      CinCin Hotels is not liable for any loss, damage, or injury incurred during your stay at our properties, except where such liability cannot be excluded by law.
      
      ## Website Use
      
      The content of this website is for your general information and use only. It is subject to change without notice. We reserve the right to modify, suspend, or discontinue any aspect of our website at any time.
      
      ## Intellectual Property
      
      All content on this website, including text, images, logos, and design, is the property of CinCin Hotels and is protected by copyright and other intellectual property laws.
      
      ## Governing Law
      
      These Terms and Conditions shall be governed by and construed in accordance with the laws of Switzerland. Any disputes arising under these terms shall be subject to the exclusive jurisdiction of the courts of Zurich, Switzerland.
      
      These Terms and Conditions were last updated on June 1, 2023.
    `,
    featured_image: null,
    template: 'default',
    meta_title: 'Terms and Conditions | CinCin Hotels',
    meta_description: "Read CinCin Hotels' Terms and Conditions to understand the rules and policies governing the use of our website and services.",
    show_in_navigation: false,
    sort: 4,
    date_created: '2022-01-10T12:00:00Z',
    date_updated: '2023-06-01T17:30:00Z'
  },
  {
    id: '5',
    status: 'published',
    title: 'Membership',
    slug: 'membership',
    content: `
      # CinCin Circle Membership
      
      Elevate your travel experiences with CinCin Circle, our exclusive membership program designed for discerning travelers seeking exceptional benefits and personalized service across our collection of hotels.
      
      ## Membership Tiers
      
      ### Silver Circle
      
      **Annual Fee:** €250
      
      **Benefits:**
      - 10% discount on room rates
      - Early check-in and late check-out (subject to availability)
      - Welcome amenity upon arrival
      - Complimentary room upgrade (subject to availability)
      - Access to member-only rates and promotions
      
      ### Gold Circle
      
      **Annual Fee:** €750
      
      **Benefits:**
      - All Silver benefits
      - 15% discount on room rates
      - Guaranteed late check-out until 2:00 PM
      - €100 hotel credit per stay
      - Complimentary breakfast for two
      - Priority reservations at hotel restaurants
      - VIP welcome amenity
      
      ### Platinum Circle
      
      **Annual Fee:** €1,500
      
      **Benefits:**
      - All Gold benefits
      - 20% discount on room rates
      - Guaranteed early check-in and late check-out
      - €250 hotel credit per stay
      - Complimentary airport transfers
      - Annual complimentary weekend stay (2 nights)
      - Dedicated concierge service
      - Exclusive experiences at each property
      
      ## How to Join
      
      To become a member of CinCin Circle, please complete the membership application form below. Our team will review your application and contact you within 48 hours.
      
      ## Terms and Conditions
      
      - Membership is valid for one year from the date of activation
      - Benefits cannot be combined with other promotions or offers
      - Membership is personal and non-transferable
      - A minimum stay may be required for certain benefits
      - Blackout dates may apply for complimentary stays
      
      For further information about CinCin Circle, please contact membership@cincinhotels.com.
    `,
    featured_image: {
      id: 'membership-page-image',
      title: 'CinCin Circle Membership',
      description: 'Elegant seating area representing exclusive membership benefits',
      width: 1600,
      height: 900
    },
    template: 'landing',
    meta_title: 'CinCin Circle Membership | Exclusive Benefits & Privileges',
    meta_description: "Join CinCin Circle, our exclusive membership program offering premium benefits, personalized service, and special privileges across our luxury hotel collection.",
    show_in_navigation: true,
    sort: 5,
    date_created: '2022-03-15T13:30:00Z',
    date_updated: '2023-07-10T11:45:00Z'
  },
  {
    id: '6',
    status: 'draft',
    title: 'Sustainability',
    slug: 'sustainability',
    content: `
      # Our Commitment to Sustainability
      
      At CinCin Hotels, we believe that luxury hospitality and environmental responsibility go hand in hand. Our sustainability approach focuses on creating exceptional experiences for our guests while preserving the natural beauty and cultural heritage of our destinations for future generations.
      
      ## Environmental Initiatives
      
      **Energy Efficiency:** All our properties implement energy-saving technologies, including LED lighting, smart climate control systems, and renewable energy sources where possible.
      
      **Water Conservation:** We employ water-saving fixtures, rainwater harvesting, and greywater recycling systems to minimize water usage while maintaining the highest standards of comfort.
      
      **Waste Reduction:** Our comprehensive waste management programs include recycling, composting, and initiatives to eliminate single-use plastics throughout our operations.
      
      ## Social Responsibility
      
      **Local Sourcing:** We prioritize locally sourced, seasonal ingredients in our restaurants, supporting regional producers and reducing food miles.
      
      **Community Engagement:** Each hotel actively participates in community initiatives, from supporting local artisans to educational partnerships and conservation projects.
      
      **Cultural Preservation:** We celebrate and preserve local culture through architecture, design, and authentic experiences that connect guests with the unique heritage of each destination.
      
      ## Certifications and Partnerships
      
      Our commitment to sustainability is reflected in various certifications and partnerships, including:
      
      - Green Key certification
      - EarthCheck membership
      - Sustainable Hospitality Alliance participation
      - Local environmental organization partnerships
      
      ## Future Goals
      
      We are continuously working to improve our sustainability performance with ambitious goals for the future:
      
      - Carbon neutrality across all properties by 2030
      - Zero waste to landfill by 2025
      - 100% renewable energy where feasible
      - Comprehensive supply chain sustainability auditing
      
      Join us on our sustainability journey as we strive to deliver exceptional hospitality experiences that respect and protect our planet.
    `,
    featured_image: {
      id: 'sustainability-page-image',
      title: 'CinCin Hotels Sustainability',
      description: 'Hotel green roof and solar panels representing environmental commitment',
      width: 1600,
      height: 900
    },
    template: 'default',
    meta_title: 'Sustainability | CinCin Hotels Environmental Commitment',
    meta_description: "Learn about CinCin Hotels' sustainability initiatives, including environmental conservation, social responsibility, and our goals for a more sustainable future.",
    show_in_navigation: false,
    sort: 6,
    date_created: '2023-01-20T14:15:00Z',
    date_updated: '2023-01-20T14:15:00Z'
  },
  {
    id: '7',
    status: 'published',
    title: 'FAQ',
    slug: 'faq',
    content: `
      # Frequently Asked Questions
      
      ## Reservations & Booking
      
      **Q: How can I make a reservation at a CinCin hotel?**  
      A: Reservations can be made directly through our website, by contacting our reservation team at reservations@cincinhotels.com, or by calling +41 44 123 4568. You can also book through your preferred travel agent or select online travel platforms.
      
      **Q: What is your cancellation policy?**  
      A: Cancellation policies vary by hotel and rate type. The specific policy for your reservation will be clearly communicated during the booking process and in your confirmation email. Generally, most reservations can be cancelled without penalty up to 48-72 hours before arrival.
      
      **Q: Do you offer special rates for extended stays?**  
      A: Yes, many of our hotels offer preferential rates for stays of 7 nights or longer. Please contact our reservations team for details on extended stay packages.
      
      ## Services & Amenities
      
      **Q: Do all your hotels have spa facilities?**  
      A: While most of our hotels feature spa and wellness facilities, the specific offerings vary by property. Please check the individual hotel page for detailed information about available spa services.
      
      **Q: Are pets allowed at CinCin Hotels?**  
      A: Pet policies vary by hotel. Many of our properties are pet-friendly and offer special amenities for your four-legged companions. Please check the individual hotel page or contact the hotel directly for their specific pet policy.
      
      **Q: Do you offer airport transfers?**  
      A: Yes, airport transfers can be arranged for most of our hotels. Please contact the hotel concierge at least 48 hours before your arrival to arrange this service.
      
      ## CinCin Circle Membership
      
      **Q: What is CinCin Circle?**  
      A: CinCin Circle is our exclusive membership program that offers preferential rates, room upgrades, special amenities, and personalized service across our collection of hotels. There are three membership tiers: Silver, Gold, and Platinum.
      
      **Q: How do I become a member?**  
      A: You can apply for membership through our website or by contacting our membership team at membership@cincinhotels.com. Applications are reviewed within 48 hours.
      
      **Q: Are there any blackout dates for membership benefits?**  
      A: Some benefits, such as complimentary stays and guaranteed upgrades, may have blackout dates during peak periods. These dates vary by hotel and will be communicated to members in advance.
    `,
    featured_image: null,
    template: 'sidebar',
    meta_title: 'Frequently Asked Questions | CinCin Hotels',
    meta_description: "Find answers to common questions about CinCin Hotels, including booking information, hotel amenities, and our membership program.",
    show_in_navigation: true,
    sort: 7,
    date_created: '2023-02-15T10:30:00Z',
    date_updated: '2023-07-12T16:20:00Z'
  }
];

export default mockPages;