import { useFileUploadCounts } from 'contexts/FileUploadCounts';
import { useFileUploadDialog } from 'contexts/FileUploadDialog';
import { render } from 'test-utils/react';
import UploadStatusButton from '../UploadStatusButton';

jest.mock('contexts/FileUploadCounts');
jest.mock('contexts/FileUploadDialog');

describe('UploadStatusButton', () => {
  beforeEach(() => {
    useFileUploadDialog.mockReturnValue({
      openDialog: jest.fn(),
    });
  });

  it.each([
    [0, 0],
    [10, 0],
    [9, 1],
    [0, 10],
  ])(
    'should match snapshot given numUploading = %s and numSuccessful = %s',
    (numUploading, numSuccessful) => {
      useFileUploadCounts.mockReturnValue({
        counts: {
          numUploading,
          numSuccessful,
        },
      });

      const { baseElement } = render(<UploadStatusButton />);

      expect(baseElement).toMatchSnapshot();
    }
  );
});
