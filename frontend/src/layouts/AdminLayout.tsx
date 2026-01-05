import React, { ReactNode, useState, useEffect, useRef } from "react";
import { Outlet, NavLink, useNavigate, useLocation } from "react-router-dom";
import {
  HomeIcon,
  ListBulletIcon,
  PlusIcon,
  LogoutIcon,
  UserIcon,
  ArrowLeftIcon,
  MenuIcon,
  CloseIcon,
  ChatBubbleIcon,
  FireIcon,
  ChevronDownIcon,
  ExclamationIcon,
} from "@/components/common/icons";
import { fetchCommentStats } from "@/services/api/commentService";
import { getReportStats } from "@/services/api/reportService";
import { useSelector } from "react-redux";
import { RootState } from "@/redux/store";
interface NavItemProps {
  to: string;
  end?: boolean;
  icon: React.ReactNode;
  label: string;
  onClick?: () => void;
  badge?: number;
}

const NavItem: React.FC<NavItemProps> = ({
  to,
  end,
  icon,
  label,
  onClick,
  badge,
}) => {
  return (
    <NavLink
      to={to}
      end={end}
      onClick={onClick}
      className={({ isActive }) => `admin-nav-item ${isActive ? "active" : ""}`}
    >
      <div className="admin-nav-item-content">
        <div className="admin-nav-icon">{icon}</div>
        <span>{label}</span>
      </div>
      {badge !== undefined && badge > 0 && (
        <span className="admin-nav-badge">{badge > 99 ? "99+" : badge}</span>
      )}
    </NavLink>
  );
};

export type AdminOutletContext = {
  setPageHeader: (
    title: string | null,
    onBack?: () => void,
    data?: any
  ) => void;
};

const AdminLayout: React.FC = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { user } = useSelector((state: RootState) => state.auth);
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  const [pendingCount, setPendingCount] = useState(0);
  const [reportPendingCount, setReportPendingCount] = useState(0);
  const [showScrollTop, setShowScrollTop] = useState(false);
  const scrollContainerRef = useRef<HTMLElement>(null);

  useEffect(() => {
    const mainElement = scrollContainerRef.current;
    if (!mainElement) return;

    const handleScroll = () => {
      setShowScrollTop(mainElement.scrollTop > 100);
    };

    mainElement.addEventListener("scroll", handleScroll);
    return () => mainElement.removeEventListener("scroll", handleScroll);
  }, []);

  const scrollToTop = () => {
    scrollContainerRef.current?.scrollTo({
      top: 0,
      behavior: "smooth",
    });
  };

  useEffect(() => {
    const loadStats = async () => {
      try {
        const commentStats = await fetchCommentStats();
        setPendingCount(commentStats.pending);

        const reportStats = await getReportStats();
        setReportPendingCount(reportStats.pending);
      } catch (err) {
        console.error("Failed to fetch stats", err);
      }
    };

    loadStats();
    const timer = setInterval(loadStats, 30000); // Poll every 30s
    return () => clearInterval(timer);
  }, []);

  // Close sidebar on location change
  useEffect(() => {
    setIsSidebarOpen(false);
  }, [location.pathname]);

  return (
    <div className="admin-layout-root">
      {/* Mobile Backdrop Overlay */}
      {isSidebarOpen && (
        <div
          className="admin-sidebar-backdrop"
          onClick={() => setIsSidebarOpen(false)}
        />
      )}

      {/* Mobile Menu Toggle - Floating */}
      <button
        onClick={() => setIsSidebarOpen(true)}
        className="admin-mobile-toggle"
      >
        <MenuIcon className="admin-mobile-icon" />
      </button>

      {/* Sidebar - Responsive */}
      <aside className={`admin-sidebar ${isSidebarOpen ? "is-open" : ""}`}>
        <div className="admin-sidebar-header">
          <div className="admin-logo-container">
            <img
              src={"/assets/app_icon.png"}
              alt={__APP_NAME__}
              className="admin-logo-img"
            />
            <div>
              <h1 className="admin-logo-text">{__APP_NAME__}</h1>
              <span className="admin-logo-sub">Admin Portal</span>
            </div>
          </div>
          {/* Mobile Close Button */}
          <button
            onClick={() => setIsSidebarOpen(false)}
            className="admin-close-btn"
          >
            <CloseIcon className="admin-mobile-icon" />
          </button>
        </div>

        {/* User Info Section */}
        <div className="admin-user-card">
          <div className="admin-user-avatar">
            <UserIcon className="admin-user-icon" />
          </div>
          <div className="overflow-hidden">
            <p className="admin-user-info">
              {user?.displayName || user?.username || "Administrator"}
            </p>
            <div className="admin-user-status">
              <div className="admin-user-dot" />
              <p className="admin-user-status-text">Online</p>
            </div>
          </div>
        </div>

        <div className="admin-nav custom-scrollbar-dark">
          <p className="admin-nav-title">Hệ thống</p>
          <nav className="admin-nav-list">
            <NavItem
              to="/admin"
              end
              icon={<HomeIcon />}
              label="Bảng điều khiển"
            />
            <NavItem
              to="/admin/idiom/list"
              icon={<ListBulletIcon />}
              label="Kho từ vựng"
            />
            <NavItem
              to="/admin/idiom/insert"
              icon={<PlusIcon />}
              label="Thêm từ mới"
            />
            <NavItem
              to="/admin/comments"
              icon={<ChatBubbleIcon />}
              label="Quản lý thảo luận"
              badge={pendingCount}
            />
            <NavItem
              to="/admin/reports"
              icon={<ExclamationIcon />}
              label="Báo lỗi từ điển"
              badge={reportPendingCount}
            />
            <NavItem
              to="/admin/search-logs"
              icon={<FireIcon />}
              label="Mọi người đã tìm"
            />
          </nav>
        </div>

        <div className="admin-sidebar-footer">
          <button
            onClick={() => navigate("/")}
            className="admin-logout-btn group"
          >
            <LogoutIcon className="admin-logout-icon" />
            <span>Về trang chủ Web</span>
          </button>
        </div>
      </aside>

      {/* Main Content Area */}
      <div className="admin-main-content">
        {/* Top Header - Removed based on user request */}

        {/* Scrollable Content */}
        <main ref={scrollContainerRef} className="admin-scroll-container">
          <Outlet context={{ setIsSidebarOpen } satisfies any} />
        </main>

        {/* Scroll To Top Button */}
        <button
          onClick={scrollToTop}
          className={`scroll-to-top-btn ${showScrollTop ? "visible" : ""}`}
          aria-label="Cuộn lên đầu trang"
        >
          <ChevronDownIcon className="scroll-to-top-icon" />
        </button>
      </div>
    </div>
  );
};

export default AdminLayout;
