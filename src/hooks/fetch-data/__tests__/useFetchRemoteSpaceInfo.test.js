import { renderHook } from '@testing-library/react-hooks';
import { waitFor } from 'test-utils/react';
import useRCloneClient from 'hooks/rclone/useRCloneClient';
import { mockOperationsAboutResponse } from 'test-utils/mock-responses';
import { StatusTypes } from 'utils/constants';
import axios from 'axios';
import useFetchRemoteSpaceInfo from '../useFetchRemoteSpaceInfo';

jest.mock('hooks/rclone/useRCloneClient');

describe('useFetchRemoteSpaceInfo()', () => {
  const rCloneClient = {
    fetchRemoteSpaceInfo: jest.fn(),
  };

  beforeEach(() => {
    useRCloneClient.mockReturnValue(rCloneClient);
  });

  it('should return values and call rCloneClient.fetchPictures() correctly', async () => {
    rCloneClient.fetchRemoteSpaceInfo.mockResolvedValue(mockOperationsAboutResponse);

    const { result } = renderHook(() => useFetchRemoteSpaceInfo('gdrive'));

    await waitFor(() => {
      expect(result.current.status).toEqual(StatusTypes.SUCCESS);
      expect(result.current.data).toEqual(mockOperationsAboutResponse);
      expect(rCloneClient.fetchRemoteSpaceInfo).toBeCalledWith('gdrive', {
        cancelToken: expect.any(axios.CancelToken),
      });
    });
  });
});
