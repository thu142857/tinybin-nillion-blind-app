import React from "react";
import Link from "next/link";
import { hardhat } from "viem/chains";
import { CurrencyDollarIcon, MagnifyingGlassIcon } from "@heroicons/react/24/outline";
import { SwitchTheme } from "@/components/SwitchTheme";
import { Faucet } from "@/components/scaffold-eth";
import { useTargetNetwork } from "@/hooks/scaffold-eth/useTargetNetwork";
import { useGlobalState } from "@/services/store/store";

/**
 * Site footer
 */
export const Footer = () => {
  const nativeCurrencyPrice = useGlobalState(state => state.nativeCurrencyPrice);
  const { targetNetwork } = useTargetNetwork();
  const isLocalNetwork = targetNetwork.id === hardhat.id;

  return (
    <div className="Footer py-[15px]">
      <div className="w-full">
        <ul className="menu menu-horizontal w-full">
          <div className="flex justify-center items-center gap-2 text-[11px] w-full">
            <div className="text-center">
              <a
                href="https://github.com/daningyn/tinybid-nillion-blind-app"
                target="_blank"
                rel="noreferrer"
                className="link"
              >
                Github Source
              </a>

              <a href="https://nillion-snap-site.vercel.app/" target="_blank" rel="noreferrer" className="link ml-5">
                Generate Nillion User Key
              </a>
            </div>
            <span></span>
          </div>
        </ul>
      </div>
    </div>
  );
};
