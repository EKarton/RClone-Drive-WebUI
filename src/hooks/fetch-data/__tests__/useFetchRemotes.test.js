import { renderHook } from '@testing-library/react-hooks';
import axios from 'axios';
import useRCloneClient from 'hooks/rclone/useRCloneClient';
import { StatusTypes } from 'utils/constants';
import { mockRemotes } from 'test-utils/mock-responses';
import { waitFor } from 'test-utils/react';
import useFetchRemotes from '../useFetchRemotes';

jest.mock('hooks/rclone/useRCloneClient');

describe('useFetchRemotes()', () => {
  const rCloneClient = {
    fetchRemotes: jest.fn(),
  };

  beforeEach(() => {
    useRCloneClient.mockReturnValue(rCloneClient);
  });

  it('should return values and call rCloneClient.fetchPictures() correctly', async () => {
    rCloneClient.fetchRemotes.mockResolvedValue(mockRemotes.remotes);

    const { result } = renderHook(() => useFetchRemotes());

    await waitFor(() => expect(result.current.status).toEqual(StatusTypes.SUCCESS));
    await waitFor(() => expect(result.current.data).toEqual(mockRemotes.remotes));
    await waitFor(() => {
      expect(rCloneClient.fetchRemotes).toBeCalledWith({
        cancelToken: expect.any(axios.CancelToken),
      });
    });
  });
});
