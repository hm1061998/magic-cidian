import React from "react";
import {
  CloseIcon,
  GoogleIcon,
  UserIcon,
  SettingsIcon,
  BookmarkIcon,
  CardIcon,
  LogoutIcon,
  ChevronRightIcon,
  MailIcon,
  FacebookIcon,
  TikTokIcon,
  InstagramIcon,
  YouTubeIcon,
  PlusIcon,
  ListBulletIcon,
} from "./icons";

interface UserSidebarProps {
  isOpen: boolean;
  onClose: () => void;
  isLoggedIn: boolean;
  onLogin: () => void;
  onLogout: () => void;
  onViewChange: (view: "home" | "flashcards" | "saved" | "insert") => void;
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
          className="fixed inset-0 bg-black/20 backdrop-blur-sm z-40"
          onClick={onClose}
        />
      )}
      <div
        className={`fixed top-0 right-0 h-full w-80 bg-white shadow-2xl z-50 transform transition-transform duration-300 ${
          isOpen ? "translate-x-0" : "translate-x-full"
        } flex flex-col`}
      >
        <div className="p-6 border-b flex justify-between items-center">
          <h2 className="font-hanzi text-xl font-bold">Cá nhân</h2>
          <button
            onClick={onClose}
            className="p-2 hover:bg-slate-100 rounded-full"
          >
            <CloseIcon className="w-6 h-6" />
          </button>
        </div>
        <div className="flex-1 overflow-y-auto p-6 space-y-8">
          {!isLoggedIn ? (
            <button
              onClick={onLogin}
              className="w-full flex items-center justify-center space-x-2 py-3 border rounded-xl hover:bg-slate-50 transition-all"
            >
              <GoogleIcon className="w-5 h-5" />
              <span>Tiếp tục với Google</span>
            </button>
          ) : (
            <div className="flex items-center space-x-4">
              <div className="w-12 h-12 bg-red-700 rounded-full flex items-center justify-center text-white font-bold">
                U
              </div>
              <div>
                <h3 className="font-bold">Người dùng</h3>
                <p className="text-xs text-slate-500">
                  {isPremium ? "Gói Premium" : "Gói Miễn phí"}
                </p>
              </div>
            </div>
          )}
          <div className="space-y-4">
            <button
              onClick={() => {
                onViewChange("list");
                onClose();
              }}
              className="w-full flex items-center justify-between p-3 hover:bg-slate-50 rounded-lg"
            >
              <div className="flex items-center space-x-3 text-slate-700">
                <ListBulletIcon className="w-5 h-5" /> <span>Kho từ vựng</span>
              </div>
              <ChevronRightIcon className="w-4 h-4" />
            </button>
            <button
              onClick={() => {
                onViewChange("flashcards");
                onClose();
              }}
              className="w-full flex items-center justify-between p-3 hover:bg-slate-50 rounded-lg"
            >
              <div className="flex items-center space-x-3">
                <CardIcon className="w-5 h-5" /> <span>Thẻ từ học tập</span>
              </div>
              <ChevronRightIcon className="w-4 h-4" />
            </button>
            <button
              onClick={() => {
                onViewChange("saved");
                onClose();
              }}
              className="w-full flex items-center justify-between p-3 hover:bg-slate-50 rounded-lg"
            >
              <div className="flex items-center space-x-3">
                <BookmarkIcon className="w-5 h-5" /> <span>Từ vựng đã lưu</span>
              </div>
              <ChevronRightIcon className="w-4 h-4" />
            </button>
            <button
              onClick={() => {
                onViewChange("insert");
                onClose();
              }}
              className="w-full flex items-center justify-between p-3 hover:bg-slate-50 rounded-lg"
            >
              <div className="flex items-center space-x-3 text-red-600">
                <PlusIcon className="w-5 h-5" />{" "}
                <span className="font-bold">Thêm từ mới</span>
              </div>
              <ChevronRightIcon className="w-4 h-4" />
            </button>
          </div>
          <div className="pt-6 border-t flex justify-center space-x-4">
            <FacebookIcon className="w-5 h-5 text-slate-400" />
            <TikTokIcon className="w-5 h-5 text-slate-400" />
            <InstagramIcon className="w-5 h-5 text-slate-400" />
          </div>
        </div>
        {isLoggedIn && (
          <div className="p-6 border-t">
            <button
              onClick={onLogout}
              className="w-full flex items-center justify-center space-x-2 text-red-600 font-medium"
            >
              <LogoutIcon className="w-5 h-5" />
              <span>Đăng xuất</span>
            </button>
          </div>
        )}
      </div>
    </>
  );
};

export default UserSidebar;
