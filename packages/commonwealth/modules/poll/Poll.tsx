import { useState, useCallback } from 'react';
import { atom, useAtom } from 'jotai';
import { fetchPoll } from '../utils/dataFetcher';
import { Poll } from '../models/poll';
import { pollAtom } from '../store/poll'

import { fetchPoll } from './utils/dataFetcher';

const selectedOptionAtom = atom<Poll['options'][0] | null>(null);

const Poll = ({ poll }: { poll: Poll }) => {
  const [selectedOption, setSelectedOption] = useAtom(selectedOptionAtom);

  const handleVote = useCallback(async () => {
    if (!selectedOption) {
      return;
    }

    // Optimistically update UI
    const updatedOptions = poll.options.map((option) => {
      if (option.id === selectedOption.id) {
        return {
          ...option,
          votes: option.votes + 1,
        };
      }

      return option;
    });

    const optimisticPoll: Poll = {
      ...poll,
      options: updatedOptions,
    };

    setSelectedOption(null);

    try {
      // Call backend API to update vote count
      const result = await fetchPoll(`/api/polls/${poll.id}/vote`, {
        method: 'POST',
        data: { optionId: selectedOption.id },
      });

      // If the server returns an error, roll back the optimistic update
      if (result.error) {
        setSelectedOption(selectedOption);

        throw new Error(result.error.message);
      }
    } catch (err) {
      console.error(err);
      alert(`Error voting: ${err.message}`);
      setSelectedOption(selectedOption);
    }
  }, [poll, selectedOption, setSelectedOption]);

  return (
    <div>
      <h1>Poll {poll.id}</h1>
      <h2>{poll.question}</h2>
      {poll.options.map((option) => (
        <div key={option.id}>
          <label>
            <input
              type="radio"
              name="vote"
              value={option.id}
              checked={selectedOption?.id === option.id}
              onChange={() => setSelectedOption(option)}
            />
            {option.text}
          </label>
          <div>Votes: {option.votes}</div>
        </div>
      ))}
      <button disabled={!selectedOption} onClick={handleVote}>
        Vote
      </button>
    </div>
  );
};

export default Poll;