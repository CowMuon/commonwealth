import { atom } from 'jotai';
import { Poll } from './poll_model';

// Initialize an empty object for storing polls
export const pollsAtom = atom<{ [id: string]: Poll }>({});

// An atom to update an individual poll
export const updatePollAtom = atom(
  (get) => (id: string, updatedPoll: Partial<Poll>) => {
    const polls = get(pollsAtom);
    const poll = polls[id];
    const updated = { ...poll, ...updatedPoll };
    const updatedPolls = { ...polls, [id]: updated };
    return updatedPolls;
  }
);
