# CinCin Hotels - Next.js Frontend

This repository contains the Next.js frontend for CinCin Hotels, a curated collection of luxury accommodations. This project is part of a migration from WordPress/Elementor to Next.js with Directus as the headless CMS.

## Features

- Built with Next.js 14 using the App Router for advanced routing capabilities
- Responsive design with Tailwind CSS for a mobile-first approach
- Optimized images with Next.js Image component and DirectusImage integration
- Advanced asset management system for efficient loading and caching
- Smooth animations and transitions with Framer Motion
- SEO-friendly with meta tags and structured data
- Incremental Static Regeneration (ISR) for optimal performance

## Tech Stack

- **Framework**: Next.js 14
- **Styling**: Tailwind CSS
- **Animations**: Framer Motion
- **Data Fetching**: Server Components with async/await
- **CMS**: Directus Headless CMS
- **Deployment**: Vercel (recommended)

## Getting Started

### Prerequisites

- Node.js 18.17 or later
- npm or yarn
- Local Directus instance or Directus API access (see [Environment Variables](#environment-variables))

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

3. Set up environment variables:
   ```bash
   cp .env.local.example .env.local
   # Edit .env.local with your configuration
   ```

4. Run the development server:
   ```bash
   npm run dev
   # or
   yarn dev
   ```

5. Open [http://localhost:3000](http://localhost:3000) in your browser to see the application.

### Environment Variables

The application requires several environment variables to be set for proper functionality. Copy the `.env.local.example` file to `.env.local` and configure the following variables:

#### Required Variables

| Variable | Description | Example |
|----------|-------------|---------|
| `NEXT_PUBLIC_DIRECTUS_URL` | URL of the Directus API (client & server) | `http://localhost:8055` |
| `DIRECTUS_PUBLIC_TOKEN` | Public token for client read-only operations | `your_public_token` |
| `DIRECTUS_ADMIN_TOKEN` | Admin token for server operations (keep secure) | `your_admin_token` |

#### Optional Variables

| Variable | Description | Default |
|----------|-------------|---------|
| `IS_MOCK_SERVER` | Use mock data instead of API | `false` |
| `NEXT_PUBLIC_DEFAULT_LOCALE` | Default language | `en-US` |
| `NEXT_PUBLIC_SUPPORTED_LOCALES` | Supported languages | `en-US,de-DE` |
| `REVALIDATION_SECRET` | Secret for API revalidation | - |

#### Cache Control

| Variable | Description | Default |
|----------|-------------|---------|
| `NEXT_PUBLIC_REVALIDATE_HOTEL` | Hotel revalidation time (seconds) | `300` |
| `NEXT_PUBLIC_REVALIDATE_DESTINATION` | Destination revalidation time | `600` |
| `NEXT_PUBLIC_REVALIDATE_CATEGORY` | Category revalidation time | `1800` |
| `NEXT_PUBLIC_REVALIDATE_PAGE` | Page revalidation time | `3600` |

## Project Structure

```
/
├── app/                   # Legacy App Router (being deprecated)
│   ├── api/               # Legacy API Routes
│   └── ...                # Legacy Pages (redirecting to /src/app)
├── components/            # Legacy React Components
├── data/                  # Mock Data (Later to be replaced with API calls)
├── lib/                   # Legacy Utility Functions
├── public/                # Static Assets
├── src/                   # Main App source (preferred structure)
│   ├── app/               # App Router Pages (primary structure)
│   │   ├── api/           # API Routes
│   │   ├── hotels/        # Hotels Pages
│   │   ├── destinations/  # Destination Pages
│   │   ├── [locale]/      # Localized routes
│   │   └── ...            # Other Pages
│   ├── components/        # React Components
│   │   ├── common/        # Common Components
│   │   ├── hotels/        # Hotel-related Components
│   │   ├── layout/        # Layout Components
│   │   └── ...            # Other Components
│   └── lib/               # Utilities and API Clients
└── ...                    # Config Files
```

### App Structure Note

This project is transitioning from a dual app structure to a single app structure.
The `/src/app` directory is now the primary structure, while the `/app` directory
is being deprecated and maintained only for backward compatibility.

All new development should use the `/src/app` directory structure and import paths.

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

### Asset Management

The project includes a comprehensive asset management system:

- **AssetManager**: Context provider for asset loading, caching, and optimization
- **ResponsiveDirectusImage**: Enhanced image component with responsive support
- **AssetPreloader**: Component for preloading critical assets
- **LoadingSpinner**: Customizable loading indicator with various states

Example usage:

```jsx
import { 
  AssetManagerProvider, 
  ResponsiveDirectusImage, 
  AssetPreloader, 
  LoadingSpinner 
} from '@/components/common';

// Wrap your app or component with the AssetManagerProvider
export default function MyApp({ Component, pageProps }) {
  return (
    <AssetManagerProvider>
      <Component {...pageProps} />
    </AssetManagerProvider>
  );
}

// Use ResponsiveDirectusImage for optimized images
function HotelCard({ hotel }) {
  return (
    <div className="hotel-card">
      <ResponsiveDirectusImage 
        fileId={hotel.main_image} 
        alt={hotel.name}
        priority={true}
        showLoadingSpinner={true}
      />
      <h3>{hotel.name}</h3>
    </div>
  );
}

// Preload critical assets
function HomePage() {
  return (
    <>
      <AssetPreloader 
        assets={[
          { id: 'hero-image.jpg', type: 'image', options: { priority: true } },
          { id: 'logo.svg', type: 'image', options: { priority: true } }
        ]} 
      />
      {/* Rest of your component */}
    </>
  );
}
```

### Animations

We use Framer Motion for animations. Keep animations subtle and performant, avoiding excessive animations that might distract users.

## Deployment

The recommended deployment platform is Vercel, which offers optimal support for Next.js applications.

1. Push your code to a Git repository
2. Import the repository in Vercel
3. Configure environment variables in Vercel:
   - Add all required variables from `.env.production.example`
   - Ensure `DIRECTUS_PUBLIC_TOKEN` and `DIRECTUS_ADMIN_TOKEN` are properly set
   - Set `NEXT_PUBLIC_DIRECTUS_URL` to your production Directus instance
4. Configure the build settings if necessary
5. Deploy

## Directus Integration

The project uses Directus as the headless CMS:

- Image assets are managed through Directus and displayed using the `ResponsiveDirectusImage` component
- API requests are handled through the Directus SDK (see `src/lib/directus.ts`)
- Asset transformations use Directus' on-the-fly image transformation capabilities

### Setting up Directus

1. Ensure you have a Directus instance running (see [Directus documentation](https://docs.directus.io/getting-started/installation/))

2. Create API tokens in Directus:
   - Create a Public token with limited read-only permissions
   - Create an Admin token with elevated permissions (server-side only)

3. Add the tokens to your `.env.local` file:
   ```bash
   DIRECTUS_PUBLIC_TOKEN=your_public_token
   DIRECTUS_ADMIN_TOKEN=your_admin_token
   ```

4. Configure the Directus URL:
   ```bash
   NEXT_PUBLIC_DIRECTUS_URL=http://localhost:8055
   ```

5. For development without a Directus instance, you can enable mock mode:
   ```bash
   IS_MOCK_SERVER=true
   ```

## Future Integrations

- Full Directus CMS integration
- Authentication system
- Booking functionality
- Multi-language support
- Enhanced search capabilities
- Full asset analytics and optimization

## License

This project is proprietary and confidential.

## Contact

For any questions or concerns, please contact [your-email@example.com](mailto:your-email@example.com).