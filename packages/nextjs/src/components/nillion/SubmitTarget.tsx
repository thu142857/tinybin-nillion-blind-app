import { useState } from 'react';

type SubmitTargetProps = {
  handleTarget: (guess: string) => void;
};

const SubmitTarget: React.FC<SubmitTargetProps> = ({ handleTarget }) => {
  const [targetValue, setTargetValue] = useState<number | string | null>(null);

  const handleRetrieve = async () => {
    try {
      const response = await fetch('https://httpbin.org/bytes/1');
      const data = await response.arrayBuffer();
      const retrieve = new Uint8Array(data)[0];
      console.log(typeof retrieve);
      console.log("retrieve", retrieve);
      setTargetValue(retrieve);
      if (retrieve) {
        handleTarget(retrieve.toString());
      }
    } catch (error) {
      console.error('Error fetching target value:', error);
      setTargetValue('Error');
    }
  };

  const handleSubmit = () => {
    if (targetValue !== null) {
      console.log(`Submitted target value: ${targetValue}`);
    }
  };

  return (
    <div style={{ borderColor: 'black', borderStyle: 'solid' }} className="flex flex-col items-center border p-4 m-2">
      <h2 className="text-xl mb-4">Submit Target (from API Endpoint)</h2>
      <div className="border p-4 mb-4 text-center">
        <p className="mb-2">
          The target value obtained via an API GET request sent to
        </p>
        <a
          href="https://httpbin.org/bytes/1"
          target="_blank"
          rel="noopener noreferrer"
          className="text-blue-500 underline"
        >
          https://httpbin.org/bytes/1
        </a>
        <p className="mt-2">will appear here.</p>
        <div className="mt-4 text-lg font-bold">
          {targetValue !== null ? targetValue : 'No value retrieved'}
        </div>
      </div>
      <button
        className="bg-blue-600 text-white p-2 disabled:bg-gray-300"
        onClick={async () => {
          await handleRetrieve();
          handleSubmit();
        }}
      >
        Retrieve, Mask, & Submit
      </button>
    </div>
  );
};

export default SubmitTarget;
