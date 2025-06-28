"use client";

import {
  FolderClosed,
  PanelLeft,
  Search,
  Sparkles,
  SquarePen,
} from "lucide-react";
import React, { useState } from "react";
import { Button } from "./ui/button";
import Link from "next/link";

const sideMenuItems = [
  {
    title: "New chat",
    icon: <SquarePen size={20} />,
    href: "/",
    isButton: false,
  },
  {
    title: "Search",
    icon: <Search size={20} />,
    isButton: true,
    href: "",
  },
  {
    title: "Projects",
    icon: <FolderClosed size={20} />,
    href: "/projects",
    isButton: false,
  },
];

export const Sidebar = () => {
  const [open, setOpen] = useState(true);
  return (
    <aside className="max-w-[260px] h-full border-r">
      <div className="px-4 py-6 flex items-center justify-between">
        {open ? <div className="text-xl">Com8.ai</div> : null}
        <div>
          <Button
            size="icon"
            variant="ghost"
            onClick={() => setOpen((ps) => !ps)}
          >
            {open ? <PanelLeft /> : <Sparkles />}
          </Button>
        </div>
      </div>

      <div className="p-2">
        {sideMenuItems.map((item) =>
          item.isButton ? (
            <Button
              key={item.title}
              className="p-0 w-full justify-start text-md"
              variant="ghost"
            >
              <div className="py-2 px-4 flex items-center gap-3 hover:bg-zinc-100 dark:hover:bg-zinc-800 rounded-lg">
                {item.icon}
                {open ? <p className="font-light">{item.title}</p> : null}
              </div>
            </Button>
          ) : (
            <Link href={item.href} key={item.title}>
              <div className="py-2 px-4 flex items-center gap-3 hover:bg-zinc-100 dark:hover:bg-zinc-800 rounded-lg">
                {item.icon}
                {open ? (
                  <div className="text-md font-light">{item.title}</div>
                ) : null}
              </div>
            </Link>
          )
        )}

        {/* <div className="px-4 py-1 flex items-center gap-4">
          <div className="">
            <Button variant="ghost" size="icon">
              <Search />
            </Button>
          </div>
          {open ? <div className="">Search</div> : null}
        </div>
        <div className="px-4 py-1 flex items-center gap-4">
          <div className="">
            <Button variant="ghost" size="icon">
              <FolderClosed />
            </Button>
          </div>
          {open ? <div className="">Projects</div> : null}
        </div> */}
      </div>

      {open ? (
        <>
          <div className="px-4 pt-4 pb-2">
            <h2 className="text-sm text-slate-400">Chats</h2>
          </div>

          <div className="px-4">
            <p className="text-md font-light overflow-hidden text-ellipsis whitespace-nowrap">
              Lorem ipsum dolor sit, amet consectetur adipisicing elit. Dolor.
            </p>
          </div>
        </>
      ) : null}
    </aside>
  );
};
