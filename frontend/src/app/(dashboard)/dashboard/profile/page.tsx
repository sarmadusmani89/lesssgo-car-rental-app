'use client';

import PersonalInformation from '@/components/pages/user/profile/personalinformation';
import UpdateProfileForm from '@/components/pages/user/profile/updateprofileform';
import ChangePassword from '@/components/pages/user/profile/changepassword';

export default function ProfilePage() {
  return (
    <div className="space-y-6">
      <PersonalInformation />
      <UpdateProfileForm />
      <ChangePassword />
    </div>
  );
}
