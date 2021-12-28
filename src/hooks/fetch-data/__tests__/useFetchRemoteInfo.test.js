import { renderHook } from '@testing-library/react-hooks';
import axios from 'axios';
import useRCloneClient from 'hooks/rclone/useRCloneClient';
import { StatusTypes } from 'utils/constants';
import { mockConfigGetResponse } from 'test-utils/mock-responses';
import { waitFor } from 'test-utils/react';
import useFetchRemoteInfo from '../useFetchRemoteInfo';

jest.mock('hooks/rclone/useRCloneClient');

describe('useFetchPictures()', () => {
  const rCloneClient = {
    fetchRemoteInfo: jest.fn(),
  };

  beforeEach(() => {
    useRCloneClient.mockReturnValue(rCloneClient);
  });

  it('should return values and call rCloneClient.fetchPictures() correctly', async () => {
    rCloneClient.fetchRemoteInfo.mockResolvedValue(mockConfigGetResponse);

    const { result } = renderHook(() => useFetchRemoteInfo('gdrive'));

    await waitFor(() => expect(result.current.status).toEqual(StatusTypes.SUCCESS));
    await waitFor(() => expect(result.current.data).toEqual(mockConfigGetResponse));
    await waitFor(() => {
      expect(rCloneClient.fetchRemoteInfo).toBeCalledWith('gdrive', {
        cancelToken: expect.any(axios.CancelToken),
      });
    });
  });
});
