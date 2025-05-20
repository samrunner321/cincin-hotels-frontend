import MembershipForm from '../../src/components/forms/MembershipForm.jsx';
import MembershipHero from '../../src/components/forms/MembershipHero';
import MembershipBenefits from '../../src/components/forms/MembershipBenefits';

export const metadata = {
  title: 'Become a Member | CinCin Hotels',
  description: 'Apply to become a member of CinCin Hotels collection of unique accommodations.',
};

export default function MembershipPage() {
  return (
    <main className="bg-white min-h-screen">
      {/* Hero Section */}
      <MembershipHero />
      
      {/* Benefits Section */}
      <MembershipBenefits />
      
      {/* Form Section */}
      <div id="membership-form" className="py-16 scroll-mt-24">
        <MembershipForm />
      </div>
    </main>
  );
}