import { Outlet, useLocation } from 'react-router';
import ScrollToTop from './components/ScrollToTop';

export default function Root() {
  const location = useLocation();
  const isAdminRoute = location.pathname.startsWith('/admin');

  return (
    <div className="min-h-screen bg-white">
      <ScrollToTop />
      <Outlet />
    </div>
  );
}