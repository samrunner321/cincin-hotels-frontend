import MembershipForm from '../../components/forms/MembershipForm';
import MembershipHero from '../../components/forms/MembershipHero';
import MembershipBenefits from '../../components/forms/MembershipBenefits';

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