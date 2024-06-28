import React from 'react';

import Header from '@/components/header';
import SideBar from '@/components/sidebar';

function Layout({ children }: { children: React.ReactNode }) {
  return (
    <div className="grid min-h-screen w-full md:grid-cols-[220px_1fr] lg:grid-cols-[280px_1fr]">
      <SideBar />
      <div className="flex flex-col md:max-h-screen md:overflow-y-auto">
        <Header />
        {children}
      </div>
    </div>
  );
}

export default Layout;
