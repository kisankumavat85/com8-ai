"use client";

import { Button } from "@/components/ui/button";
import { GitHubLogoIcon } from "@radix-ui/react-icons";
import React from "react";

const AccountPage = () => {
  const onLogoutClick = () => {
    window.location.href = "/api/auth/logout";
  };
  return (
    <div>
      <Button variant="outline" className="flex gap-2" onClick={onLogoutClick}>
        Logout
      </Button>
    </div>
  );
};

export default AccountPage;
