'use client';

import Image from 'next/image';
import Link from 'next/link';

export default function JournalSection({
  title = "Journal",
  categories = ["Stories", "People", "Trends"],
  articles = [
    {
      id: 1,
      title: "Where Spring's the Thing",
      category: "Destinations",
      excerpt: "In Edinburgh, Provence, and beyond, we have unearthed spots where spring's bloom is truly glorious.",
      image: "/images/journal-1.png",
      url: "/journal/where-springs-the-thing"
    },
    {
      id: 2,
      title: "A Design Guide to Istanbul",
      category: "Design",
      excerpt: "Two insiders share why Istanbul has become a top destination for contemporary art and design.",
      image: "/images/journal-2.png",
      url: "/journal/design-guide-istanbul"
    },
    {
      id: 3,
      title: "Edinburgh Views",
      category: "Destinations",
      excerpt: "Discover the breathtaking views of Edinburgh's historic skyline and architectural masterpieces.",
      image: "/images/journal-3.png",
      url: "/journal/edinburgh-views"
    }
  ]
}) {
  return (
    <section className="py-12 md:py-16">
      <div className="mx-auto px-4 sm:px-6 lg:px-8 max-w-[1536px]">
        <div className="grid grid-cols-1 md:grid-cols-12 gap-8">
          {/* Left Column */}
          <div className="md:col-span-6">
            <h2 className="text-3xl font-normal mb-4 font-brooklyn">{title}</h2>
            
            {/* Categories */}
            <div className="flex gap-6 mb-8">
              {categories.map((category, index) => (
                <Link 
                  key={index}
                  href={`/journal/category/${category.toLowerCase()}`}
                  className={`${index === 0 ? 'underline underline-offset-4 text-brand-olive-400' : 'hover:underline hover:underline-offset-4 hover:text-brand-olive-400'} transition-all font-brooklyn`}
                >
                  {category}
                </Link>
              ))}
            </div>
            
            {/* Articles Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-x-6 gap-y-10">
              {articles.slice(0, 2).map((article) => (
                <div key={article.id} className="flex flex-col">
                  <Link href={article.url} className="group block overflow-hidden mb-4 rounded-xl">
                    <Image
                      src={article.image}
                      alt={article.title}
                      width={400}
                      height={300}
                      className="w-full h-auto transition-transform duration-500 group-hover:scale-105"
                    />
                  </Link>
                  <div className="text-sm mb-1 text-brand-olive-400 font-brooklyn">{article.category}</div>
                  <h3 className="text-xl font-normal mb-2 font-brooklyn">
                    <Link href={article.url} className="hover:underline hover:text-brand-olive-400 transition-colors">
                      {article.title}
                    </Link>
                  </h3>
                  <p className="text-sm text-gray-700 font-brooklyn">{article.excerpt}</p>
                </div>
              ))}
            </div>
          </div>
          
          {/* Right Column - Featured Article */}
          <div className="md:col-span-6 relative flex items-center">
            <Link href={articles[2].url} className="block w-full">
              <div className="relative w-full h-[500px] rounded-xl overflow-hidden">
                <Image
                  src={articles[2].image}
                  alt={articles[2].title}
                  fill
                  className="object-cover"
                />
                <div className="absolute bottom-0 w-full flex justify-center pb-8">
                  <button className="bg-white text-black px-6 py-3 rounded-full text-sm hover:bg-brand-olive-50 hover:text-brand-olive-600 transition-colors font-brooklyn">
                    Uncover more stories
                  </button>
                </div>
              </div>
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
}