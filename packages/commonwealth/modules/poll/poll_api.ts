import axios from 'axios';
import { Poll } from './poll_model';

export async function getPolls(): Promise<Poll[]> {
  const response = await axios.get('/api/polls');
  const polls = response.data;
  return polls;
}

export async function getPoll(id: string): Promise<Poll> {
  const response = await axios.get(`/api/polls/${id}`);
  const poll = response.data;
  return poll;
}

export async function postVote(id: string, optionId: string): Promise<Poll> {
  const response = await axios.post(`/api/polls/${id}/vote`, { optionId }, {
    headers: {
      'Content-Type': 'application/json',
    },
  });
  const poll = response.data;
  return poll;
}
