import React from "react";
import {
  CloseIcon,
  GoogleIcon,
  BookmarkIcon,
  CardIcon,
  LogoutIcon,
  ChevronRightIcon,
  FacebookIcon,
  TikTokIcon,
  InstagramIcon,
  PlusIcon,
  ListBulletIcon,
  UserIcon,
} from "./icons";

interface UserSidebarProps {
  isOpen: boolean;
  onClose: () => void;
  isLoggedIn: boolean;
  onLogin: () => void;
  onLogout: () => void;
  onViewChange: (
    view: "home" | "flashcards" | "saved" | "insert" | "list"
  ) => void;
  isPremium: boolean;
  onTogglePremium: () => void;
}

const UserSidebar: React.FC<UserSidebarProps> = ({
  isOpen,
  onClose,
  isLoggedIn,
  onLogin,
  onLogout,
  onViewChange,
  isPremium,
  onTogglePremium,
}) => {
  return (
    <>
      {isOpen && (
        <div
          className="fixed inset-0 bg-black/40 backdrop-blur-sm z-40 transition-opacity"
          onClick={onClose}
        />
      )}
      <div
        className={`fixed top-0 right-0 h-full w-80 bg-white shadow-2xl z-50 transform transition-transform duration-300 ease-out ${
          isOpen ? "translate-x-0" : "translate-x-full"
        } flex flex-col`}
      >
        <div className="p-6 border-b flex justify-between items-center">
          <h2 className="font-hanzi text-xl font-bold text-slate-800">
            Cá nhân
          </h2>
          <button
            onClick={onClose}
            className="p-2 hover:bg-slate-100 rounded-full transition-colors"
          >
            <CloseIcon className="w-6 h-6" />
          </button>
        </div>

        <div className="flex-1 overflow-y-auto p-6 space-y-8">
          {!isLoggedIn ? (
            <div className="space-y-3">
              <p className="text-xs text-slate-400 font-bold uppercase tracking-widest">
                Tài khoản
              </p>
              <button
                onClick={onLogin}
                className="w-full flex items-center justify-center space-x-3 py-3 bg-red-700 text-white rounded-xl hover:bg-red-800 transition-all shadow-lg shadow-red-100 active:scale-[0.98]"
              >
                <UserIcon className="w-5 h-5" />
                <span className="font-bold">Đăng nhập Admin</span>
              </button>
            </div>
          ) : (
            <div className="flex items-center space-x-4 p-4 bg-slate-50 rounded-2xl border border-slate-100">
              <div className="w-12 h-12 bg-red-700 rounded-xl flex items-center justify-center text-white font-bold shadow-lg">
                A
              </div>
              <div>
                <h3 className="font-bold text-slate-800">Administrator</h3>
                <p className="text-[10px] text-red-600 font-bold uppercase tracking-tight">
                  Quyền quản trị viên
                </p>
              </div>
            </div>
          )}

          <div className="space-y-2">
            <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest ml-3 mb-2">
              Học tập & Lưu trữ
            </p>
            <button
              onClick={() => {
                onViewChange("home");
                onClose();
              }}
              className="w-full flex items-center justify-between p-3.5 hover:bg-slate-50 rounded-xl transition-all group"
            >
              <div className="flex items-center space-x-3 text-slate-600 font-bold group-hover:text-red-600">
                <ListBulletIcon className="w-5 h-5" /> <span>Trang chủ</span>
              </div>
              <ChevronRightIcon className="w-4 h-4 text-slate-300" />
            </button>
            <button
              onClick={() => {
                onViewChange("flashcards");
                onClose();
              }}
              className="w-full flex items-center justify-between p-3.5 hover:bg-slate-50 rounded-xl transition-all group"
            >
              <div className="flex items-center space-x-3 text-slate-600 font-bold group-hover:text-red-600">
                <CardIcon className="w-5 h-5" /> <span>Thẻ từ học tập</span>
              </div>
              <ChevronRightIcon className="w-4 h-4 text-slate-300" />
            </button>
            <button
              onClick={() => {
                onViewChange("saved");
                onClose();
              }}
              className="w-full flex items-center justify-between p-3.5 hover:bg-slate-50 rounded-xl transition-all group"
            >
              <div className="flex items-center space-x-3 text-slate-600 font-bold group-hover:text-red-600">
                <BookmarkIcon className="w-5 h-5" /> <span>Từ vựng đã lưu</span>
              </div>
              <ChevronRightIcon className="w-4 h-4 text-slate-300" />
            </button>
          </div>

          {isLoggedIn && (
            <div className="space-y-2">
              <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest ml-3 mb-2">
                Quản trị hệ thống (Admin)
              </p>
              <button
                onClick={() => {
                  onViewChange("list");
                  onClose();
                }}
                className="w-full flex items-center justify-between p-3.5 hover:bg-slate-50 rounded-xl transition-all group"
              >
                <div className="flex items-center space-x-3 text-slate-600 font-bold group-hover:text-red-600">
                  <ListBulletIcon className="w-5 h-5" />{" "}
                  <span>Kho dữ liệu gốc</span>
                </div>
                <ChevronRightIcon className="w-4 h-4 text-slate-300" />
              </button>
            </div>
          )}

          {/* <div className="pt-8 border-t flex justify-center space-x-6">
            <button className="text-slate-300 hover:text-[#1877F2] transition-colors">
              <FacebookIcon className="w-6 h-6" />
            </button>
            <button className="text-slate-300 hover:text-black transition-colors">
              <TikTokIcon className="w-6 h-6" />
            </button>
            <button className="text-slate-300 hover:text-[#E4405F] transition-colors">
              <InstagramIcon className="w-6 h-6" />
            </button>
          </div> */}
        </div>

        {isLoggedIn && (
          <div className="p-6 border-t bg-slate-50">
            <button
              onClick={onLogout}
              className="w-full flex items-center justify-center space-x-2 text-slate-500 font-bold hover:text-red-600 transition-all py-2"
            >
              <LogoutIcon className="w-5 h-5" />
              <span>Đăng xuất khỏi hệ thống</span>
            </button>
          </div>
        )}
      </div>
    </>
  );
};

export default UserSidebar;
