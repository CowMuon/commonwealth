export async function getPolls(): Promise<Poll[]> {
  const response = await fetch('/api/polls');
  const polls = await response.json();
  return polls;
}

export async function getPoll(id: string): Promise<Poll> {
  const response = await fetch(`/api/polls/${id}`);
  const poll = await response.json();
  return poll;
}

export async function postVote(id: string, optionId: string): Promise<Poll> {
  const response = await fetch(`/api/polls/${id}/vote`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ optionId }),
  });
  const poll = await response.json();
  return poll;
}
