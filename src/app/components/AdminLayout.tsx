import { ReactNode, useEffect } from 'react';
import { Link, useNavigate, useLocation } from 'react-router';
import { isAuthenticated, signout, getCurrentUser } from '../utils/api';
import { 
  Home, 
  LayoutDashboard, 
  Building2, 
  MessageSquare, 
  LogOut, 
  Menu,
  X,
  HelpCircle,
  Users,
  FileText,
  Shield,
  Mail
} from 'lucide-react';
import { useState } from 'react';

interface AdminLayoutProps {
  children: ReactNode;
}

export default function AdminLayout({ children }: AdminLayoutProps) {
  const navigate = useNavigate();
  const location = useLocation();
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [showLogoutModal, setShowLogoutModal] = useState(false);
  const user = getCurrentUser();

  useEffect(() => {
    if (!isAuthenticated()) {
      navigate('/admin/login');
    }
  }, []);

  const handleLogout = () => {
    signout();
    navigate('/admin/login');
    setShowLogoutModal(false);
  };

  const isActive = (path: string) => location.pathname === path;

  const navLinks = [
    { path: '/admin/dashboard', icon: LayoutDashboard, label: 'Dashboard' },
    { path: '/admin/properties', icon: Building2, label: 'Properties' },
    { path: '/admin/inquiries', icon: MessageSquare, label: 'Inquiries' },
    { path: '/admin/contacts', icon: Mail, label: 'Contact Us' },
  ];

  const contentLinks = [
    { path: '/admin/faqs', icon: HelpCircle, label: 'FAQs' },
    { path: '/admin/terms', icon: FileText, label: 'Terms & Conditions' },
    { path: '/admin/privacy', icon: Shield, label: 'Privacy Policy' },
  ];

  return (
    <div className="min-h-screen bg-gray-100">
      {/* Mobile Header */}
      <header className="lg:hidden bg-[#002b5b] text-white p-4 flex items-center justify-between sticky top-0 z-40">
        <div className="flex items-center gap-2 font-bold text-xl">
          <Home className="text-[#f97316]" size={28} />
          <span>ROM Admin</span>
        </div>
        <button
          onClick={() => setSidebarOpen(!sidebarOpen)}
          className="text-white"
        >
          {sidebarOpen ? <X size={28} /> : <Menu size={28} />}
        </button>
      </header>

      {/* Sidebar */}
      <aside className={`\n        fixed top-0 left-0 h-full w-64 bg-[#002b5b] text-white z-50 transform transition-transform duration-300\n        ${sidebarOpen ? 'translate-x-0' : '-translate-x-full'}\n        lg:translate-x-0 overflow-y-auto\n      `}>
        {/* Logo */}
        <div className="p-6 border-b border-[#003d7a]">
          <Link to="/" className="flex items-center gap-2 text-2xl font-bold">
            <Home className="text-[#f97316]" size={32} />
            <span>ROM</span>
          </Link>
          <p className="text-gray-400 text-sm mt-1">Rentals On Market</p>
        </div>

        {/* User Info */}
        <div className="p-6 border-b border-[#003d7a]">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 bg-gradient-to-br from-[#f97316] to-[#ea580c] rounded-full flex items-center justify-center text-white font-bold text-lg">
              {user?.name?.[0] || 'A'}
            </div>
            <div>
              <p className="font-semibold">{user?.name || 'Admin'}</p>
              <p className="text-sm text-gray-400">{user?.email}</p>
            </div>
          </div>
        </div>

        {/* Main Navigation */}
        <nav className="p-4">
          <h3 className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-2 px-4">Main Menu</h3>
          <ul className="space-y-2">
            {navLinks.map((link) => (
              <li key={link.path}>
                <Link
                  to={link.path}
                  onClick={() => setSidebarOpen(false)}
                  className={`flex items-center gap-3 px-4 py-3 rounded-lg transition ${
                    isActive(link.path)
                      ? 'bg-[#f97316] text-white'
                      : 'text-gray-300 hover:bg-[#003d7a] hover:text-white'
                  }`}
                >
                  <link.icon size={20} />
                  <span className="font-semibold">{link.label}</span>
                </Link>
              </li>
            ))}
          </ul>
        </nav>

        {/* Content Management */}
        <nav className="p-4">
          <h3 className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-2 px-4">Content Management</h3>
          <ul className="space-y-2">
            {contentLinks.map((link) => (
              <li key={link.path}>
                <Link
                  to={link.path}
                  onClick={() => setSidebarOpen(false)}
                  className={`flex items-center gap-3 px-4 py-3 rounded-lg transition ${
                    isActive(link.path)
                      ? 'bg-[#f97316] text-white'
                      : 'text-gray-300 hover:bg-[#003d7a] hover:text-white'
                  }`}
                >
                  <link.icon size={20} />
                  <span className="font-semibold">{link.label}</span>
                </Link>
              </li>
            ))}
          </ul>
        </nav>

        {/* Logout */}
        <div className="sticky bottom-0 left-0 right-0 p-4 border-t border-[#003d7a] bg-[#002b5b]">
          <button
            onClick={() => setShowLogoutModal(true)}
            className="flex items-center gap-3 px-4 py-3 w-full rounded-lg text-gray-300 hover:bg-red-500 hover:text-white transition"
          >
            <LogOut size={20} />
            <span className="font-semibold">Logout</span>
          </button>
        </div>
      </aside>

      {/* Overlay for mobile */}
      {sidebarOpen && (
        <div
          className="fixed inset-0 bg-black/50 z-40 lg:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* Main Content */}
      <main className="lg:ml-64 min-h-screen">
        {children}
      </main>

      {/* Logout Confirmation Modal */}
      {showLogoutModal && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-lg max-w-md w-full p-6">
            <h3 className="text-xl font-bold text-[#002b5b] mb-4">Confirm Logout</h3>
            <p className="text-gray-700 mb-6">
              Are you sure you want to logout? You will need to login again to access the admin panel.
            </p>
            <div className="flex gap-3">
              <button
                onClick={() => setShowLogoutModal(false)}
                className="flex-1 px-6 py-3 border border-gray-300 rounded-lg font-semibold hover:bg-gray-50 transition"
              >
                Cancel
              </button>
              <button
                onClick={handleLogout}
                className="flex-1 bg-red-600 text-white px-6 py-3 rounded-lg font-semibold hover:bg-red-700 transition"
              >
                Logout
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}