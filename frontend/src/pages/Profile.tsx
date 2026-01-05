import React from "react";
import { useProfile } from "@/hooks/useProfile";
import ProfileInfoForm from "@/components/profile/ProfileInfoForm";
import ChangePasswordForm from "@/components/profile/ChangePasswordForm";

const Profile: React.FC = () => {
  const {
    user,
    isUpdatingProfile,
    isChangingPass,
    registerProfile,
    handleSubmitProfile,
    profileErrors,
    onUpdateProfile,
    registerPass,
    handleSubmitPass,
    passErrors,
    onChangePassword,
    newPassValue,
  } = useProfile();

  return (
    <div className="container mx-auto px-4 py-8 max-w-2xl">
      <div className="mb-10 text-center">
        <h1 className="text-3xl font-black text-slate-800 tracking-tight mb-2">
          Cài đặt tài khoản
        </h1>
        <p className="text-slate-500">Quản lý thông tin cá nhân và bảo mật</p>
      </div>

      <div className="space-y-8">
        <ProfileInfoForm
          username={user?.username || ""}
          isUpdating={isUpdatingProfile}
          register={registerProfile}
          errors={profileErrors}
          onSubmit={handleSubmitProfile(onUpdateProfile)}
        />

        <ChangePasswordForm
          isChanging={isChangingPass}
          register={registerPass}
          errors={passErrors}
          onSubmit={handleSubmitPass(onChangePassword)}
          newPassValue={newPassValue}
        />
      </div>
    </div>
  );
};

export default Profile;
