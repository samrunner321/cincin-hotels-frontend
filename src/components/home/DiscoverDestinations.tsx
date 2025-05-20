import React from 'react';
import Link from 'next/link';

export default function DiscoverDestinations() {
  return (
    <section className="py-20 md:py-24">
      <div className="container mx-auto px-4">
        <h4 className="text-2xl md:text-3xl font-medium leading-relaxed text-gray-800 max-w-4xl mx-auto text-center">
          Discover a world of extraordinary <Link href="/destinations" className="underline decoration-1 underline-offset-4 hover:decoration-2">destinations</Link>, where every handpicked property offers a unique blend of charm, style, and authenticity.
        </h4>
      </div>
    </section>
  );
}