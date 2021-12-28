import { act, renderHook } from '@testing-library/react-hooks';
import axios from 'axios';
import { useCallback } from 'react';
import useRCloneClient from 'hooks/rclone/useRCloneClient';
import { StatusTypes } from 'utils/constants';
import { mockRemotes } from 'test-utils/mock-responses';
import { waitFor } from 'test-utils/react';
import useFetchData from '../useFetchData';

jest.mock('hooks/rclone/useRCloneClient');

describe('useFetchData', () => {
  it('should return correct data when api is being loaded to when api succeeds', async () => {
    // Mimic api taking 10 seconds
    jest.useFakeTimers();

    useRCloneClient.mockReturnValue({
      fetchRemotes: jest.fn().mockImplementation(() => {
        return new Promise((resolve) => {
          setTimeout(() => resolve(mockRemotes.remotes), 1000);
        });
      }),
    });

    const useTestHook = () => {
      const func = useCallback((c) => c.fetchRemotes(), []);
      return useFetchData(func);
    };
    const { result } = renderHook(() => useTestHook());

    await waitFor(() => expect(result.current.status).toEqual(StatusTypes.LOADING));

    jest.runAllTimers();

    await waitFor(() => expect(result.current.status).toEqual(StatusTypes.SUCCESS));
    await waitFor(() => expect(result.current.data).toEqual(mockRemotes.remotes));
  });

  it('should return correct data when api throws an error', async () => {
    const error = new Error('401 Unauthorized!');
    useRCloneClient.mockReturnValue({
      fetchRemotes: jest.fn().mockRejectedValue(error),
    });

    const useTestHook = () => {
      const func = useCallback((c) => c.fetchRemotes(), []);
      return useFetchData(func);
    };
    const { result } = renderHook(() => useTestHook());

    await waitFor(() => expect(result.current.status).toEqual(StatusTypes.LOADING));

    jest.runAllTimers();

    await waitFor(() => expect(result.current.status).toEqual(StatusTypes.ERROR));
    await waitFor(() => expect(result.current.error).toEqual(error));
  });

  it('should still set the api to loading if axios cancels the request', async () => {
    // Mimic api taking 10 seconds
    jest.useFakeTimers();

    useRCloneClient.mockReturnValue({
      fetchRemotes: jest.fn().mockRejectedValue(new axios.Cancel('API call cancelled')),
    });

    const useTestHook = () => {
      const func = useCallback((c) => c.fetchRemotes(), []);
      return useFetchData(func);
    };
    const { result, unmount } = renderHook(() => useTestHook());

    await waitFor(() => expect(result.current.status).toEqual(StatusTypes.LOADING));

    unmount();
    jest.runAllTimers();

    await waitFor(() => expect(result.current.status).toEqual(StatusTypes.LOADING));
  });

  it('should call api endpoint twice when called refetchData() and api call succeeds', async () => {
    const fetchRemotes = jest.fn().mockResolvedValue(mockRemotes.remotes);
    useRCloneClient.mockReturnValue({
      fetchRemotes,
    });

    const useTestHook = () => {
      const func = useCallback((c) => c.fetchRemotes(), []);
      return useFetchData(func);
    };
    const { result } = renderHook(() => useTestHook());

    await act(() => result.current.refetchData());

    await waitFor(() => expect(result.current.status).toEqual(StatusTypes.SUCCESS));
    await waitFor(() => expect(fetchRemotes).toBeCalledTimes(2));
  });

  it('should set status to error when calling refetchData() fails', async () => {
    useRCloneClient.mockReturnValue({
      fetchRemotes: jest.fn().mockRejectedValue(new Error('401 Unauthorized!')),
    });

    const useTestHook = () => {
      const func = useCallback((c) => c.fetchRemotes(), []);
      return useFetchData(func);
    };
    const { result } = renderHook(() => useTestHook());

    await act(() => result.current.refetchData());

    await waitFor(() => expect(result.current.status).toEqual(StatusTypes.ERROR));
  });
});
