"use client";

import { ThemeToggler } from "@/components/theme-toggler";
import { Button } from "@/components/ui/button";
import React from "react";

const ChatPage = () => {
  const onLogoutClick = () => {
    window.location.href = "/api/auth/logout";
  };

  return (
    <div>
      <Button variant="outline" className="flex gap-2" onClick={onLogoutClick}>
        Logout
      </Button>
      <ThemeToggler />
    </div>
  );
};

export default ChatPage;
