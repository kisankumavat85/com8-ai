import React from "react";
import { Sidebar, SidebarContent, SidebarHeader, SidebarTrigger } from "./ui/sidebar";

export const AppSidebar = () => {
  return (
    <Sidebar>
      <SidebarHeader>
        <div className="">Hello</div>
        <SidebarTrigger />
      </SidebarHeader>
      <SidebarContent>
        
      </SidebarContent>
    </Sidebar>
  );
};
