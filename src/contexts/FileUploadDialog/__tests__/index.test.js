import { renderHook } from '@testing-library/react-hooks';
import { FileUploadCountsProvider } from 'contexts/FileUploadCounts/index';
import FileUploaderProvider from 'contexts/FileUploader/FileUploaderProvider';
import { RCloneInfoProvider } from 'contexts/RCloneInfo/index';
import { render, screen } from 'test-utils/react';
import { userEvent, fireEvent, waitForElementToBeRemoved } from 'test-utils/react';
import { FileUploadDialogProvider, useFileUploadDialog } from '../index';

describe('useFileUploadDialog()', () => {
  it('should open and close the dialog given user opens the dialog, and closes the dialog', async () => {
    renderMockPage();

    userEvent.click(screen.getByTestId('open'));

    await screen.findByTestId('file-upload-dialog');
    fireEvent.keyDown(screen.getByTestId('file-upload-dialog'), {
      key: 'Escape',
      code: 'Escape',
    });

    await waitForElementToBeRemoved(() => screen.queryByTestId('file-upload-dialog'));
  });

  it('should throw an error given it is not wrapped in FileUploadDialogContext', () => {
    const { result } = renderHook(() => useFileUploadDialog());

    expect(result.error).toBeInstanceOf(Error);
  });

  const renderMockPage = () => {
    const mockRCloneInfo = {
      endpoint: 'http://localhost:5572',
      username: 'admin',
      password: '1234',
    };

    return render(
      <RCloneInfoProvider defaultState={mockRCloneInfo}>
        <FileUploaderProvider>
          <FileUploadCountsProvider>
            <FileUploadDialogProvider>
              <MockPage />
            </FileUploadDialogProvider>
          </FileUploadCountsProvider>
        </FileUploaderProvider>
      </RCloneInfoProvider>
    );
  };

  const MockPage = () => {
    const { openDialog } = useFileUploadDialog();

    return (
      <button onClick={openDialog} data-testid="open">
        Open
      </button>
    );
  };
});
