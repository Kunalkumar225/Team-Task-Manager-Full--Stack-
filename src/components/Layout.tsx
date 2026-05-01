import React from 'react';
import { Outlet } from 'react-router-dom';
import Sidebar from './Sidebar';
import Navbar from './Navbar';

const Layout = () => {
  return (
    <div className="flex h-screen w-full overflow-hidden font-sans text-slate-900" style={{ background: 'var(--color-surface-50)' }}>
      <Sidebar />
      <div className="flex-1 flex flex-col h-screen overflow-hidden" style={{ marginLeft: 'var(--sidebar-width)' }}>
        <Navbar />
        <main className="flex-1 overflow-y-auto p-6 lg:p-8 dot-grid">
          <div className="max-w-7xl mx-auto h-full flex flex-col animate-fade-slide-up">
            <Outlet />
          </div>
        </main>
      </div>
    </div>
  );
};

export default Layout;
