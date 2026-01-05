import React from "react";
import { LockIcon } from "@/components/common/icons";
import { UseFormRegister, FieldErrors } from "react-hook-form";

interface ChangePasswordFormProps {
  isChanging: boolean;
  register: UseFormRegister<any>;
  errors: FieldErrors<any>;
  onSubmit: (e?: React.BaseSyntheticEvent) => Promise<void>;
  newPassValue: string;
}

const ChangePasswordForm: React.FC<ChangePasswordFormProps> = ({
  isChanging,
  register,
  errors,
  onSubmit,
  newPassValue,
}) => {
  return (
    <section className="bg-white rounded-[2.5rem] p-8 shadow-xl border border-slate-100 relative overflow-hidden">
      <div className="absolute top-0 right-0 w-32 h-32 bg-amber-50 rounded-full -mr-16 -mt-16 opacity-50" />

      <div className="flex items-center gap-4 mb-8 relative z-10">
        <div className="w-12 h-12 bg-amber-500 rounded-2xl flex items-center justify-center text-white shadow-lg shadow-amber-200">
          <LockIcon className="w-6 h-6" />
        </div>
        <h2 className="text-xl font-bold text-slate-800">Đổi mật khẩu</h2>
      </div>

      <form onSubmit={onSubmit} className="space-y-6 relative z-10">
        <div>
          <label className="block text-xs font-black text-slate-400 uppercase tracking-widest mb-3 ml-1">
            Mật khẩu hiện tại
          </label>
          <input
            type="password"
            {...register("oldPass", {
              required: "Vui lòng nhập mật khẩu hiện tại",
            })}
            placeholder="••••••••"
            className={`w-full px-5 py-4 bg-white border ${
              errors.oldPass
                ? "border-red-500 ring-4 ring-red-50"
                : "border-slate-200"
            } rounded-2xl focus:ring-4 focus:ring-amber-50 focus:border-amber-500 transition-all outline-none font-medium text-slate-700`}
          />
          {errors.oldPass && (
            <p className="mt-2 ml-2 text-xs font-bold text-red-500">
              {errors.oldPass.message}
            </p>
          )}
        </div>

        <div>
          <label className="block text-xs font-black text-slate-400 uppercase tracking-widest mb-3 ml-1">
            Mật khẩu mới
          </label>
          <input
            type="password"
            {...register("newPass", {
              required: "Vui lòng nhập mật khẩu mới",
              minLength: {
                value: 6,
                message: "Mật khẩu mới phải có ít nhất 6 ký tự",
              },
              maxLength: {
                value: 100,
                message: "Mật khẩu mới không được quá 100 ký tự",
              },
            })}
            placeholder="••••••••"
            className={`w-full px-5 py-4 bg-white border ${
              errors.newPass
                ? "border-red-500 ring-4 ring-red-50"
                : "border-slate-200"
            } rounded-2xl focus:ring-4 focus:ring-amber-50 focus:border-amber-500 transition-all outline-none font-medium text-slate-700`}
          />
          {errors.newPass && (
            <p className="mt-2 ml-2 text-xs font-bold text-red-500">
              {errors.newPass.message}
            </p>
          )}
        </div>

        <div>
          <label className="block text-xs font-black text-slate-400 uppercase tracking-widest mb-3 ml-1">
            Xác nhận mật khẩu mới
          </label>
          <input
            type="password"
            {...register("confirmPass", {
              required: "Vui lòng xác nhận mật khẩu mới",
              validate: (value) =>
                value === newPassValue || "Mật khẩu xác nhận không khớp",
            })}
            placeholder="••••••••"
            className={`w-full px-5 py-4 bg-white border ${
              errors.confirmPass
                ? "border-red-500 ring-4 ring-red-50"
                : "border-slate-200"
            } rounded-2xl focus:ring-4 focus:ring-amber-50 focus:border-amber-500 transition-all outline-none font-medium text-slate-700`}
          />
          {errors.confirmPass && (
            <p className="mt-2 ml-2 text-xs font-bold text-red-500">
              {errors.confirmPass.message}
            </p>
          )}
        </div>

        <button
          type="submit"
          disabled={isChanging}
          className="w-full py-4 bg-amber-600 text-white rounded-2xl font-bold hover:bg-amber-700 transition-all shadow-lg active:scale-[0.98] disabled:opacity-70"
        >
          {isChanging ? "Đang xử lý..." : "Cập nhật mật khẩu"}
        </button>
      </form>
    </section>
  );
};

export default ChangePasswordForm;
