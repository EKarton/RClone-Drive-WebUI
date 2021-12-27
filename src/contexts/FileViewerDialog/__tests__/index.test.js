import useFileViewerDialog from 'hooks/utils/useFileViewerDialog';
import { FileViewerDialogProvider } from '../index';
import { render, userEvent, act, waitFor } from 'test-utils/react';
import useRCloneClient from 'hooks/rclone/useRCloneClient';

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
    const component = renderMockPage();

    act(() => userEvent.click(component.getByText('Open File')));

    await waitFor(() => {
      expect(component.getByTestId('fileviewer-dialog')).toBeInTheDocument();
    });
  });

  it('should close the dialog when user opens and closes the dialog', async () => {
    const component = renderMockPage();

    act(() => userEvent.click(component.getByText('Open File')));

    await waitFor(() => {
      expect(component.getByTestId('fileviewer-dialog')).toBeInTheDocument();
    });

    act(() => userEvent.click(component.getByTestId('close-button')));

    await waitFor(() => {
      expect(component.queryByTestId('fileviewer-dialog')).not.toBeInTheDocument();
    });
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
      folderPath: 'Pictures',
      fileName: 'profile.png',
    };

    const handleClick = () => {
      fileViewerDialog.show(fileToView);
    };

    return <button onClick={handleClick}>Open File</button>;
  };
});
