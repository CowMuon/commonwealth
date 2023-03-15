import axios from 'axios';
import { Poll } from '../models/poll';

type FetchDataOptions<T> = {
  url: string;
  method?: 'GET' | 'POST' | 'PUT' | 'DELETE';
  data?: object;
};

type DataFetcherResult<T> =
  | { status: 'loading'; data: null; error: null }
  | { status: 'success'; data: T; error: null }
  | { status: 'error'; data: null; error: Error };

export const fetchPoll = async (pollId: string, selectedOption: string) => {
  const url = `/api/polls/${pollId}/vote`;
  const data = { optionId: selectedOption };

  try {
    const response = await axios.post<Poll>(url, data);
    return { status: 'success', data: response.data, error: null };
  } catch (error) {
    return { status: 'error', data: null, error };
  }
};

export const usePoll = (poll: Poll) => {
  const [selectedOption, setSelectedOption] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [pollState, updatePollState] = useAtom(updatePollAtom);

  const handleVote = useCallback(async () => {
    if (!selectedOption) {
      return;
    }

    setSelectedOption(selectedOption);
    setIsSubmitting(true);

    const optimisticUpdate = {
      ...poll,
      options: poll.options.map((option) => {
        if (option.id === selectedOption.id) {
          return { ...option, votes: option.votes + 1 };
        }
        return option;
      }),
    };

    updatePollState((prevState) => ({
      ...prevState,
      [poll.id]: optimisticUpdate,
    }));

    const result: DataFetcherResult<Poll> = await fetchPoll(poll.id, selectedOption.id);

    if (result.status === 'error') {
      updatePollState((prevState) => ({
        ...prevState,
        [poll.id]: poll,
      }));
      console.error(result.error);
      // show error toast
    }

    setIsSubmitting(false);
  }, [selectedOption, poll.id, updatePollState, setSelectedOption, setIsSubmitting]);

  const handleOptionSelect = useCallback((option) => {
    setSelectedOption(option);
  }, [setSelectedOption]);

  const options = poll.options.map((option) => ({
    ...option,
    votes: pollState[poll.id]?.options[option.id]?.votes ?? option.votes,
  }));

  return {
    selectedOption,
    isSubmitting,
    handleVote,
    handleOptionSelect,
    options,
  };
};
