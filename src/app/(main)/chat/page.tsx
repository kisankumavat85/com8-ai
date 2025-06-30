"use client";

import { ModeToggle } from "@/components/mode-toggle";
import { Button } from "@/components/ui/button";

const ChatPage = () => {
  const onLogoutClick = () => {
    window.location.href = "/api/auth/logout";
  };

  return (
    <div>
      <Button variant="outline" className="flex gap-2" onClick={onLogoutClick}>
        Logout
      </Button>
      <div className="">
        <ModeToggle />
      </div>
    </div>
  );
};

export default ChatPage;
