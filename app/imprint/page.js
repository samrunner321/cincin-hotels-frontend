import PageHero from '../../components/common/PageHero';
import ContentBlock from '../../components/common/ContentBlock';
import Link from 'next/link';

export const metadata = {
  title: 'Imprint | CinCin Hotels',
  description: 'Legal information about CinCin Hotels GmbH according to German law.',
};

export default function ImprintPage() {
  return (
    <main className="bg-white">
      <PageHero 
        title="Imprint / Impressum" 
        subtitle="Legal information according to § 5 TMG"
        backgroundImage="/images/hotels/hotel-2.jpg"
        overlayOpacity={70}
      />
      
      <ContentBlock>
        <div className="prose prose-lg max-w-none">
          <h2>Information According to § 5, German Telemedia Act (TMG)</h2>
          <p>
            CinCin Hotels GmbH<br />
            Torstraße 135<br />
            10119 Berlin<br />
            Germany
          </p>
          
          <h3>Commercial Register</h3>
          <p>
            Registered at the District Court of Berlin-Charlottenburg<br />
            Registration Number: HRB 123456
          </p>
          
          <h3>VAT Identification Number</h3>
          <p>
            VAT ID according to § 27a, German Value Added Tax Act: DE123456789
          </p>
          
          <h3>Represented by</h3>
          <p>
            Samuel Renner, Managing Director
          </p>
          
          <h2>Contact</h2>
          <p>
            Phone: +49 30 1234 5678<br />
            Email: info@cincinhotels.com
          </p>
          
          <h2>Responsible for Content According to § 55, Paragraph 2 RStV</h2>
          <p>
            Samuel Renner<br />
            CinCin Hotels GmbH<br />
            Torstraße 135<br />
            10119 Berlin<br />
            Germany
          </p>
          
          <h2>EU Dispute Resolution</h2>
          <p>
            The European Commission provides a platform for online dispute resolution (OS): <a href="https://ec.europa.eu/consumers/odr/" target="_blank" rel="noopener noreferrer">https://ec.europa.eu/consumers/odr/</a>
          </p>
          <p>
            Our email address can be found in the imprint above.
          </p>
          
          <h2>Consumer Dispute Resolution/Universal Dispute Resolution Board</h2>
          <p>
            We are not willing or obliged to participate in dispute resolution proceedings before a consumer arbitration board.
          </p>
          
          <h2>Liability for Content</h2>
          <p>
            As a service provider, we are responsible for our own content on these pages according to § 7, Paragraph 1 of the German Telemedia Act (TMG). According to §§ 8 to 10 TMG, however, we are not obliged to monitor transmitted or stored third-party information or to investigate circumstances that indicate illegal activity.
          </p>
          <p>
            Obligations to remove or block the use of information according to general laws remain unaffected. However, liability in this regard is only possible from the time of knowledge of a specific legal violation. Upon becoming aware of corresponding legal violations, we will remove this content immediately.
          </p>
          
          <h2>Liability for Links</h2>
          <p>
            Our offer contains links to external websites of third parties, on whose contents we have no influence. Therefore, we cannot assume any liability for these external contents. The respective provider or operator of the pages is always responsible for the content of the linked pages. The linked pages were checked for possible legal violations at the time of linking. Illegal contents were not recognizable at the time of linking.
          </p>
          <p>
            However, permanent monitoring of the content of the linked pages is not reasonable without concrete evidence of a violation. Upon becoming aware of legal violations, we will remove such links immediately.
          </p>
          
          <h2>Copyright</h2>
          <p>
            The content and works created by the site operators on these pages are subject to German copyright law. The reproduction, editing, distribution, and any kind of utilization outside the limits of copyright law require the written consent of the respective author or creator. Downloads and copies of this site are only permitted for private, non-commercial use.
          </p>
          <p>
            Insofar as the content on this site was not created by the operator, the copyrights of third parties are respected. In particular, third-party content is marked as such. Should you nevertheless become aware of a copyright infringement, please inform us accordingly. Upon becoming aware of legal violations, we will remove such content immediately.
          </p>
          
          <div className="mt-8 flex gap-4">
            <Link href="/terms" className="text-black hover:underline">
              Terms & Conditions
            </Link>
            <Link href="/privacy" className="text-black hover:underline">
              Privacy Policy
            </Link>
          </div>
        </div>
      </ContentBlock>
    </main>
  );
}