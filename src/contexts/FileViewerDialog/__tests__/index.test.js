import useRCloneClient from 'hooks/rclone/useRCloneClient';
import useFileViewerDialog from 'hooks/utils/useFileViewerDialog';
import { render, userEvent, waitForElementToBeRemoved, screen } from 'test-utils/react';
import { FileViewerDialogProvider } from '../index';

jest.mock('hooks/rclone/useRCloneClient');

describe('FileViewerDialog', () => {
  beforeEach(() => {
    useRCloneClient.mockReturnValue({
      fetchFileContents: jest.fn().mockResolvedValue({
        data: '1234',
        headers: { 'content-type': 'image/jpeg' },
      }),
    });
  });

  it('should render dialog when user opens the dialog', async () => {
    renderMockPage();

    userEvent.click(screen.getByText('Open File'));

    await screen.findByTestId('fileviewer-dialog');
  });

  it('should close the dialog when user opens and closes the dialog', async () => {
    renderMockPage();

    userEvent.click(screen.getByText('Open File'));

    await screen.findByTestId('fileviewer-dialog');
    userEvent.click(screen.getByTestId('close-button'));

    await waitForElementToBeRemoved(() => screen.queryByTestId('fileviewer-dialog'));
  });

  const renderMockPage = () => {
    return render(
      <FileViewerDialogProvider>
        <MockPage />
      </FileViewerDialogProvider>
    );
  };

  const MockPage = () => {
    const fileViewerDialog = useFileViewerDialog();
    const fileToView = {
      remote: 'gdrive',
      dirPath: 'Pictures',
      fileName: 'profile.png',
    };

    const handleClick = () => {
      fileViewerDialog.show(fileToView);
    };

    return <button onClick={handleClick}>Open File</button>;
  };
});
