
import React, { useState } from 'react';
import { Outlet, NavLink, useNavigate } from 'react-router-dom';
import { 
  LayoutDashboard, 
  Settings, 
  ShoppingBag, 
  Image as ImageIcon, 
  Bell, 
  Inbox, 
  LogOut,
  Menu,
  X
} from 'lucide-react';

const AdminLayout: React.FC = () => {
  const [isSidebarOpen, setSidebarOpen] = useState(false);
  const navigate = useNavigate();

  const handleLogout = () => {
    sessionStorage.removeItem('adminAuthed');
    navigate('/admin/login');
  };

  const navItems = [
    { to: '/admin', icon: LayoutDashboard, label: '대시보드', end: true },
    { to: '/admin/settings', icon: Settings, label: '사이트 설정' },
    { to: '/admin/products', icon: ShoppingBag, label: '상품 관리' },
    { to: '/admin/cases', icon: ImageIcon, label: '설치사례 관리' },
    { to: '/admin/notices', icon: Bell, label: '공지사항 관리' },
    { to: '/admin/leads', icon: Inbox, label: '상담 리드 관리' },
  ];

  const NavContent = () => (
    <div className="flex flex-col h-full bg-white">
      <div className="p-8">
        <div className="flex items-center space-x-3 text-blue-600">
          <div className="w-10 h-10 bg-blue-600 rounded-xl flex items-center justify-center text-white font-bold">M</div>
          <span className="font-extrabold text-xl tracking-tighter text-slate-900">ADMIN</span>
        </div>
      </div>
      
      <nav className="flex-1 px-4 space-y-1">
        {navItems.map((item) => (
          <NavLink
            key={item.to}
            to={item.to}
            end={item.end}
            onClick={() => setSidebarOpen(false)}
            className={({ isActive }) => `
              flex items-center space-x-3 px-4 py-3.5 rounded-xl transition-all font-bold text-sm
              ${isActive ? 'bg-blue-50 text-blue-600' : 'text-slate-500 hover:bg-slate-50 hover:text-slate-700'}
            `}
          >
            <item.icon size={20} />
            <span>{item.label}</span>
          </NavLink>
        ))}
      </nav>

      <div className="p-4 border-t border-slate-50">
        <button 
          onClick={handleLogout}
          className="w-full flex items-center space-x-3 px-4 py-3.5 rounded-xl text-slate-400 hover:text-red-500 transition-colors font-bold text-sm"
        >
          <LogOut size={20} />
          <span>로그아웃</span>
        </button>
      </div>
    </div>
  );

  return (
    <div className="flex min-h-screen bg-slate-50">
      {/* Sidebar Desktop */}
      <aside className="hidden lg:block w-72 bg-white border-r border-gray-100 h-screen sticky top-0">
        <NavContent />
      </aside>

      {/* Sidebar Mobile */}
      {isSidebarOpen && (
        <div className="fixed inset-0 z-50 lg:hidden">
          <div className="fixed inset-0 bg-black/50 backdrop-blur-sm" onClick={() => setSidebarOpen(false)} />
          <aside className="fixed inset-y-0 left-0 w-72 bg-white animate-in slide-in-from-left duration-300">
            <NavContent />
          </aside>
        </div>
      )}

      {/* Main Content */}
      <main className="flex-1 min-w-0">
        <header className="h-16 bg-white border-b border-gray-100 flex items-center justify-between px-6 sticky top-0 z-40 lg:hidden">
          <span className="font-extrabold text-lg">ADMIN</span>
          <button onClick={() => setSidebarOpen(true)} className="p-2 text-slate-600">
            <Menu size={24} />
          </button>
        </header>
        
        <div className="p-6 lg:p-12 max-w-7xl mx-auto">
          <Outlet />
        </div>
      </main>
    </div>
  );
};

export default AdminLayout;
