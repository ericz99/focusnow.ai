import React from "react";
import type { User } from "@supabase/supabase-js";

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuShortcut,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

type ProfileDropDownProps = {
  userData: User;
  signOut: () => void;
};

export function ProfileToggle({ userData, signOut }: ProfileDropDownProps) {
  return (
    <DropdownMenu>
      <DropdownMenuTrigger className="relative mx-4">
        <Avatar className="h-7 w-7">
          <AvatarImage src={userData?.user_metadata.avatar_url} />
          <AvatarFallback>{userData?.email}</AvatarFallback>
        </Avatar>
      </DropdownMenuTrigger>
      <DropdownMenuContent className="w-[315px] mb-4 lg:mr-4">
        <DropdownMenuLabel>
          {userData?.user_metadata.full_name}
          <p className="text-xs font-light text-slate-500">{userData?.email}</p>
        </DropdownMenuLabel>
        <DropdownMenuSeparator />
        <DropdownMenuGroup>
          <DropdownMenuItem>
            Settings
            <DropdownMenuShortcut>⌘S</DropdownMenuShortcut>
          </DropdownMenuItem>
        </DropdownMenuGroup>
        <DropdownMenuSeparator />
        <DropdownMenuItem
          onClick={() => {
            signOut();
          }}
        >
          Log out
          <DropdownMenuShortcut>⇧⌘Q</DropdownMenuShortcut>
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
