'use client';

import Image from 'next/image';
import Link from 'next/link';
import { useState, useEffect } from 'react';

export default function SimpleJournalArticle({ params }) {
  const [scrollProgress, setScrollProgress] = useState(0);
  
  useEffect(() => {
    const handleScroll = () => {
      const windowHeight = window.innerHeight;
      const fullHeight = document.body.clientHeight - windowHeight;
      const scrolled = window.scrollY;
      setScrollProgress(Math.min((scrolled / fullHeight) * 100, 100));
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Beispiel-Artikel - normalerweise würde dies aus der Datenbank kommen
  const article = {
    title: "Nachhaltiger Luxus: Die Zukunft der Alpinen Hotellerie",
    subtitle: "Eine neue Generation von Hoteliers definiert Luxus neu",
    excerpt: "Wie innovative Berghotels Umweltschutz und erstklassigen Service zu einer neuen Form des bewussten Reisens verbinden.",
    author: {
      name: "Maria Schneider",
      role: "Reisejournalistin & Nachhaltigkeitsexpertin",
      image: "/images/authors/default.jpg"
    },
    date: "2024-02-15",
    readTime: "7 Min. Lesezeit",
    heroImage: "/images/journal/journal-1.png",
    categories: ["Nachhaltigkeit", "Luxus", "Alpen"],
    content: {
      intro: `In den majestätischen Höhen der Alpen vollzieht sich eine stille Revolution. Eine neue Generation von Hoteliers beweist, dass exklusiver Luxus und nachhaltiges Wirtschaften keine Gegensätze sein müssen. Im Gegenteil: Sie verschmelzen zu einer neuen Form des bewussten Reisens, die anspruchsvolle Gäste weltweit begeistert.`,
      
      sections: [
        {
          title: "Die Pioniere des Wandels",
          content: `Hotels wie das Forestis in Südtirol oder das Whitepod in den Schweizer Alpen haben erkannt, dass moderne Reisende mehr suchen als nur opulente Ausstattung. Sie sehnen sich nach authentischen Erlebnissen, die im Einklang mit der Natur stehen. Diese Vorreiter haben verstanden, dass wahre Exklusivität heute bedeutet, seinen Gästen einzigartige Naturerfahrungen zu bieten, ohne dabei ökologische Fußabdrücke zu hinterlassen.`,
          image: "/images/journal/journal-2.png"
        },
        {
          title: "Architektur im Dialog mit der Landschaft",
          content: `Die neue alpine Architektur spricht eine klare Sprache: Statt die Natur zu dominieren, fügt sie sich harmonisch in die Landschaft ein. Lokale Materialien wie Lärchenholz und regionaler Stein prägen die Ästhetik. Große Panoramafenster rahmen die Bergwelt wie lebendige Kunstwerke. Diese Bauweise ist nicht nur ästhetisch überzeugend, sondern auch energetisch durchdacht. Passive Solarnutzung, hocheffiziente Dämmung und geothermische Heizsysteme machen viele dieser Hotels nahezu energieautark.`,
          quote: {
            text: "Luxus bedeutet heute, im Einklang mit der Natur zu leben, ohne auf Komfort verzichten zu müssen.",
            author: "Peter Schgaguler, Hotelier"
          }
        },
        {
          title: "Kulinarik mit Terroir",
          content: `In den Küchen dieser Hotels entstehen kulinarische Meisterwerke aus dem, was die Region hergibt. Sterneköche arbeiten Hand in Hand mit lokalen Bauern, Jägern und Sammlern. Alte Alpenkräuter werden wiederentdeckt, vergessene Gemüsesorten kultiviert. Diese "Radius-Küche" – oft beschränkt auf Zutaten aus maximal 50 Kilometern Entfernung – schafft nicht nur unvergleichliche Geschmackserlebnisse, sondern stärkt auch die regionale Wirtschaft und reduziert Transportemissionen.`
        },
        {
          title: "Wellness neu gedacht",
          content: `Auch im Spa-Bereich zeigt sich der Paradigmenwechsel. Statt importierter Luxusprodukte setzen innovative Hotels auf die Heilkraft der Alpen. Heubäder mit Bergwiesenkräutern, Molkeanwendungen von glücklichen Almkühen, Steinölmassagen mit jahrmillionenalten Schieferölen – diese authentischen Treatments verbinden Tradition mit modernster Wellness-Expertise.`,
          image: "/images/journal/journal-3.png"
        },
        {
          title: "Die Zukunft ist regenerativ",
          content: `Die Visionäre der Branche gehen noch einen Schritt weiter: Sie wollen nicht nur nachhaltig sein, sondern regenerativ wirken. Hotels werden zu Biotopen, die mehr Artenvielfalt schaffen als zuvor existierte. Dächer werden zu Wildblumenwiesen, Fassaden zu vertikalen Gärten. Gäste werden Teil dieser Mission – durch Baumpflanzaktionen, Biotoppflege oder die Unterstützung lokaler Naturschutzprojekte.`
        }
      ],
      
      conclusion: `Diese neue Form des alpinen Luxus zeigt: Exklusivität im 21. Jahrhundert definiert sich nicht mehr über Verschwendung, sondern über Verantwortung. Hotels, die diesen Weg gehen, bieten ihren Gästen etwas, das mit Geld allein nicht zu kaufen ist: das gute Gefühl, Teil einer positiven Veränderung zu sein. In einer Welt, die nach Lösungen für die Klimakrise sucht, weisen diese Häuser den Weg in eine Zukunft, in der Reisen nicht nur den Reisenden bereichert, sondern auch die bereisten Orte.`
    },
    relatedArticles: [
      { title: "Die Renaissance der Thermalkultur", slug: "renaissance-thermalkultur-europa" },
      { title: "Kulinarische Höhenflüge", slug: "kulinarische-hoehenfluege-sternekueche" }
    ]
  };

  return (
    <article className="min-h-screen bg-white">
      {/* Progress Bar */}
      <div className="fixed top-0 left-0 w-full h-1 bg-gray-200 z-50">
        <div 
          className="h-full bg-black transition-all duration-300"
          style={{ width: `${scrollProgress}%` }}
        />
      </div>

      {/* Hero Section */}
      <div className="relative h-[85vh] overflow-hidden">
        <Image
          src={article.heroImage}
          alt={article.title}
          fill
          className="object-cover"
          priority
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/30 to-transparent"></div>
        
        <div className="absolute bottom-0 left-0 right-0 p-8 md:p-16">
          <div className="max-w-5xl mx-auto">
            <div className="flex gap-3 mb-6">
              {article.categories.map((cat, idx) => (
                <span key={idx} className="px-3 py-1 bg-white/20 backdrop-blur-sm rounded-full text-white text-sm">
                  {cat}
                </span>
              ))}
            </div>
            <h1 className="text-4xl md:text-6xl lg:text-7xl font-light text-white mb-6 leading-tight">
              {article.title}
            </h1>
            <p className="text-xl md:text-2xl text-white/90 mb-8 max-w-3xl">
              {article.subtitle}
            </p>
            <div className="flex items-center gap-6 text-white/80">
              <span>{article.author.name}</span>
              <span>•</span>
              <span>{new Date(article.date).toLocaleDateString('de-DE', {
                day: 'numeric',
                month: 'long',
                year: 'numeric'
              })}</span>
              <span>•</span>
              <span>{article.readTime}</span>
            </div>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="max-w-4xl mx-auto px-4 py-16">
        {/* Intro */}
        <p className="text-xl md:text-2xl leading-relaxed text-gray-800 mb-12 first-letter:text-6xl first-letter:font-bold first-letter:float-left first-letter:mr-3">
          {article.content.intro}
        </p>

        {/* Sections */}
        {article.content.sections.map((section, idx) => (
          <div key={idx} className="mb-16">
            <h2 className="text-3xl font-light mb-6">{section.title}</h2>
            <p className="text-lg leading-relaxed text-gray-700 mb-8">
              {section.content}
            </p>
            
            {section.image && (
              <div className="relative aspect-[16/9] mb-8 rounded-lg overflow-hidden">
                <Image
                  src={section.image}
                  alt={section.title}
                  fill
                  className="object-cover"
                />
              </div>
            )}
            
            {section.quote && (
              <blockquote className="border-l-4 border-gray-300 pl-6 py-4 my-8">
                <p className="text-xl italic text-gray-700 mb-2">
                  "{section.quote.text}"
                </p>
                <cite className="text-sm text-gray-500">— {section.quote.author}</cite>
              </blockquote>
            )}
          </div>
        ))}

        {/* Conclusion */}
        <div className="border-t border-gray-200 pt-12 mt-16">
          <p className="text-lg leading-relaxed text-gray-700">
            {article.content.conclusion}
          </p>
        </div>

        {/* Author Info */}
        <div className="mt-16 p-8 bg-gray-50 rounded-lg">
          <div className="flex items-start gap-6">
            <div className="w-20 h-20 rounded-full bg-gray-300 flex-shrink-0">
              <Image
                src={article.author.image}
                alt={article.author.name}
                width={80}
                height={80}
                className="rounded-full"
              />
            </div>
            <div>
              <h3 className="text-xl font-semibold mb-1">{article.author.name}</h3>
              <p className="text-gray-600 mb-3">{article.author.role}</p>
              <p className="text-gray-700">
                Spezialisiert auf nachhaltigen Tourismus und alpine Kultur. 
                Schreibt regelmäßig für führende Reisemagazine über innovative Hotelkonzepte.
              </p>
            </div>
          </div>
        </div>

        {/* Related Articles */}
        <div className="mt-16">
          <h3 className="text-2xl font-light mb-6">Weitere Artikel</h3>
          <div className="grid md:grid-cols-2 gap-6">
            {article.relatedArticles.map((related, idx) => (
              <Link 
                key={idx}
                href={`/de/simple-journal/${related.slug}`}
                className="block p-6 border border-gray-200 rounded-lg hover:border-gray-300 transition-colors"
              >
                <h4 className="text-lg font-medium mb-2">{related.title}</h4>
                <span className="text-sm text-gray-500">Weiterlesen →</span>
              </Link>
            ))}
          </div>
        </div>
      </div>
    </article>
  );
}