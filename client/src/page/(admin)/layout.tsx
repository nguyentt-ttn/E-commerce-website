import { useState } from 'react';
import { Outlet } from 'react-router-dom';
import { HeaderAdmin } from './components/HeaderAdmin';
import { SidebarAdmin } from './components/SidebarAdmin';


export function AdminLayout() {
  const [sidebarOpen, setSidebarOpen] = useState(false);

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="flex h-screen overflow-hidden">
        <div
          className={`fixed inset-0 z-50 bg-gray-900/50 transition-opacity lg:hidden ${
            sidebarOpen ? 'opacity-100' : 'opacity-0 pointer-events-none'
          }`}
          onClick={() => setSidebarOpen(false)}
        />

        <aside
          className={`fixed inset-y-0 left-0 z-50 w-64 transform transition-transform duration-300 ease-in-out lg:relative lg:translate-x-0 ${
            sidebarOpen ? 'translate-x-0' : '-translate-x-full'
          }`}
        >
          <SidebarAdmin onClose={() => setSidebarOpen(false)} />
        </aside>

        <div className="flex flex-1 flex-col overflow-hidden">
          <HeaderAdmin onMenuClick={() => setSidebarOpen(true)} />

          <main className="flex-1 overflow-y-auto bg-gray-50 p-4 lg:p-8">
            <Outlet />
          </main>
        </div>
      </div>
    </div>
  );
}
