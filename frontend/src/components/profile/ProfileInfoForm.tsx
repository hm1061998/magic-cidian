import React from "react";
import { UserIcon, SaveIcon } from "@/components/common/icons";
import { UseFormRegister, FieldErrors } from "react-hook-form";
import { UpdateProfileData } from "@/services/api/userDataService";

interface ProfileInfoFormProps {
  username: string;
  isUpdating: boolean;
  register: UseFormRegister<UpdateProfileData>;
  errors: FieldErrors<UpdateProfileData>;
  onSubmit: (e?: React.BaseSyntheticEvent) => Promise<void>;
}

const ProfileInfoForm: React.FC<ProfileInfoFormProps> = ({
  username,
  isUpdating,
  register,
  errors,
  onSubmit,
}) => {
  return (
    <section className="bg-white rounded-[2.5rem] p-8 shadow-xl border border-slate-100 relative overflow-hidden">
      <div className="absolute top-0 right-0 w-32 h-32 bg-red-50 rounded-full -mr-16 -mt-16 opacity-50" />

      <div className="flex items-center gap-4 mb-8 relative z-10">
        <div className="w-12 h-12 bg-red-600 rounded-2xl flex items-center justify-center text-white shadow-lg shadow-red-200">
          <UserIcon className="w-6 h-6" />
        </div>
        <h2 className="text-xl font-bold text-slate-800">Thông tin cá nhân</h2>
      </div>

      <form onSubmit={onSubmit} className="space-y-6 relative z-10">
        <div>
          <label className="block text-xs font-black text-slate-400 uppercase tracking-widest mb-3 ml-1">
            Tên đăng nhập
          </label>
          <input
            type="text"
            value={username}
            disabled
            className="w-full px-5 py-4 bg-slate-50 border border-slate-100 rounded-2xl text-slate-400 font-medium cursor-not-allowed"
          />
        </div>

        <div>
          <label className="block text-xs font-black text-slate-400 uppercase tracking-widest mb-3 ml-1">
            Tên hiển thị
          </label>
          <input
            type="text"
            {...register("displayName", {
              required: "Tên hiển thị không được để trống",
              minLength: {
                value: 1,
                message: "Tên hiển thị không được để trống",
              },
              maxLength: {
                value: 50,
                message: "Tên hiển thị không quá 50 ký tự",
              },
            })}
            placeholder="Nhập tên hiển thị của bạn"
            className={`w-full px-5 py-4 bg-white border ${
              errors.displayName
                ? "border-red-500 ring-4 ring-red-50"
                : "border-slate-200"
            } rounded-2xl focus:ring-4 focus:ring-red-50 focus:border-red-500 transition-all outline-none font-medium text-slate-700`}
          />
          {errors.displayName && (
            <p className="mt-2 ml-2 text-xs font-bold text-red-500">
              {errors.displayName.message}
            </p>
          )}
        </div>

        <button
          type="submit"
          disabled={isUpdating}
          className="w-full py-4 bg-slate-900 text-white rounded-2xl font-bold hover:bg-slate-800 transition-all shadow-lg active:scale-[0.98] disabled:opacity-70 flex items-center justify-center gap-3"
        >
          <SaveIcon className="w-5 h-5" />
          {isUpdating ? "Đang cập nhật..." : "Lưu thay đổi"}
        </button>
      </form>
    </section>
  );
};

export default ProfileInfoForm;
