import React from 'react';
import { Outlet, NavLink, useNavigate } from 'react-router-dom';
import { LayoutDashboard, Film, MonitorPlay, CalendarDays, LogOut, Home, Ticket } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import './Admin.css';

const AdminLayout = () => {
  const { logout } = useAuth();
  const navigate = useNavigate();

  return (
    <div className="admin-layout">
      {/* Sidebar */}
      <aside className="admin-sidebar">
        <div className="sidebar-header">
          <h2>Cinematix <span>Admin</span></h2>
        </div>
        
        <nav className="sidebar-nav">
          <NavLink to="/admin" end className={({isActive}) => isActive ? 'nav-item active' : 'nav-item'}>
            <LayoutDashboard size={20} /> Dashboard
          </NavLink>
          <NavLink to="/admin/movies" className={({isActive}) => isActive ? 'nav-item active' : 'nav-item'}>
            <Film size={20} /> Manage Movies
          </NavLink>
          <NavLink to="/admin/halls" className={({isActive}) => isActive ? 'nav-item active' : 'nav-item'}>
            <MonitorPlay size={20} /> Manage Halls
          </NavLink>
          <NavLink to="/admin/shows" className={({isActive}) => isActive ? 'nav-item active' : 'nav-item'}>
            <CalendarDays size={20} /> Manage Shows
          </NavLink>
          <NavLink to="/admin/bookings" className={({isActive}) => isActive ? 'nav-item active' : 'nav-item'}>
            <Ticket size={20} /> Bookings & Sales
          </NavLink>
        </nav>

        <div className="sidebar-footer">
          <button className="nav-item" onClick={() => navigate('/')}>
            <Home size={20} /> Back to Site
          </button>
          <button className="nav-item text-red" onClick={logout}>
            <LogOut size={20} /> Logout
          </button>
        </div>
      </aside>

      {/* Main Content Area */}
      <main className="admin-main">
        <div className="admin-topbar">
          <div className="topbar-right">
            <div className="admin-avatar">A</div>
            <span>Admin User</span>
          </div>
        </div>
        <div className="admin-content">
          <Outlet />
        </div>
      </main>
    </div>
  );
};

export default AdminLayout;
