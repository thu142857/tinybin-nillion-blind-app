"use client";

import Link from "next/link";
import type { NextPage } from "next";
import { useAccount } from "wagmi";
import { BugAntIcon, MagnifyingGlassIcon } from "@heroicons/react/24/outline";
import { Address } from "@/components/scaffold-eth";

const Home: NextPage = () => {
  const { address: connectedAddress } = useAccount();

  return (
    <div className="flex flex-col items-center max-w-[1280px] py-[60px] px-[10px] w-full">
      <div className="Header flex flex-col gap-y-4">
        <h1 className="text-[19px] font-bold">Blind app tinybid: Secure Single-Item First-Price Auction Demo</h1>
        <div className="description text-[13px] font-normal">
          This new program demonstrates a secure single-item first-price auction using the Nillion Nada program.
          <br /><br />
          For each bid submitted by a bidder, it is transformed into a secret number within the Nada program. 
          Once the time expires or the required number of bids is reached (in this case, if all bidders have submitted their bids, the program will calculate), 
          the program calculates and reveals the bidders with the highest bids.
        </div>
      </div>
      <div className="Section1">
        
      </div>
      <div className="Section2">
        
      </div>
    </div>
  );
};

export default Home;
