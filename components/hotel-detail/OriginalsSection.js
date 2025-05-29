'use client';

export default function OriginalsSection({ 
  name = "The Originals: Vangelis, Panos, Markos, and Marios Daktylides",
  description = "Vangelis, Panos, Markos, and Marios Daktylides honor their Mykonian roots at Avaton, blending heritage with luxurious growth.",
  image = "/images/hotels/hotel-7.jpg"
}) {
  return (
    <section id="originals" className="py-16 bg-gray-50">
      <div className="max-w-[1380px] mx-auto px-4 py-12">
        {/* Section Header */}
        <h2 className="text-3xl font-light text-center mb-2">The Originals</h2>
        <div className="w-16 h-0.5 bg-[#93A27F] mx-auto mb-8"></div>
        
        {/* Two Column Layout */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-x-12 gap-y-4 items-center">
          {/* Image Column */}
          <div className="h-[272px] w-[70%] ml-auto rounded-lg overflow-hidden">
            <img 
              src={image}
              alt={name}
              className="w-full h-full object-cover hover:scale-105 transition-transform duration-300"
            />
          </div>
          
          {/* Text Column */}
          <div className="space-y-4 mr-auto w-[70%]">
            <h3 className="text-xl font-light mb-2">{name}</h3>
            <div 
              className="text-gray-700 leading-relaxed text-sm mb-4 prose prose-sm max-w-none [&>p]:mb-3"
              dangerouslySetInnerHTML={{ __html: description }}
            />
            
            <a href="#" className="inline-flex items-center text-[#93A27F] hover:text-[#7d8a6b] transition text-sm">
              <span className="mr-2">Read more about The Originals</span>
              <svg width="25" height="9" viewBox="0 0 25 9" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M24.3536 4.85355C24.5488 4.65829 24.5488 4.34171 24.3536 4.14645L21.1716 0.964466C20.9763 0.769204 20.6597 0.769204 20.4645 0.964466C20.2692 1.15973 20.2692 1.47631 20.4645 1.67157L23.2929 4.5L20.4645 7.32843C20.2692 7.52369 20.2692 7.84027 20.4645 8.03553C20.6597 8.2308 20.9763 8.2308 21.1716 8.03553L24.3536 4.85355ZM0 5H24V4H0V5Z" fill="currentColor"/>
              </svg>
            </a>
          </div>
        </div>
      </div>
    </section>
  );
}