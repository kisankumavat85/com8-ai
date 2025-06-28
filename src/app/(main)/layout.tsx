import React, { ReactNode } from "react";

import { Sidebar } from "@/components/sidebar";

type Props = {
  children: ReactNode;
};

const ChatLayout = (props: Props) => {
  const { children } = props;

  return (
    <div className="grid grid-cols-[auto_minmax(0,1fr)] h-full">
      <Sidebar />
      <div className="p-4">{children}</div>
    </div>
  );
};

export default ChatLayout;
