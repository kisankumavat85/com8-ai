import React, { ReactNode } from "react";

import { Sidebar } from "@/components/sidebar";
import { SidebarProvider } from "@/components/ui/sidebar";
import { AppSidebar } from "@/components/app-sidebar";

type Props = {
  children: ReactNode;
};

const MainLayout = (props: Props) => {
  const { children } = props;

  return (
    <SidebarProvider>
      <div className="grid grid-cols-[auto_minmax(0,1fr)] h-full">
        {/* <Sidebar /> */}
        <AppSidebar />
        <div className="p-4">{children}</div>
      </div>
    </SidebarProvider>
  );
};

export default MainLayout;
