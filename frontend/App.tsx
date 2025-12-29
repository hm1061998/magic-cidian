import React, { useState, useCallback } from "react";
import { fetchIdiomDetails } from "./services/idiomService";
import type { Idiom, SearchMode } from "./types";
import IdiomDetail from "./components/IdiomDetail";
import HandwritingPad from "./components/HandwritingPad";
import UserSidebar from "./components/UserSidebar";
import FeaturedComments from "./components/FeaturedComments";
import AdminInsert from "./components/AdminInsert";
import {
  SearchIcon,
  HistoryIcon,
  PencilIcon,
  MenuIcon,
  ArrowLeftIcon,
  SpinnerIcon,
  BrainIcon,
} from "./components/icons";
import VocabularyList from "./components/VocabularyList";

const App: React.FC = () => {
  const [query, setQuery] = useState<string>("");
  const [currentIdiom, setCurrentIdiom] = useState<
    (Idiom & { dataSource: string }) | null
  >(null);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [searchMode, setSearchMode] = useState<SearchMode>("database");
  const [isHandwritingPadOpen, setIsHandwritingPadOpen] = useState(false);

  // View State: 'home', 'insert', etc.
  const [currentView, setCurrentView] = useState<
    "home" | "flashcards" | "saved" | "insert"
  >("home");

  const isCenteredMode = !currentIdiom && !isLoading;

  const handleSearch = useCallback(
    async (searchTerm: string, forceMode?: SearchMode) => {
      if (!searchTerm.trim()) return;
      const modeToUse = forceMode || searchMode;

      setIsLoading(true);
      setError(null);
      setCurrentIdiom(null);
      // Ensure we are in home view when searching
      if (currentView !== "home") setCurrentView("home");

      try {
        const result = await fetchIdiomDetails(searchTerm, modeToUse);
        setCurrentIdiom(result);
      } catch (err: any) {
        setError(err.message);
      } finally {
        setIsLoading(false);
      }
    },
    [searchMode, currentView]
  );

  const handleViewChange = (
    view: "home" | "flashcards" | "saved" | "insert"
  ) => {
    setCurrentView(view);
    if (view === "home") {
      // Reset search state if needed, or keep it
    } else {
      setCurrentIdiom(null);
      setQuery("");
      setError(null);
    }
  };

  const renderContent = () => {
    if (currentView === "insert") {
      return <AdminInsert onBack={() => handleViewChange("home")} />;
    }

    if (currentView === "list") {
      return (
        <VocabularyList
          onBack={() => handleViewChange("home")}
          onSelect={(hanzi) => {
            setQuery(hanzi);
            handleSearch(hanzi, "database");
          }}
        />
      );
    }
    // Default Home View Content
    return (
      <>
        <div
          className={`w-full max-w-3xl transition-all duration-700 ${
            isCenteredMode ? "scale-105" : "mb-8"
          }`}
        >
          {isCenteredMode && (
            <div className="text-center mb-8 animate-pop">
              <h1 className="text-4xl md:text-5xl font-hanzi font-bold text-slate-800 mb-4">
                Tra cứu <span className="text-red-600">Hán ngữ</span>
              </h1>
              <p className="text-slate-500">
                Thành ngữ, quán dụng ngữ & tiếng lóng mới nhất
              </p>
            </div>
          )}

          <div className="flex justify-center mb-6">
            <div className="bg-white p-1 rounded-full border border-slate-200 shadow-sm flex items-center">
              <button
                onClick={() => setSearchMode("database")}
                className={`px-4 py-1.5 rounded-full text-xs font-bold transition-all flex items-center gap-2 ${
                  searchMode === "database"
                    ? "bg-slate-800 text-white shadow-md"
                    : "text-slate-500"
                }`}
              >
                <HistoryIcon className="w-3.5 h-3.5" /> Thư viện chuẩn
              </button>
              <button
                onClick={() => setSearchMode("ai")}
                className={`px-4 py-1.5 rounded-full text-xs font-bold transition-all flex items-center gap-2 ${
                  searchMode === "ai"
                    ? "bg-gradient-to-r from-purple-600 to-red-600 text-white shadow-md"
                    : "text-slate-500"
                }`}
              >
                <BrainIcon className="w-3.5 h-3.5" /> Sức mạnh AI
              </button>
            </div>
          </div>

          <form
            onSubmit={(e) => {
              e.preventDefault();
              handleSearch(query);
            }}
            className="relative group"
          >
            <div
              className={`absolute -inset-1 rounded-full blur opacity-20 transition duration-1000 ${
                searchMode === "ai" ? "bg-purple-600" : "bg-red-600"
              }`}
            ></div>
            <div className="relative flex items-center bg-white rounded-full shadow-xl border border-slate-100 overflow-hidden">
              <input
                type="text"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder={
                  searchMode === "database"
                    ? "Nhập Hán tự, Pinyin, nghĩa tiếng Việt..."
                    : "Hỏi AI bất cứ từ nào..."
                }
                className="w-full py-4 px-6 text-lg outline-none text-slate-700"
              />
              <div className="absolute right-2 flex items-center gap-1">
                {/* <button
                  type="button"
                  onClick={() => setIsHandwritingPadOpen(true)}
                  className="p-2 text-slate-400 hover:text-slate-600"
                >
                  <PencilIcon className="w-5 h-5" />
                </button> */}
                <button
                  type="submit"
                  className={`p-2.5 rounded-full text-white shadow-md ${
                    searchMode === "ai" ? "bg-purple-600" : "bg-red-600"
                  }`}
                >
                  {isLoading ? (
                    <SpinnerIcon className="w-5 h-5" />
                  ) : (
                    <SearchIcon className="w-5 h-5" />
                  )}
                </button>
              </div>
            </div>
          </form>

          {searchMode === "database" && (
            <p className="text-center text-slate-400 text-xs mt-3 font-medium">
              Hỗ trợ tìm kiếm bằng: Tiếng Việt, Pinyin, hoặc Chữ Hán
            </p>
          )}

          {isCenteredMode && (
            <FeaturedComments onSearch={(t) => handleSearch(t, "database")} />
          )}
        </div>

        <div className="w-full flex-1">
          {isLoading && (
            <div className="flex flex-col items-center mt-12 text-slate-400 animate-pulse">
              <div
                className={`w-12 h-12 border-4 rounded-full border-t-transparent animate-spin mb-4 ${
                  searchMode === "ai" ? "border-purple-600" : "border-red-600"
                }`}
              ></div>
              <p>
                {searchMode === "ai"
                  ? "AI đang tư duy..."
                  : "Đang lục lại thư viện..."}
              </p>
            </div>
          )}

          {error && (
            <div className="max-w-md mx-auto mt-8 bg-red-50 border border-red-100 p-6 rounded-2xl text-center animate-shake">
              <p className="text-red-600 mb-4 font-medium">{error}</p>
              {searchMode === "database" && (
                <button
                  onClick={() => setSearchMode("ai")}
                  className="px-6 py-2 bg-slate-800 text-white rounded-full text-xs font-bold hover:bg-black transition-all"
                >
                  Tra cứu bằng AI
                </button>
              )}
            </div>
          )}

          {!isLoading && currentIdiom && (
            <div className="relative mt-4">
              <div
                className={`absolute top-0 right-0 z-10 px-4 py-1.5 rounded-bl-2xl rounded-tr-2xl text-[10px] font-bold text-white shadow-lg ${
                  currentIdiom.dataSource === "ai"
                    ? "bg-gradient-to-r from-purple-600 to-indigo-600"
                    : "bg-slate-800"
                }`}
              >
                {currentIdiom.dataSource === "ai"
                  ? "✨ PHÂN TÍCH BỞI AI"
                  : "📚 DỮ LIỆU CHUẨN"}
              </div>
              <IdiomDetail
                idiom={currentIdiom}
                isLoggedIn={true}
                isPremium={true}
              />
            </div>
          )}
        </div>
      </>
    );
  };

  return (
    <div className="h-full flex flex-col relative">
      <header
        className={`py-4 px-6 sticky top-0 z-30 bg-white/80 backdrop-blur-md border-b transition-all ${
          isCenteredMode
            ? "border-transparent bg-transparent"
            : "border-slate-200"
        }`}
      >
        <div className="container mx-auto flex justify-between items-center">
          {!isCenteredMode && currentView === "home" ? (
            <button
              onClick={() => setCurrentIdiom(null)}
              className="flex items-center space-x-2 text-slate-500 hover:text-red-600 transition-colors"
            >
              <ArrowLeftIcon className="w-5 h-5" />
              <span className="text-sm font-bold">Quay lại</span>
            </button>
          ) : (
            <div className="w-20"></div>
          )}

          <div className="flex items-center space-x-2">
            <div className="w-8 h-8 bg-red-700 rounded flex items-center justify-center text-white font-hanzi font-bold shadow-lg">
              词
            </div>
            <h1 className="text-lg font-bold text-slate-800 font-hanzi">
              Magic词典
            </h1>
          </div>

          <button
            onClick={() => setIsSidebarOpen(true)}
            className="p-2 hover:bg-slate-100 rounded-full"
          >
            <MenuIcon className="w-6 h-6 text-slate-600" />
          </button>
        </div>
      </header>
      <main
        className={`flex-1 overflow-auto p-4 md:p-8 flex flex-col ${
          isCenteredMode && currentView === "home"
            ? "justify-center items-center"
            : ""
        }`}
      >
        {renderContent()}
      </main>

      <HandwritingPad
        isOpen={isHandwritingPadOpen}
        onClose={() => setIsHandwritingPadOpen(false)}
        onCharacterSelect={(c) => setQuery((p) => p + c)}
      />
      <UserSidebar
        isOpen={isSidebarOpen}
        onClose={() => setIsSidebarOpen(false)}
        isLoggedIn={true}
        isPremium={true}
        onViewChange={handleViewChange}
        onLogin={() => {}}
        onLogout={() => {}}
        onTogglePremium={() => {}}
      />
    </div>
  );
};

export default App;
