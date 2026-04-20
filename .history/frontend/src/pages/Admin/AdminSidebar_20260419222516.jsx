import { Link, useLocation } from 'react-router-dom';
import { LayoutDashboard, Users, Clock, LogOut } from 'lucide-react';

const AdminSidebar = () => {
  const location = useLocation();
  
  const menuItems = [
    { name: 'Dashboard', path: '/admin/dashboard', icon: <LayoutDashboard size={20}/> },
    { name: 'Người dùng', path: '/admin/users', icon: <Users size={20}/> },
    { name: 'Duyệt sân', path: '/admin/fields/pending', icon: <Clock size={20}/> },
  ];

  return (
    <div className="flex flex-col w-64 min-h-screen p-4 text-white bg-slate-900">
      <h1 className="px-2 mb-8 text-xl font-bold text-blue-400">Hệ thống Sport</h1>
      
      <nav className="flex-1 space-y-2">
        {menuItems.map((item) => (
          <Link
            key={item.path}
            to={item.path}
            className={`flex items-center gap-3 p-3 rounded-lg transition-all ${
              location.pathname === item.path ? 'bg-blue-600' : 'hover:bg-slate-800'
            }`}
          >
            {item.icon}
            <span>{item.name}</span>
          </Link>
        ))}
      </nav>

      <button 
        onClick={() => { localStorage.clear(); window.location.href = '/login'; }}
        className="flex items-center gap-3 p-3 mt-auto text-red-400 rounded-lg hover:bg-red-900/20"
      >
        <LogOut size={20}/>
        <span>Đăng xuất</span>
      </button>
    </div>
  );
};

export default AdminSidebar;