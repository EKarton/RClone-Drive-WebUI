import { renderHook } from '@testing-library/react-hooks';
import axios from 'axios';
import useRCloneClient from 'hooks/rclone/useRCloneClient';
import { StatusTypes } from 'utils/constants';
import { mockFiles } from 'test-utils/mock-responses';
import { waitFor } from 'test-utils/react';
import useFetchFiles from '../useFetchFiles';

jest.mock('hooks/rclone/useRCloneClient');

describe('useFetchFiles()', () => {
  const rCloneClient = {
    fetchFiles: jest.fn(),
  };

  beforeEach(() => {
    useRCloneClient.mockReturnValue(rCloneClient);
  });

  it('should return values and call rCloneClient.fetchFiles() correctly', async () => {
    rCloneClient.fetchFiles.mockResolvedValue(mockFiles.list);

    const { result } = renderHook(() => useFetchFiles('gdrive', 'Pictures'));

    await waitFor(() => expect(result.current.status).toEqual(StatusTypes.SUCCESS));
    await waitFor(() => expect(result.current.data).toEqual(mockFiles.list));

    await waitFor(() => {
      expect(rCloneClient.fetchFiles).toBeCalledWith('gdrive', 'Pictures', {
        cancelToken: expect.any(axios.CancelToken),
      });
    });
  });
});
