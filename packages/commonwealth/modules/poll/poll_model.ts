export interface Poll {
  id: number;
  title: string;
  options: PollOptions[];
}

export interface PollOptions {
  id: number;
  text: string;
  votes: number;
}

export interface PollUpdate {
  id: number;
  title?: string;
  options?: PollOption[];
}
