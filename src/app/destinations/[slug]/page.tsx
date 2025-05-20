import { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { loadDestination, loadDestinationSlugs, REVALIDATE } from '../../../lib/dataLoaders';
import DestinationDetailPage from '../../../components/destinations/DestinationDetailPage';

export const revalidate = REVALIDATE.DESTINATION;

type Params = {
  params: {
    slug: string;
  };
};

export async function generateMetadata({ params }: Params): Promise<Metadata> {
  const { slug } = params;
  const destination = await loadDestination(slug);

  if (!destination) {
    return {
      title: 'Destination Not Found | CinCin Hotels & Resorts',
    };
  }

  return {
    title: `${destination.name} | CinCin Hotels & Resorts`,
    description: destination.short_description,
    openGraph: {
      title: destination.meta_title || destination.name,
      description: destination.meta_description || destination.short_description,
      type: 'website',
    },
  };
}

export async function generateStaticParams() {
  const slugs = await loadDestinationSlugs();
  
  return slugs.map(slug => ({
    slug,
  }));
}

export default async function DestinationPage({ params }: Params) {
  const { slug } = params;
  const destination = await loadDestination(slug);

  if (!destination) {
    notFound();
  }

  return <DestinationDetailPage destination={destination} />;
}