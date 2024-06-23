"use client";

import { useEffect, useState } from "react";
import type { NextPage } from "next";
import { useAccount } from "wagmi";
import CodeSnippet from "@/components/nillion/CodeSnippet";
import { CopyString } from "@/components/nillion/CopyString";
import { NillionOnboarding } from "@/components/nillion/NillionOnboarding";
import SubmitGuess from "@/components/nillion/SubmitGuess";
import SubmitTarget from "@/components/nillion/SubmitTarget";
import { Address } from "@/components/scaffold-eth";
import { compute, computeTiny } from "@/utils/nillion/compute";
import { getUserKeyFromSnap } from "@/utils/nillion/getUserKeyFromSnap";
import { storeProgram } from "@/utils/nillion/storeProgram";
import { UserKey } from '@nillion/nillion-client-js-browser';


interface StringObject {
  [key: string]: string | null;
}

const Home: NextPage = () => {
  const { address: connectedAddress } = useAccount();
  const [connectedToSnap, setConnectedToSnap] = useState<boolean>(false);
  const [userKey, setUserKey] = useState<string | null>(null);
  const [userId, setUserId] = useState<string | null>(null);
  const [nillion, setNillion] = useState<any>(null);
  const [nillionClient, setNillionClient] = useState<any>(null);
  const [output, setOutput] = useState<string>("");

  const [programName] = useState<string>("tiny_bin");
  const [programId, setProgramId] = useState<string | null>(null);

  const [storedSecretsNameToStoreId, setStoredSecretsNameToStoreId] = useState<StringObject>({
    guess_input: null,
    retrieve_input: null,
  });
  const [guess, setGuess] = useState<string>("");

  // connect to snap
  async function handleConnectToSnap() {
    const snapResponse = await getUserKeyFromSnap();
    setUserKey(snapResponse?.user_key || null);
    setConnectedToSnap(snapResponse?.connectedToSnap || false);
  }

  // store program in the Nillion network and set the resulting program id
  async function handleStoreProgram() {
    await storeProgram(nillionClient, programName).then(setProgramId);
    handleRetrieve();
  }

  // reset nillion values
  const resetNillion = () => {
    setConnectedToSnap(false);
    setUserKey(null);
    setUserId(null);
    setNillion(null);
    setNillionClient(null);
  };

  useEffect(() => {
    // when wallet is disconnected, reset nillion
    if (!connectedAddress) {
      resetNillion();
    }
  }, [connectedAddress]);

  // Initialize nillionClient for use on page
  useEffect(() => {
    if (userKey) {
      const getNillionClientLibrary = async () => {
        const nillionClientUtil = await import("@/utils/nillion/nillionClient");
        const libraries = await nillionClientUtil.getNillionClient(userKey);
        setNillion(libraries.nillion);
        setNillionClient(libraries.nillionClient);
        return libraries.nillionClient;
      };
      getNillionClientLibrary().then(nillionClient => {
        const user_id = nillionClient.user_id;
        setUserId(user_id);
      });
    }
  }, [userKey]);

  async function fetchDailyWeatherForecast(): Promise<any> {

    const url = `https://api.open-meteo.com/v1/forecast?latitude=16.055330&longitude=108.201382&daily=temperature_2m_max&forecast_days=1`;

    try {
      const response = await fetch(url);
      if (!response.ok) {
        throw new Error(`Error: ${response.status}`);
      }
      const data = await response.json();
      return data;
    } catch (error) {
      console.error("Failed to fetch daily weather forecast:", error);
      throw error;
    }
  }

  const handleRetrieve = async () => {
    try {
      const response = await fetchDailyWeatherForecast();
      const temperatureShow = response.daily.temperature_2m_max[0];
      const temperature = Math.floor(temperatureShow).toString();
      handleGuessSubmit(temperature);
    } catch (error) {
      console.error('Error fetching target value:', error);
    }
  };

  async function handleGuessSubmit(guessValue: string) {
    if (programId) {
      console.log('guessValue', guessValue);
      const secretValue = guessValue;
      setGuess(secretValue);
      const party1Name = "Guess";
      const secret1Name = "guess_input";
      const secrets = new nillion.Secrets();

      // create new SecretInteger with value cast to string
      const newSecret = nillion.Secret.new_integer(secretValue);
      // insert the SecretInteger into secrets object
      secrets.insert(secret1Name, newSecret);

      // create program bindings for secret so it can be used in a specific program
      const secret_program_bindings = new nillion.ProgramBindings(programId);

      // set the input party to the bindings to specify which party will provide the secret
      const party_id = nillionClient.party_id;
      secret_program_bindings.add_input_party(party1Name, party_id);

      // get user id for user storing the secret
      const user_id = nillionClient.user_id;
      console.log("user_id", user_id);

      // create a permissions object, give the storer default permissions, including compute permissions with the program id
      const permissions = nillion.Permissions.default_for_user(user_id, programId);

      // store secret(s) with bindings and permissions
      const store_id = await nillionClient.store_secrets(
        process.env.NEXT_PUBLIC_NILLION_CLUSTER_ID,
        secrets,
        secret_program_bindings,
        permissions,
      );

      console.log("store_id", store_id);
      //store_id: b7d72375-f093-48c2-9286-be037f4d2087

      setStoredSecretsNameToStoreId({ ...storedSecretsNameToStoreId, [secret1Name]: store_id });
    }
  }

  return (
    <>
      <div className="flex items-center flex-col pt-10">
        <div className="px-5 flex flex-col">
          <h3 className="text-xl">
            <span className="block text-xl font-bold">tinybin: Secure Comparison of User's Guess to API-Supplied Target</span>
            {!connectedAddress && <p>Connect your MetaMask Flask wallet</p>}
            {connectedAddress && connectedToSnap && !userKey && (
              <a target="_blank" href="https://nillion-snap-site.vercel.app/" rel="noopener noreferrer">
                <button className="btn btn-sm btn-primary mt-4">
                  No Nillion User Key - Generate and store user key here
                </button>
              </a>
            )}
          </h3>

          {connectedAddress && (
            <div className="flex justify-center items-center space-x-2">
              <p className="my-2 font-medium">Connected Wallet Address:</p>
              <Address address={connectedAddress} />
            </div>
          )}

          {connectedAddress && !connectedToSnap && (
            <button className="btn btn-sm btn-primary mt-4 bg-blue-300" onClick={handleConnectToSnap}>
              Click connect to Snap with your Nillion User Key
            </button>
          )}

          {connectedToSnap && (
            <div>
              {userKey && (
                <div>
                  <div className="flex justify-center items-center space-x-2">
                    <p className="my-2 font-medium">
                      🤫 Nillion User Key from{" "}
                      <a target="_blank" href="https://nillion-snap-site.vercel.app/" rel="noopener noreferrer">
                        MetaMask Flask
                      </a>
                      :
                    </p>

                    <CopyString str={userKey} />
                  </div>

                  {userId && (
                    <div className="flex justify-center items-center space-x-2">
                      <p className="my-2 font-medium">Connected as Nillion User ID:</p>
                      <CopyString str={userId} />
                    </div>
                  )}
                </div>
              )}
            </div>
          )}
        </div>

        <div className="flex-grow bg-base-300 w-full mt-16 px-8 py-12">
          <div className="flex justify-center items-center gap-12 flex-col sm:flex-row">
            {!connectedToSnap ? (
              <NillionOnboarding />
            ) : (
              <div>
                <div className="flex flex-col bg-base-100 px-10 py-10 text-center items-center max-w-m rounded-3xl my-2">
                  <h1 className="text-xl">Store a Nada program</h1>
                  {!programId ? (
                    <button className="btn btn-sm btn-primary mt-4 bg-blue-300" onClick={handleStoreProgram}>
                      Click Store {programName} program
                    </button>
                  ) : (
                    <div>
                      ✅ {programName} program stored <br />
                      <span className="flex">
                        <CopyString str={programId} start={5} end={programName.length + 5} textBefore="program_id: " />
                      </span>
                    </div>
                  )}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </>
  );
};

export default Home;
