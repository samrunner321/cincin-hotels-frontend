'use client';

export default function InsideHotel({ articles = [], hotelName = '' }) {
  if (!articles || articles.length === 0) {
    return (
      <section id="inside" className="py-16 bg-white">
        <div className="max-w-[1380px] mx-auto px-4">
          <h2 className="text-3xl font-light mb-2">Inside {hotelName}</h2>
          <div className="w-24 h-0.5 bg-[#93A27F] mb-12"></div>
          <p className="text-center text-gray-500">No articles available</p>
        </div>
      </section>
    );
  }

  return (
    <section id="inside" className="py-16 bg-white">
      <div className="max-w-[1380px] mx-auto px-4 py-12">
        {/* Section Header */}
        <h2 className="text-3xl font-light mb-2">Inside {hotelName}</h2>
        <div className="w-24 h-0.5 bg-[#93A27F] mb-12"></div>
        
        {/* Grid Container - Single grid for all articles */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-x-16 gap-y-16">
          {articles.map((article, index) => (
            <div 
              key={article.id} 
              className={`space-y-4 max-w-[567px] mx-auto lg:mx-0 ${
                index % 2 === 1 
                  ? 'lg:flex lg:flex-col-reverse lg:space-y-reverse lg:space-y-4' 
                  : ''
              }`}
            >
              {/* Image */}
              <div className="h-[400px] rounded-lg overflow-hidden">
                <img 
                  src={article.image} 
                  alt={article.title}
                  className="w-full h-full object-cover hover:scale-105 transition-transform duration-300"
                />
              </div>
              
              {/* Text Content - constrained to image width */}
              <div className={index % 2 === 1 ? 'lg:mb-4' : ''}>
                <h3 className="text-xl font-bold mb-2">{article.title}</h3>
                {article.subtitle && (
                  <p className="text-gray-600 text-sm mb-3 leading-relaxed">{article.subtitle}</p>
                )}
                {article.content.includes('<p>') || article.content.includes('<br') ? (
                  <div 
                    className="text-gray-700 leading-relaxed prose prose-sm max-w-none [&>p]:mb-3"
                    dangerouslySetInnerHTML={{ __html: article.content }}
                  />
                ) : (
                  <div className="text-gray-700 leading-relaxed space-y-3">
                    {article.content.split('\n\n').map((paragraph, pIndex) => (
                      <p key={pIndex} className="text-sm">
                        {paragraph}
                      </p>
                    ))}
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}