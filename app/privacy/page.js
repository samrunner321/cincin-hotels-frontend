import PageHero from '../../src/components/common/PageHero';
import ContentBlock from '../../src/components/common/ContentBlock';
import Link from 'next/link';

export const metadata = {
  title: 'Privacy Policy | CinCin Hotels',
  description: 'Learn how CinCin Hotels collects, uses, and protects your personal information.',
};

export default function PrivacyPage() {
  return (
    <main className="bg-white">
      <PageHero 
        title="Privacy Policy" 
        subtitle="Last updated: September 1, 2023"
        backgroundImage="/images/hotels/hotel-7.jpg"
        overlayOpacity={70}
      />
      
      <ContentBlock>
        <div className="prose prose-lg max-w-none">
          <p>
            At CinCin Hotels, we respect your privacy and are committed to protecting your personal data. This Privacy Policy explains how we collect, use, and safeguard your information when you use our website, mobile applications, and services.
          </p>
          
          <h2>1. Information We Collect</h2>
          <h3>1.1 Personal Data</h3>
          <p>
            We may collect the following types of personal data:
          </p>
          <ul>
            <li><strong>Identity Data:</strong> First name, last name, username or similar identifier</li>
            <li><strong>Contact Data:</strong> Email address, telephone numbers, postal address</li>
            <li><strong>Profile Data:</strong> Your preferences, feedback, and survey responses</li>
            <li><strong>Transaction Data:</strong> Details about payments to and from you and details of services you have purchased from us</li>
            <li><strong>Technical Data:</strong> Internet protocol (IP) address, browser type and version, time zone setting, browser plug-in types and versions, operating system and platform</li>
            <li><strong>Usage Data:</strong> Information about how you use our website and services</li>
          </ul>
          
          <h3>1.2 Sources of Personal Data</h3>
          <p>
            We collect personal data from the following sources:
          </p>
          <ul>
            <li>Direct interactions with you when you create an account, make a booking, or contact us</li>
            <li>Automated technologies such as cookies and similar tracking technologies</li>
            <li>Third parties, including our Hotel Partners, payment providers, and analytics providers</li>
          </ul>
          
          <h2>2. How We Use Your Information</h2>
          <p>
            We use your personal data for the following purposes:
          </p>
          <ul>
            <li>To provide and manage our services to you</li>
            <li>To process and facilitate bookings and payments</li>
            <li>To manage our relationship with you, including notifying you about changes to our terms or privacy policy</li>
            <li>To enable you to participate in features of our services</li>
            <li>To administer and protect our business and website</li>
            <li>To deliver relevant content and advertisements to you</li>
            <li>To use data analytics to improve our website, products/services, marketing, customer relationships, and experiences</li>
            <li>To make suggestions and recommendations to you about services that may be of interest to you</li>
          </ul>
          
          <h2>3. Legal Basis for Processing</h2>
          <p>
            We will only process your personal data when the law allows us to. Most commonly, we will use your personal data in the following circumstances:
          </p>
          <ul>
            <li>Where we need to perform the contract we are about to enter into or have entered into with you</li>
            <li>Where it is necessary for our legitimate interests (or those of a third party) and your interests and fundamental rights do not override those interests</li>
            <li>Where we need to comply with a legal or regulatory obligation</li>
            <li>Where you have given consent</li>
          </ul>
          
          <h2>4. Data Sharing and Transfers</h2>
          <p>
            We may share your personal data with the following categories of recipients:
          </p>
          <ul>
            <li>Hotel Partners with whom you make a booking</li>
            <li>Service providers who provide IT and system administration services</li>
            <li>Professional advisers including lawyers, bankers, auditors, and insurers</li>
            <li>Regulators and other authorities who require reporting of processing activities in certain circumstances</li>
          </ul>
          <p>
            Some of our external third parties are based outside the European Economic Area (EEA), so their processing of your personal data will involve a transfer of data outside the EEA. Whenever we transfer your personal data outside the EEA, we ensure a similar degree of protection is afforded to it by implementing appropriate safeguards.
          </p>
          
          <h2>5. Data Security</h2>
          <p>
            We have put in place appropriate security measures to prevent your personal data from being accidentally lost, used, or accessed in an unauthorized way, altered, or disclosed. We limit access to your personal data to those employees, agents, contractors, and other third parties who have a business need to know.
          </p>
          <p>
            We have procedures in place to deal with any suspected personal data breach and will notify you and any applicable regulator of a breach where we are legally required to do so.
          </p>
          
          <h2>6. Data Retention</h2>
          <p>
            We will only retain your personal data for as long as necessary to fulfill the purposes we collected it for, including for the purposes of satisfying any legal, accounting, or reporting requirements.
          </p>
          
          <h2>7. Your Legal Rights</h2>
          <p>
            Under certain circumstances, you have rights under data protection laws in relation to your personal data, including:
          </p>
          <ul>
            <li>The right to request access to your personal data</li>
            <li>The right to request correction of your personal data</li>
            <li>The right to request erasure of your personal data</li>
            <li>The right to object to processing of your personal data</li>
            <li>The right to request restriction of processing your personal data</li>
            <li>The right to request transfer of your personal data</li>
            <li>The right to withdraw consent</li>
          </ul>
          <p>
            If you wish to exercise any of these rights, please contact us using the details provided below.
          </p>
          
          <h2>8. Cookies</h2>
          <p>
            Our website uses cookies to distinguish you from other users. This helps us to provide you with a good experience when you browse our website and also allows us to improve our site. For detailed information on the cookies we use and the purposes for which we use them, please see our Cookie Policy.
          </p>
          
          <h2>9. Changes to This Privacy Policy</h2>
          <p>
            We may update this Privacy Policy from time to time. We will notify you of any changes by posting the new Privacy Policy on this page and updating the "Last updated" date at the top.
          </p>
          
          <h2>10. Contact Us</h2>
          <p>
            If you have any questions about this Privacy Policy or our privacy practices, please contact us at:
          </p>
          <p>
            CinCin Hotels GmbH<br />
            Attn: Data Protection Officer<br />
            Torstraße 135<br />
            10119 Berlin<br />
            Germany<br />
            Email: privacy@cincinhotels.com
          </p>
          <p>
            If you are in the European Union, you also have the right to make a complaint at any time to your local supervisory authority for data protection issues.
          </p>
          
          <div className="mt-8 flex gap-4">
            <Link href="/terms" className="text-black hover:underline">
              Terms & Conditions
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