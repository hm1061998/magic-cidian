import React from "react";
interface SplashScreenProps {
  isVisible?: boolean;
}
const SplashScreen: React.FC<SplashScreenProps> = () => {
  return (
    <div
      className={`fixed inset-0 z-[9999] flex flex-col items-center justify-center bg-white overflow-hidden transition-all duration-500 ease-in-out opacity-100 visibility-visible scale-100`}
    >
      {/* Background patterns */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-red-50 rounded-full blur-[120px] opacity-60 animate-pulse"></div>
        <div
          className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] bg-orange-50 rounded-full blur-[120px] opacity-60 animate-pulse"
          style={{ animationDelay: "1s" }}
        ></div>
      </div>
      <div className="relative flex flex-col items-center">
        {/* Logo Container */}
        <div className="relative w-32 h-32 mb-8 animate-pop">
          {/* Outer glow ring */}
          <div className="absolute inset-[-10px] rounded-full bg-gradient-to-tr from-red-500/20 to-orange-500/20 blur-xl animate-spin-slow"></div>
          {/* Animated border */}
          <div className="absolute inset-0 rounded-full border-2 border-dashed border-red-200 animate-spin-slow"></div>
          {/* Logo image */}
          <div className="absolute inset-2 rounded-full bg-white shadow-2xl flex items-center justify-center overflow-hidden">
            <img
              src="/assets/app_icon.png"
              alt="Logo"
              className="w-full h-full object-cover scale-110"
            />
          </div>
        </div>
        {/* Text and progress */}
        <div className="flex flex-col items-center space-y-4">
          <h1
            className="text-3xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-red-600 to-orange-600 animate-fade-in"
            style={{ animationDelay: "0.3s" }}
          >
            MagicCidian
          </h1>
          <div className="flex flex-col items-center">
            <div className="w-48 h-1 bg-gray-100 rounded-full overflow-hidden">
              <div className="h-full bg-gradient-to-r from-red-600 to-orange-600 animate-progress"></div>
            </div>
            <p className="mt-4 text-slate-400 text-sm font-medium tracking-widest uppercase animate-pulse">
              Đang chuẩn bị...
            </p>
          </div>
        </div>
      </div>
      <style
        dangerouslySetInnerHTML={{
          __html: `
        @keyframes progress {
          0% { transform: translateX(-100%); }
          50% { transform: translateX(0); }
          100% { transform: translateX(100%); }
        }
        @keyframes spin-slow {
          from { transform: rotate(0deg); }
          to { transform: rotate(360deg); }
        }
        @keyframes fadeIn {
          from { opacity: 0; transform: translateY(10px); }
          to { opacity: 1; transform: translateY(0); }
        }
        .animate-progress {
          animation: progress 2s infinite ease-in-out;
        }
        .animate-spin-slow {
          animation: spin-slow 12s linear infinite;
        }
        .animate-fade-in {
          animation: fadeIn 0.8s ease-out forwards;
        }
      `,
        }}
      />
    </div>
  );
};
export default SplashScreen;
