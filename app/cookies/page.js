import PageHero from '../../src/components/common/PageHero';
import ContentBlock from '../../src/components/common/ContentBlock';
import Link from 'next/link';

export const metadata = {
  title: 'Cookie Policy | CinCin Hotels',
  description: 'Information about how CinCin Hotels uses cookies and similar technologies.',
};

export default function CookiesPage() {
  return (
    <main className="bg-white">
      <PageHero 
        title="Cookie Policy" 
        subtitle="Last updated: September 1, 2023"
        backgroundImage="/images/hotels/hotel-1.jpg"
        overlayOpacity={70}
      />
      
      <ContentBlock>
        <div className="prose prose-lg max-w-none">
          <p>
            This Cookie Policy explains how CinCin Hotels GmbH ("we", "us", "our") uses cookies and similar technologies on our website and applications. It explains what these technologies are and why we use them, as well as your rights to control our use of them.
          </p>
          
          <h2>1. What Are Cookies?</h2>
          <p>
            Cookies are small text files that are stored on your computer or mobile device when you visit a website. They are widely used to make websites work more efficiently and provide information to the website owners.
          </p>
          <p>
            Cookies allow a website to recognize your device and remember information about your visit, such as your preferred language, font size, and other display preferences. This can make your next visit easier and the site more useful to you.
          </p>
          
          <h2>2. Types of Cookies We Use</h2>
          <p>
            We use the following types of cookies on our website:
          </p>
          
          <h3>2.1 Essential Cookies</h3>
          <p>
            These cookies are necessary for the website to function properly. They enable basic functions like page navigation, secure areas access, and facilitate the booking process. The website cannot function properly without these cookies.
          </p>
          
          <h3>2.2 Preference Cookies</h3>
          <p>
            These cookies allow the website to remember choices you make and provide enhanced, personalized features. They may be set by us or by third-party providers whose services we have added to our pages.
          </p>
          
          <h3>2.3 Analytics Cookies</h3>
          <p>
            These cookies help us understand how visitors interact with our website by collecting and reporting information anonymously. They allow us to count visits and traffic sources so we can measure and improve the performance of our site.
          </p>
          
          <h3>2.4 Marketing Cookies</h3>
          <p>
            These cookies track your online activity to help advertisers deliver more relevant advertising or to limit how many times you see an ad. These cookies can share that information with other organizations such as advertisers.
          </p>
          
          <h2>3. Specific Cookies We Use</h2>
          <table className="min-w-full border border-gray-300 mt-4 mb-6">
            <thead>
              <tr className="bg-gray-100">
                <th className="border border-gray-300 px-4 py-2 text-left">Cookie Name</th>
                <th className="border border-gray-300 px-4 py-2 text-left">Type</th>
                <th className="border border-gray-300 px-4 py-2 text-left">Purpose</th>
                <th className="border border-gray-300 px-4 py-2 text-left">Duration</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td className="border border-gray-300 px-4 py-2">sessionCookie</td>
                <td className="border border-gray-300 px-4 py-2">Essential</td>
                <td className="border border-gray-300 px-4 py-2">Maintains your session while browsing</td>
                <td className="border border-gray-300 px-4 py-2">Session</td>
              </tr>
              <tr>
                <td className="border border-gray-300 px-4 py-2">preferencesCookie</td>
                <td className="border border-gray-300 px-4 py-2">Preference</td>
                <td className="border border-gray-300 px-4 py-2">Remembers your preferences and settings</td>
                <td className="border border-gray-300 px-4 py-2">1 year</td>
              </tr>
              <tr>
                <td className="border border-gray-300 px-4 py-2">_ga</td>
                <td className="border border-gray-300 px-4 py-2">Analytics</td>
                <td className="border border-gray-300 px-4 py-2">Google Analytics cookie used to distinguish users</td>
                <td className="border border-gray-300 px-4 py-2">2 years</td>
              </tr>
              <tr>
                <td className="border border-gray-300 px-4 py-2">_gid</td>
                <td className="border border-gray-300 px-4 py-2">Analytics</td>
                <td className="border border-gray-300 px-4 py-2">Google Analytics cookie used to distinguish users</td>
                <td className="border border-gray-300 px-4 py-2">24 hours</td>
              </tr>
              <tr>
                <td className="border border-gray-300 px-4 py-2">_fbp</td>
                <td className="border border-gray-300 px-4 py-2">Marketing</td>
                <td className="border border-gray-300 px-4 py-2">Facebook pixel cookie for marketing purposes</td>
                <td className="border border-gray-300 px-4 py-2">3 months</td>
              </tr>
            </tbody>
          </table>
          
          <h2>4. Third-Party Cookies</h2>
          <p>
            In addition to our own cookies, we may also use various third-party cookies to report usage statistics of the website, deliver advertisements, and so on. These cookies may be placed by:
          </p>
          <ul>
            <li>Google Analytics (analytics services)</li>
            <li>Facebook (social media and marketing)</li>
            <li>HotJar (analytics and user experience)</li>
            <li>Stripe (payment processing)</li>
          </ul>
          
          <h2>5. Managing Your Cookie Preferences</h2>
          <p>
            When you first visit our website, you will be shown a cookie consent banner that allows you to accept or reject different types of cookies.
          </p>
          <p>
            You can change your cookie preferences at any time by clicking on the "Cookie Settings" link in the footer of our website.
          </p>
          <p>
            You can also control cookies through your browser settings. Most web browsers allow some control of most cookies through browser settings. To find out more about cookies, including how to see what cookies have been set and how to manage and delete them, visit <a href="https://www.aboutcookies.org" target="_blank" rel="noopener noreferrer">www.aboutcookies.org</a> or <a href="https://www.allaboutcookies.org" target="_blank" rel="noopener noreferrer">www.allaboutcookies.org</a>.
          </p>
          
          <h2>6. What Happens If You Disable Cookies</h2>
          <p>
            If you disable cookies, some features of our website may not function properly. In particular:
          </p>
          <ul>
            <li>You may not be able to log in to your user account</li>
            <li>Your booking process may be interrupted</li>
            <li>Your preferences and settings will not be remembered</li>
            <li>Some pages might not display properly</li>
          </ul>
          
          <h2>7. Changes to This Cookie Policy</h2>
          <p>
            We may update this Cookie Policy from time to time to reflect changes in technology, regulation, or our business practices. Any changes will be posted on this page with an updated revision date.
          </p>
          
          <h2>8. Contact Us</h2>
          <p>
            If you have any questions about our use of cookies or this Cookie Policy, please contact us at:
          </p>
          <p>
            CinCin Hotels GmbH<br />
            Torstraße 135<br />
            10119 Berlin<br />
            Germany<br />
            Email: privacy@cincinhotels.com
          </p>
          
          <div className="mt-8 flex gap-4">
            <Link href="/terms" className="text-black hover:underline">
              Terms & Conditions
            </Link>
            <Link href="/privacy" className="text-black hover:underline">
              Privacy Policy
            </Link>
            <button id="open-cookie-settings" className="text-black hover:underline">
              Cookie Settings
            </button>
          </div>
        </div>
      </ContentBlock>
    </main>
  );
}