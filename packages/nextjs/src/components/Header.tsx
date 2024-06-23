"use client";

import React, { useCallback, useRef, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Bars3Icon, BugAntIcon } from "@heroicons/react/24/outline";
import { FaucetButton, RainbowKitCustomConnectButton } from "@/components/scaffold-eth";
import { useOutsideClick } from "@/hooks/scaffold-eth";

type HeaderMenuLink = {
  label: string;
  href: string;
  icon?: React.ReactNode;
};

export const menuLinks: HeaderMenuLink[] = [
  {
    label: "Home",
    href: "/",
  },
  {
    label: "🖥️ Blind Computation",
    href: "/nillion-compute",
  },
  {
    label: "🎯 Hello World",
    href: "/nillion-hello-world",
  },
  {
    label: "✅ Hello World",
    href: "/nillion-hello-world-complete",
  },
  {
    label: "Debug Contracts",
    href: "/debug",
    icon: <BugAntIcon className="h-4 w-4" />,
  },
];

export const HeaderMenuLinks = () => {
  const pathname = usePathname();

  return (
    <>
      {menuLinks.map(({ label, href, icon }) => {
        const isActive = pathname === href;
        return (
          <li key={href}>
            <Link
              href={href}
              passHref
              className={`${
                isActive ? "bg-secondary shadow-md" : ""
              } hover:bg-secondary hover:shadow-md focus:!bg-secondary active:!text-neutral py-1.5 px-3 text-sm rounded-full gap-2 grid grid-flow-col`}
            >
              {icon}
              <span>{label}</span>
            </Link>
          </li>
        );
      })}
    </>
  );
};

/**
 * Site header
 */
export const Header = () => {
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  const burgerMenuRef = useRef<HTMLDivElement>(null);
  useOutsideClick(
    burgerMenuRef,
    useCallback(() => setIsDrawerOpen(false), []),
  );

  return (
    <div className="sticky lg:static top-0 navbar bg-base-100 min-h-0 flex-shrink-0 justify-between z-20 shadow-md shadow-secondary px-0 py-2 sm:px-2">
      <div className="navbar-start w-auto lg:w-1/2">
        <Link href="/" passHref className="hidden lg:flex items-center gap-x-4 ml-4 mr-6 shrink-0">
          <div className="flex relative w-20 h-10">
            <Image alt="nillion logo" className="cursor-pointer" fill src="/lg-nillion.svg" />
          </div>
          <div className="flex flex-col">
            <span className="font-bold leading-normal mt-[6px] text-[18px]">Secure Temperature Guess</span>
          </div>
        </Link>
      </div>
      <div className="navbar-end flex-grow mr-4 flex justify-between px-4">
        <RainbowKitCustomConnectButton />
      </div>
    </div>
  );
};
