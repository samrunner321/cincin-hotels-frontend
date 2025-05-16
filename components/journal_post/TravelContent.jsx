'use client';

import Image from 'next/image';

export default function TravelContent({
  mainImage = "/images/journal/journal-1.png",
  secondaryImage = "/images/journal/journal-2.png",
  tertiaryImage = "/images/journal/journal-3.png",
  mainContent = "Zermatt is a world-class skiing destination with over 360 kilometers of slopes. The car-free village retains its traditional alpine charm while offering modern amenities and luxury accommodations. Whether you're an experienced skier or a beginner, there are slopes for every level of expertise. The pristine snow and well-maintained pistes make it a favorite among winter sports enthusiasts from around the globe.",
  secondaryContent = "The Gornergrat Railway takes you to 3,089 meters above sea level, offering one of the most spectacular mountain panoramas in Switzerland. From the observation platform, you can enjoy views of the Matterhorn, Monte Rosa massif, and more than 20 other 4,000-meter peaks. The railway itself is an engineering marvel, operating since 1898 as the world's first fully electrified cog railway."
}) {
  return (
    <section className="py-12 md:py-16 bg-white">
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <div className="space-y-6">
            <Image 
              src={mainImage} 
              alt="Zermatt landscape" 
              width={583} 
              height={719}
              className="w-full h-auto rounded-lg"
            />
            <div className="text-gray-700">
              <p>{mainContent}</p>
            </div>
          </div>
          
          <div className="space-y-6">
            <Image 
              src={secondaryImage} 
              alt="Gornergrat Railway" 
              width={583} 
              height={385}
              className="w-full h-auto rounded-lg"
            />
            <div className="text-gray-700">
              <p>{secondaryContent}</p>
            </div>
            
            <div className="hidden md:block">
              <Image 
                src={tertiaryImage} 
                alt="Zermatt view" 
                width={583} 
                height={362}
                className="w-full h-auto rounded-lg"
              />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}