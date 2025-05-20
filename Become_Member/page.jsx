
import MembershipForm from '../../src/components/forms/MembershipForm';

export const metadata = {
  title: 'Become a Member | CinCin Hotels',
  description: 'Apply to become a member of CinCin Hotels collection of unique accommodations.',
};

export default function MembershipPage() {
  return (
    <main>
      <MembershipForm />
    </main>
  );
}