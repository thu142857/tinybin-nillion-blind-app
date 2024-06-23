import { set } from 'nprogress';
import { useState } from 'react';

type SubmitTargetProps = {
  handleTarget: (guess: string) => void;
};

const SubmitTarget: React.FC<SubmitTargetProps> = ({ handleTarget }) => {
  const [targetValue, setTargetValue] = useState<number | string | null>(null);
  const [time, setTime] = useState<string | null>(null);

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
      const time = response.daily.time[0];
      setTargetValue(temperatureShow);
      setTime(time);
      if (temperature) {
        handleTarget(temperature);
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
          The temperature forecast for tomorrow in Da Nang City
        </p>
        <a
          href="https://api.open-meteo.com/v1/forecast"
          target="_blank"
          rel="noopener noreferrer"
          className="text-blue-500 underline"
        >
          https://api.open-meteo.com/v1/forecast
        </a>
        <p className="mt-2">will appear here.</p>
        <div className="mt-4 text-lg font-bold text-red-500">
          {time !== null ? `Forecast for ${time}` : ''}
          <br />
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
