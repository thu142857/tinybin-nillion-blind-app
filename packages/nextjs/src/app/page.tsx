"use client";

import Link from "next/link";
import type { NextPage } from "next";
import { useAccount } from "wagmi";
import { BugAntIcon, MagnifyingGlassIcon } from "@heroicons/react/24/outline";
import { Address } from "@/components/scaffold-eth";
import { useEffect, useState } from "react";
import { getUserKeyFromSnap } from "@/utils/nillion";
import { storeProgram } from "@/utils/nillion/storeProgram";
import { UserKey } from "@nillion/nillion-client-js-browser";
import { computeTiny } from "@/utils/nillion/compute";
import { CopyString } from "@/components/nillion/CopyString";
import SubmitGuess from "@/components/nillion/SubmitGuess";
import SubmitTarget from "@/components/nillion/SubmitTarget";
import { NillionOnboarding } from "@/components/nillion/NillionOnboarding";
import * as nillionClientUtil from "@/utils/nillion/nillionClient";

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
  const [userStoreId, setUserStoreId] = useState<string>("");

  const [programId, setProgramId] = useState<string>('');

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
      setUserStoreId(store_id);

      setStoredSecretsNameToStoreId({ ...storedSecretsNameToStoreId, [secret1Name]: store_id });
    }
  }

  async function handelTargetSubmit(valueRetrieve: string) {
    console.log("valueRetrieve:", valueRetrieve);
    if (programId) {
      const nillionClient2 = await nillionClientUtil.getNillionClient(UserKey.from_seed('party2').to_base58());
      const party2 = nillionClient2.nillionClient.party_id;

      if (programId) {
        const inputs = [{
          name: `guess_input`,
          value: parseInt(guess),
        },
        {
          name: `retrieve_input`,
          value: parseInt(valueRetrieve),
        }];

        const result = await computeTiny(nillion, nillionClient, [], programId, party2, inputs);
        setOutput(result == "1" ? 'User guessed correctly!' : 'User guessed incorrectly!');
      }
    }
  }

  return (
    <div className="flex flex-col items-center max-w-[1280px] py-[30px] px-[10px] w-full gap-y-8">
      <div className="Header flex flex-col gap-y-4">
        <h1 className="text-4xl font-bold">Weather Guess: Secure Comparison of User's Guess of Temperature to Weather API</h1>
        <div className="description text-lg font-normal">
          This new program demonstrates a secure comparion using the Nillion Nada program.
          <div className="line w-full h-[1px] bg-white mt-2"></div>
          <br />
          For both the guess that is supplied by a user and the temperature that is obtained from a Open Weather API Service.
          <br />
          They will be stored in Nada program and the comparison will be done securely.
        </div>
      </div>
      <div className="flex items-center flex-col">
        <div className="px-5 flex flex-col">
          <h3 className="text-3xl">
            <span className="block text-xl font-bold">Secure Comparison of User's Guess to API-Supplied Target</span>
            {connectedAddress && connectedToSnap && !userKey && (
              <a target="_blank" href="https://nillion-snap-site.vercel.app/" rel="noopener noreferrer">
                <button className="btn btn-sm btn-primary mt-4 border-[1px] p-2 rounded-md">
                  No Nillion User Key - Generate and store user key here
                </button>
              </a>
            )}
          </h3>

          {connectedAddress && (
            <div className="flex justify-center items-center space-x-2 text-xl">
              <p className="my-2 font-medium">Connected Wallet Address:</p>
              <Address address={connectedAddress} />
            </div>
          )}

          {connectedAddress && !connectedToSnap && (
            <button className="btn btn-sm btn-primary mt-4 bg-blue-300 p-2 rounded-md border-[1px]" onClick={handleConnectToSnap}>
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

        <div className="flex-grow bg-base-300 w-full mt-2 px-0 py-4">
          <div className="flex justify-center items-center gap-12 flex-col sm:flex-row">
            {!connectedToSnap ? (
              <NillionOnboarding />
            ) : (
              <div>
                <div className="flex flex-col bg-base-100 px-10 py-10 text-center items-center max-w-m rounded-3xl my-2">
                  <h1 className="text-xl">Store a Nada program</h1>
                    <div className="flex flex-col mb-4">
                      <label>Store program Id</label>
                      <input
                        name="storeProgramId"
                        value={programId}
                        onChange={e => setProgramId(e.target.value)}
                      />
                    </div>
                </div>

                <div className="flex flex-col bg-base-100 px-10 py-10 text-center items-center w-full rounded-3xl my-2 justify-between">
                  <div className="border p-4 m-2 w-full">
                    <SubmitGuess guessSubmit={handleGuessSubmit} />
                    {
                      userStoreId && (
                        <CopyString str={userStoreId} textBefore="store_id: " />
                      )
                    }
                  </div>
                  <div className="border p-4 m-2 w-full">
                    <SubmitTarget handleTarget={handelTargetSubmit} />
                  </div>
                  <div style={{ borderColor: 'black', borderStyle: 'solid' }} className="border p-4 m-2 w-full">
                    <h2 className="text-lg mb-2">Network Output</h2>
                    <div className="text-center text-xl">{output}</div>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Home;
