# CinCin Hotels - Next.js Frontend

This repository contains the Next.js frontend for CinCin Hotels, a curated collection of luxury accommodations. This project is part of a migration from WordPress/Elementor to Next.js with Directus as the headless CMS.

## Features

- Built with Next.js 14 using the App Router for advanced routing capabilities
- Responsive design with Tailwind CSS for a mobile-first approach
- Optimized images with Next.js Image component
- Smooth animations and transitions with Framer Motion
- SEO-friendly with meta tags and structured data
- Incremental Static Regeneration (ISR) for optimal performance

## Tech Stack

- **Framework**: Next.js 14
- **Styling**: Tailwind CSS
- **Animations**: Framer Motion
- **Data Fetching**: Server Components with async/await
- **Deployment**: Vercel (recommended)

## Getting Started

### Prerequisites

- Node.js 18.17 or later
- npm or yarn

### Installation

1. Clone this repository:
   ```bash
   git clone https://github.com/yourusername/cincinhotels.git
   cd cincinhotels
   ```

2. Install dependencies:
   ```bash
   npm install
   # or
   yarn
   ```

3. Run the development server:
   ```bash
   npm run dev
   # or
   yarn dev
   ```

4. Open [http://localhost:3000](http://localhost:3000) in your browser to see the application.

## Project Structure

```
/
├── app/                   # App Router Pages and Layouts
│   ├── api/               # API Routes
│   ├── hotels/            # Hotels Pages
│   ├── journal/           # Journal Pages
│   ├── destinations/      # Destination Pages
│   ├── categories/        # Category Pages
│   └── ...                # Other Pages
├── components/            # React Components
│   ├── home/              # Homepage Components
│   ├── hotels/            # Hotel-related Components
│   ├── journal/           # Journal-related Components
│   ├── layout/            # Layout Components (Header, Footer, etc.)
│   └── ...                # Other Components
├── data/                  # Mock Data (Later to be replaced with API calls)
├── lib/                   # Utility Functions and API Calls
├── public/                # Static Assets
└── ...                    # Config Files
```

## Development Guidelines

### Styling

We use Tailwind CSS for styling. Custom styles should be added to the `globals.css` file or through Tailwind's configuration in `tailwind.config.js`.

### Component Structure

- Each component should be in its own file
- Use named exports for utilities and default exports for components
- Follow the pattern of container/presentational components where applicable

### Data Fetching

- Use Server Components for data fetching where possible
- Implement proper loading states and error handling
- Use the API functions in `lib/api.js` for data fetching

### Animations

We use Framer Motion for animations. Keep animations subtle and performant, avoiding excessive animations that might distract users.

## Deployment

The recommended deployment platform is Vercel, which offers optimal support for Next.js applications.

1. Push your code to a Git repository
2. Import the repository in Vercel
3. Configure the build settings if necessary
4. Deploy

## Future Integrations

- Directus CMS integration
- Authentication system
- Booking functionality
- Multi-language support
- Enhanced search capabilities

## License

This project is proprietary and confidential.

## Contact

For any questions or concerns, please contact [your-email@example.com](mailto:your-email@example.com).