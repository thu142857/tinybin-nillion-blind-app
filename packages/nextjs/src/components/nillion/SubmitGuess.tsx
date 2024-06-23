import { useState } from 'react';

type SubmitGuessProps = {
  guessSubmit: (guess: string) => void;
};

const SubmitGuess: React.FC<SubmitGuessProps> = ({ guessSubmit }) => {
  const [guess, setGuess] = useState<string>('');
  const [isDisabled, setDisableButton] = useState<boolean>(false);

  const handleGuess = (value: 'even' | 'odd') => {
    console.log('handleGuess:', value);
    setGuess(value);
  };

  const onSubmit = () => {
    if (guess !== '') {
      guessSubmit(guess);
      setDisableButton(true);
    }
  }

  return (
    <div style={{ borderColor: 'black', borderStyle: 'solid' }} className="flex flex-col items-center border p-4 m-2">
      <h2 className="text-xl mb-4">Submit Guess (from User)</h2>
      <div className="flex flex-col mb-4">
        <label htmlFor="temperaturePrediction">The weather forecast for Da Nang City tomorrow</label>
        <input
          id="temperaturePrediction"
          name="temperaturePrediction"
          value={guess}
          type="number"
          onChange={e => setGuess(e.target.value)}
        />
      </div>
      <button style={{ borderColor: 'black', borderStyle: 'solid' }}
        className={`p-2  ${guess === '' || isDisabled ? 'bg-gray-300 text-gray-600' : 'bg-blue-500 text-white'}`}
        disabled={guess === '' || isDisabled}
        onClick={onSubmit}
      >
        Mask & Submit
      </button>
    </div>
  );
};

export default SubmitGuess;
