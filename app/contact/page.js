import PageHero from '../../src/components/common/PageHero';
import ContentBlock from '../../src/components/common/ContentBlock';
import ClientContactForm from '../../src/components/forms/ClientContactForm';

export const metadata = {
  title: 'Contact | CinCin Hotels',
  description: 'Contact CinCin Hotels for inquiries, support or partnership opportunities.',
};

export default function ContactPage() {
  return (
    <main className="bg-white">
      <PageHero 
        title="Contact Us" 
        subtitle="We are here to help with any inquiries or support you may need"
        backgroundImage="/images/hotels/hotel-6.jpg"
      />
      
      <ContentBlock>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-16">
          <div>
            <h2 className="text-3xl font-normal mb-6">Get in Touch</h2>
            <p className="mb-8">
              Whether you have questions about our hotels, need assistance with a reservation, or are interested in partnering with us, we are here to help. Fill out the form and our team will get back to you as soon as possible.
            </p>
            
            <div className="space-y-6">
              <div>
                <h3 className="text-lg font-semibold mb-1">Email</h3>
                <p className="text-gray-600">hello@cincinhotels.com</p>
              </div>
              
              <div>
                <h3 className="text-lg font-semibold mb-1">Phone</h3>
                <p className="text-gray-600">+49 30 1234 5678</p>
              </div>
              
              <div>
                <h3 className="text-lg font-semibold mb-1">Office</h3>
                <address className="text-gray-600 not-italic">
                  Torstraße 135<br />
                  10119 Berlin<br />
                  Germany
                </address>
              </div>
              
              <div>
                <h3 className="text-lg font-semibold mb-1">Working Hours</h3>
                <p className="text-gray-600">Monday to Friday, 9:00 AM - 6:00 PM CET</p>
              </div>
            </div>
          </div>
          
          <div>
            <ClientContactForm />
          </div>
        </div>
      </ContentBlock>
      
      <div className="h-96 w-full">
        <iframe 
          src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d2427.6348052018927!2d13.399907377020197!3d52.52968697218727!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x47a851e46d9d6729%3A0xceb6ef6747e33c5c!2sTorstra%C3%9Fe%20135%2C%2010119%20Berlin%2C%20Germany!5e0!3m2!1sen!2sus!4v1693761443288!5m2!1sen!2sus" 
          width="100%" 
          height="100%" 
          style={{ border: 0 }} 
          allowFullScreen="" 
          loading="lazy" 
          referrerPolicy="no-referrer-when-downgrade"
          title="CinCin Hotels Office Location"
        ></iframe>
      </div>
    </main>
  );
}