import PageHero from '../../components/common/PageHero';
import ContentBlock from '../../components/common/ContentBlock';
import Link from 'next/link';

export const metadata = {
  title: 'Terms & Conditions | CinCin Hotels',
  description: 'Terms and conditions for the use of CinCin Hotels services.',
};

export default function TermsPage() {
  return (
    <main className="bg-white">
      <PageHero 
        title="Terms & Conditions" 
        subtitle="Last updated: September 1, 2023"
        backgroundImage="/images/hotels/hotel-6.jpg"
        overlayOpacity={70}
      />
      
      <ContentBlock>
        <div className="prose prose-lg max-w-none">
          <p>
            Welcome to CinCin Hotels. These Terms and Conditions govern your use of the CinCin Hotels website, mobile applications, and services. By accessing or using our services, you agree to be bound by these Terms and Conditions.
          </p>
          
          <h2>1. Definitions</h2>
          <p>
            "CinCin Hotels," "we," "us," and "our" refer to CinCin Hotels GmbH, a company registered in Germany.
          </p>
          <p>
            "Services" refers to the CinCin Hotels website, mobile applications, booking platform, and related services.
          </p>
          <p>
            "User," "you," and "your" refer to the individual or entity accessing or using our Services.
          </p>
          <p>
            "Hotel Partner" refers to hotels, accommodations, or properties listed on our platform.
          </p>
          
          <h2>2. Use of Our Services</h2>
          <h3>2.1 Eligibility</h3>
          <p>
            You must be at least 18 years old to use our Services. By using our Services, you represent and warrant that you meet this requirement.
          </p>
          
          <h3>2.2 Account Registration</h3>
          <p>
            You may need to create an account to access certain features of our Services. You are responsible for maintaining the confidentiality of your account credentials and for all activities that occur under your account.
          </p>
          
          <h3>2.3 Prohibited Activities</h3>
          <p>
            You agree not to:
          </p>
          <ul>
            <li>Use our Services in any way that violates applicable laws or regulations</li>
            <li>Interfere with or disrupt the operation of our Services</li>
            <li>Attempt to gain unauthorized access to any part of our Services</li>
            <li>Use our Services to transmit harmful code or malware</li>
            <li>Scrape, data mine, or otherwise extract data from our Services without our consent</li>
            <li>Use our Services to send unsolicited communications</li>
          </ul>
          
          <h2>3. Bookings and Reservations</h2>
          <h3>3.1 Booking Process</h3>
          <p>
            CinCin Hotels acts as a platform connecting users with Hotel Partners. When you make a reservation through our Services, you are entering into a contract directly with the Hotel Partner, not with CinCin Hotels.
          </p>
          
          <h3>3.2 Booking Confirmation</h3>
          <p>
            A booking is only confirmed after you receive a booking confirmation from us or the Hotel Partner. Before confirmation, room availability and rates are subject to change.
          </p>
          
          <h3>3.3 Payment</h3>
          <p>
            Payment terms vary depending on the Hotel Partner's policies. These terms will be clearly communicated during the booking process.
          </p>
          
          <h3>3.4 Cancellations and Modifications</h3>
          <p>
            Cancellation and modification policies are set by each Hotel Partner and will be displayed during the booking process. It is your responsibility to review these policies before completing a booking.
          </p>
          
          <h2>4. Content and Intellectual Property</h2>
          <h3>4.1 Our Content</h3>
          <p>
            All content on our Services, including text, graphics, logos, images, audio, video, and software, is owned by or licensed to CinCin Hotels and is protected by copyright, trademark, and other intellectual property laws.
          </p>
          
          <h3>4.2 License to Use</h3>
          <p>
            We grant you a limited, non-exclusive, non-transferable license to access and use our Services for personal, non-commercial purposes.
          </p>
          
          <h3>4.3 User Content</h3>
          <p>
            If you submit content to our Services (such as reviews or comments), you grant us a worldwide, royalty-free, perpetual, irrevocable, non-exclusive license to use, reproduce, modify, adapt, publish, translate, and distribute such content.
          </p>
          
          <h2>5. Privacy</h2>
          <p>
            Our Privacy Policy describes how we collect, use, and share your personal information. By using our Services, you consent to the data practices described in our Privacy Policy.
          </p>
          
          <h2>6. Limitation of Liability</h2>
          <p>
            To the maximum extent permitted by law, CinCin Hotels shall not be liable for any indirect, incidental, special, consequential, or punitive damages arising from your use of our Services or any bookings made through our platform.
          </p>
          <p>
            CinCin Hotels does not own or operate the hotels listed on our platform. We are not responsible for the quality, safety, suitability, or reliability of any Hotel Partner services.
          </p>
          
          <h2>7. Indemnification</h2>
          <p>
            You agree to indemnify and hold harmless CinCin Hotels and its officers, directors, employees, and agents from any claims, liabilities, damages, losses, costs, or expenses arising from your use of our Services or your violation of these Terms and Conditions.
          </p>
          
          <h2>8. Modifications to the Terms and Services</h2>
          <p>
            We may modify these Terms and Conditions at any time by posting the revised terms on our website. Your continued use of our Services after such changes constitutes your acceptance of the revised terms.
          </p>
          <p>
            We may also modify, suspend, or discontinue any aspect of our Services at any time without notice or liability.
          </p>
          
          <h2>9. Governing Law and Jurisdiction</h2>
          <p>
            These Terms and Conditions shall be governed by and construed in accordance with the laws of Germany. Any disputes arising under these terms shall be subject to the exclusive jurisdiction of the courts of Berlin, Germany.
          </p>
          
          <h2>10. Contact Information</h2>
          <p>
            If you have any questions about these Terms and Conditions, please contact us at:
          </p>
          <p>
            CinCin Hotels GmbH<br />
            Torstraße 135<br />
            10119 Berlin<br />
            Germany<br />
            Email: legal@cincinhotels.com
          </p>
          
          <div className="mt-8 flex gap-4">
            <Link href="/privacy" className="text-black hover:underline">
              Privacy Policy
            </Link>
            <Link href="/cookies" className="text-black hover:underline">
              Cookie Policy
            </Link>
          </div>
        </div>
      </ContentBlock>
    </main>
  );
}