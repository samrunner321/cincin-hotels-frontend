'use client';

import { useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';

export default function SimpleJournalPage() {
  const [filter, setFilter] = useState('all');
  
  const articles = [
    {
      id: 1,
      title: "Nachhaltiger Luxus: Die Zukunft der Alpinen Hotellerie",
      slug: "nachhaltiger-luxus-alpine-hotellerie",
      excerpt: "Wie innovative Berghotels Umweltschutz und erstklassigen Service zu einer neuen Form des bewussten Reisens verbinden.",
      date: "2024-02-15",
      author: "Maria Schneider",
      categories: ["sustainability", "luxury", "alps"],
      image: "/images/journal/journal-1.png"
    },
    {
      id: 2,
      title: "Die Renaissance der Thermalkultur in Europa",
      slug: "renaissance-thermalkultur-europa",
      excerpt: "Eine Reise durch Europas historische Thermalbäder und ihre moderne Transformation zu Wellness-Oasen.",
      date: "2024-02-10",
      author: "Dr. Thomas Weber",
      categories: ["wellness", "culture", "europe"],
      image: "/images/journal/journal-2.png"
    },
    {
      id: 3,
      title: "Kulinarische Höhenflüge: Sterneküche in den Bergen",
      slug: "kulinarische-hoehenfluege-sternekueche",
      excerpt: "Wie Spitzenköche alpine Traditionen neu interpretieren und dabei nachhaltige Gastronomie auf höchstem Niveau zelebrieren.",
      date: "2024-02-05",
      author: "Sophie Laurent",
      categories: ["culinary", "fine-dining", "alps"],
      image: "/images/journal/journal-3.png"
    },
    {
      id: 4,
      title: "Architektur trifft Natur: Visionäre Hotelkonzepte",
      slug: "architektur-trifft-natur",
      excerpt: "Moderne Architektur, die sich harmonisch in die Landschaft einfügt und neue Maßstäbe für nachhaltiges Bauen setzt.",
      date: "2024-01-28",
      author: "Alessandro Rossi",
      categories: ["architecture", "design", "sustainability"],
      image: "/images/journal/journal-4.png"
    }
  ];

  const categories = [
    { id: 'all', name: 'Alle' },
    { id: 'architecture', name: 'Architektur' },
    { id: 'culinary', name: 'Kulinarik' },
    { id: 'wellness', name: 'Wellness' },
    { id: 'sustainability', name: 'Nachhaltigkeit' },
    { id: 'luxury', name: 'Luxus' }
  ];

  const filteredArticles = filter === 'all' 
    ? articles 
    : articles.filter(article => article.categories.includes(filter));

  return (
    <div className="min-h-screen bg-white">
      {/* Hero Section */}
      <div className="relative h-[60vh] bg-gray-900">
        <div className="absolute inset-0 bg-black/40"></div>
        <div className="relative h-full flex items-center justify-center text-center">
          <div className="max-w-4xl mx-auto px-4">
            <h1 className="text-5xl md:text-7xl font-light text-white mb-6">
              Journal & Stories
            </h1>
            <p className="text-xl md:text-2xl text-white/80 max-w-3xl mx-auto">
              Entdecken Sie inspirierende Geschichten, Reiseberichte und Einblicke in die Welt des gehobenen Reisens.
            </p>
          </div>
        </div>
      </div>

      {/* Filter Bar */}
      <div className="sticky top-0 bg-white border-b border-gray-200 z-30">
        <div className="container mx-auto px-4 py-6">
          <div className="flex flex-wrap gap-3 justify-center">
            {categories.map((category) => (
              <button
                key={category.id}
                onClick={() => setFilter(category.id)}
                className={`px-5 py-2 rounded-full text-sm font-medium transition-all duration-300 ${
                  filter === category.id
                    ? 'bg-black text-white'
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                }`}
              >
                {category.name}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Articles Grid */}
      <div className="container mx-auto px-4 py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-6xl mx-auto">
          {filteredArticles.map((article) => (
            <article 
              key={article.id} 
              className="group cursor-pointer"
            >
              <Link href={`/de/simple-journal/${article.slug}`}>
                <div className="overflow-hidden rounded-lg mb-6">
                  <div className="relative aspect-[16/10] bg-gray-200">
                    <Image
                      src={article.image}
                      alt={article.title}
                      fill
                      className="object-cover transition-transform duration-700 group-hover:scale-105"
                    />
                  </div>
                </div>
                
                <div className="space-y-3">
                  <div className="flex items-center gap-4 text-sm text-gray-500">
                    <span>{article.author}</span>
                    <span>•</span>
                    <time>{new Date(article.date).toLocaleDateString('de-DE', {
                      day: 'numeric',
                      month: 'long',
                      year: 'numeric'
                    })}</time>
                  </div>
                  
                  <h2 className="text-2xl font-light leading-tight group-hover:text-gray-600 transition-colors">
                    {article.title}
                  </h2>
                  
                  <p className="text-gray-600 leading-relaxed">
                    {article.excerpt}
                  </p>
                  
                  <div className="flex items-center text-black font-medium">
                    <span>Weiterlesen</span>
                    <svg className="w-4 h-4 ml-2 transition-transform group-hover:translate-x-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                    </svg>
                  </div>
                </div>
              </Link>
            </article>
          ))}
        </div>
      </div>

      {/* Newsletter Section */}
      <section className="bg-gray-900 text-white py-20">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-3xl font-light mb-4">Bleiben Sie inspiriert</h2>
          <p className="text-xl text-gray-300 mb-8 max-w-2xl mx-auto">
            Erhalten Sie unsere neuesten Geschichten und exklusive Reiseeinblicke direkt in Ihr Postfach.
          </p>
          <div className="max-w-md mx-auto flex flex-col sm:flex-row gap-4">
            <input
              type="email"
              placeholder="Ihre E-Mail-Adresse"
              className="flex-1 px-4 py-3 bg-white/10 border border-white/20 rounded text-white placeholder-white/60 focus:outline-none focus:border-white/40"
            />
            <button className="px-8 py-3 bg-white text-gray-900 rounded font-medium hover:bg-gray-100 transition-colors">
              Abonnieren
            </button>
          </div>
        </div>
      </section>
    </div>
  );
}