export default function JournalBasicPage() {
  const articles = [
    {
      id: '1',
      title: 'The Future of Alpine Luxury: Where Contemporary Design Meets Mountain Majesty',
      slug: 'alpine-luxury-contemporary-design',
      excerpt: 'Discover how the worlds most innovative mountain hotels are redefining luxury through bold architecture.',
      date: '2024-01-15',
      author: { name: 'Elena Papadopoulos' },
      categories: ['architecture', 'design', 'luxury']
    },
    {
      id: '2', 
      title: 'Alpine Wellness Traditions',
      slug: 'alpine-wellness-traditions',
      excerpt: 'How luxury hotels in the Alps are reviving centuries-old wellness practices.',
      date: '2023-11-15',
      author: { name: 'Sophia Müller' },
      categories: ['wellness', 'destinations']
    }
  ];

  return (
    <div className="min-h-screen bg-white">
      {/* Simple Hero */}
      <div className="bg-gray-900 text-white py-20">
        <div className="container mx-auto px-4 text-center">
          <h1 className="text-4xl md:text-6xl font-light mb-4">Journal & Stories</h1>
          <p className="text-xl text-gray-300 max-w-2xl mx-auto">
            Discover travel insights, destination guides, and behind-the-scenes stories.
          </p>
        </div>
      </div>

      {/* Articles */}
      <div className="container mx-auto px-4 py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {articles.map((article) => (
            <article key={article.id} className="border rounded-lg overflow-hidden shadow-sm hover:shadow-md transition-shadow">
              <div className="h-48 bg-gray-200"></div>
              <div className="p-6">
                <div className="flex gap-2 mb-3">
                  {article.categories.map((cat, index) => (
                    <span key={index} className="px-2 py-1 bg-gray-100 text-gray-700 text-xs rounded">
                      {cat}
                    </span>
                  ))}
                </div>
                <h2 className="text-xl font-semibold mb-3 leading-tight">
                  <a href={`/en/journal/${article.slug}`} className="hover:text-gray-600 transition-colors">
                    {article.title}
                  </a>
                </h2>
                <p className="text-gray-600 mb-4">{article.excerpt}</p>
                <div className="text-sm text-gray-500">
                  <span>{article.author.name}</span>
                  <span className="mx-2">•</span>
                  <span>{article.date}</span>
                </div>
              </div>
            </article>
          ))}
        </div>
      </div>

      {/* Simple Newsletter */}
      <div className="bg-black text-white py-20">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-3xl font-light mb-4">Stay Inspired</h2>
          <p className="text-xl text-gray-300 mb-8">
            Get our latest stories delivered to your inbox.
          </p>
          <div className="max-w-md mx-auto flex gap-4">
            <input
              type="email"
              placeholder="Your email address"
              className="flex-1 px-4 py-3 bg-white/10 border border-white/20 rounded text-white placeholder-white/60"
            />
            <button className="px-6 py-3 bg-white text-black rounded font-medium">
              Subscribe
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}