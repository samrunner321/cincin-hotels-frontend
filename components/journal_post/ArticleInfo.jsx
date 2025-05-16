'use client';

import Image from 'next/image';

export default function ArticleInfo({ 
  authorName = "Samuel Renner",
  date = "12/02/2025",
  title = "Discover the Magic of Zermatt",
  content = "Surrounded by some of the highest peaks in the Alps, Zermatt is a paradise for outdoor enthusiasts and nature lovers alike.",
  leftImage = "/images/journal/journal-1.png",
  rightImage = "/images/journal/journal-2.png"
}) {
  return (
    <section className="py-12 md:py-16 bg-white">
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <div>
            <Image 
              src={leftImage} 
              alt="Article visual" 
              width={559} 
              height={812}
              className="w-full h-auto rounded-md object-cover"
              priority
            />
            
            <div className="block md:hidden mt-6">
              <Image 
                src={rightImage} 
                alt="Additional visual" 
                width={596} 
                height={381}
                className="w-full h-auto rounded-md"
              />
            </div>
          </div>
          
          <div className="space-y-6">
            <div className="flex flex-wrap text-sm text-gray-600">
              <div className="mr-8">
                <strong>Story</strong> {authorName}
              </div>
              <div>
                Date {date}
              </div>
            </div>
            
            <h2 className="text-2xl md:text-3xl font-semibold">{title}</h2>
            
            <div className="text-gray-700">
              <p>{content}</p>
            </div>
            
            <div className="hidden md:block">
              <Image 
                src={rightImage} 
                alt="Additional visual" 
                width={596} 
                height={381}
                className="w-full h-auto rounded-md"
              />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}