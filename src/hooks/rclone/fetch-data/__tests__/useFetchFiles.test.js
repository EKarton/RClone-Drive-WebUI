import { renderHook } from '@testing-library/react-hooks';
import { waitFor } from 'test-utils/react';
import useRCloneClient from 'hooks/rclone/useRCloneClient';
import { mockFiles } from 'test-utils/mock-responses';
import { StatusTypes } from 'utils/constants';
import useFetchFiles from '../useFetchFiles';
import axios from 'axios';

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

    await waitFor(() => {
      expect(result.current.status).toEqual(StatusTypes.SUCCESS);
      expect(result.current.data).toEqual(mockFiles.list);
      expect(rCloneClient.fetchFiles).toBeCalledWith('gdrive', 'Pictures', {
        cancelToken: expect.any(axios.CancelToken),
      });
    });
  });
});
