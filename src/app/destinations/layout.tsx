import { Metadata } from 'next';

export const metadata: Metadata = {
  title: {
    template: '%s | CinCin Hotels & Resorts',
    default: 'Destinations | CinCin Hotels & Resorts',
  },
  description: 'Discover exceptional destinations with CinCin Hotels & Resorts',
};

export default function DestinationsLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="min-h-screen bg-gray-50">
      {children}
    </div>
  );
}