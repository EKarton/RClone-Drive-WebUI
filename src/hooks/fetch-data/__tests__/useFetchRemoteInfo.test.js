import { renderHook } from '@testing-library/react-hooks';
import { waitFor } from 'test-utils/react';
import useRCloneClient from 'hooks/rclone/useRCloneClient';
import { mockConfigGetResponse } from 'test-utils/mock-responses';
import { StatusTypes } from 'utils/constants';
import axios from 'axios';
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

    await waitFor(() => {
      expect(result.current.status).toEqual(StatusTypes.SUCCESS);
      expect(result.current.data).toEqual(mockConfigGetResponse);
      expect(rCloneClient.fetchRemoteInfo).toBeCalledWith('gdrive', {
        cancelToken: expect.any(axios.CancelToken),
      });
    });
  });
});
