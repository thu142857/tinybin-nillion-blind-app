import { useState } from 'react';

type SubmitGuessProps = {
  guessSubmit: (guess: string) => void;
};

const SubmitGuess: React.FC<SubmitGuessProps> = ({ guessSubmit }) => {
  const [guess, setGuess] = useState<'even' | 'odd' | null>(null);
  const [isDisabled, setDisableButton] = useState<boolean>(false);

  const handleGuess = (value: 'even' | 'odd') => {
    console.log('handleGuess:', value);
    setGuess(value);
  };

  const onSubmit = () => {
    if (guess !== null) {
      guessSubmit(guess);
      setDisableButton(true);
    }
  }

  return (
    <div style={{ borderColor: 'black', borderStyle: 'solid' }} className="flex flex-col items-center border p-4 m-2">
      <h2 className="text-xl mb-4">Submit Guess (from User)</h2>
      <div className="flex flex-col mb-4">
        <button style={{ borderColor: 'black', borderStyle: 'solid' }}
          className={`border p-2 mb-2 ${guess === 'even' ? 'bg-blue-600 text-white' : ''}`}
          onClick={() => handleGuess('even')}
        >
          Even
        </button>
        <button style={{ borderColor: 'black', borderStyle: 'solid' }}
          className={`border p-2 ${guess === 'odd' ? 'bg-blue-600 text-white' : ''}`}
          onClick={() => handleGuess('odd')}
        >
          Odd
        </button>
      </div>
      <button style={{ borderColor: 'black', borderStyle: 'solid' }}
        className={`p-2  ${guess === null || isDisabled ? 'bg-gray-300 text-gray-600' : 'bg-blue-500 text-white'}`}
        disabled={guess === null || isDisabled}
        onClick={onSubmit}
      >
        Mask & Submit
      </button>
    </div>
  );
};

export default SubmitGuess;
