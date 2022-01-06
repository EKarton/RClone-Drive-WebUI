import { renderHook } from '@testing-library/react-hooks';
import { UploadStatusTypes } from 'utils/constants';
import { FileUploadCountsProvider } from '../index';
import useFileUploadCounts from '../useFileUploadCounts';

describe('useFileUploadCounts()', () => {
  it('should return correct status counts correctly when called addUploadStatus() and updateUploadStatus()', () => {
    const { result } = renderHook(() => useFileUploadCounts(), {
      wrapper: FileUploadCountsProvider,
    });

    result.current.addUploadStatus(UploadStatusTypes.UPLOADING);

    expect(result.current.counts).toEqual({
      numUploading: 1,
      numSuccessful: 0,
      numFailed: 0,
      numCancelled: 0,
    });

    result.current.updateUploadStatus(
      UploadStatusTypes.UPLOADING,
      UploadStatusTypes.SUCCESS
    );

    expect(result.current.counts).toEqual({
      numUploading: 0,
      numSuccessful: 1,
      numFailed: 0,
      numCancelled: 0,
    });
  });
});
