import useRCloneClient from 'hooks/rclone/useRCloneClient';
import { mockFiles } from 'test-utils/mock-responses';
import { customRender, fireEvent, userEvent, waitFor, screen } from 'test-utils/react';
import AddFilesContextArea from '../AddFilesContextArea';

jest.mock('hooks/rclone/useRCloneClient');

describe('AddFilesContextArea', () => {
  const fetchFiles = jest.fn();
  const mkdir = jest.fn();

  beforeEach(() => {
    fetchFiles.mockResolvedValue(mockFiles.list);
    mkdir.mockResolvedValue();

    useRCloneClient.mockReturnValue({
      fetchFiles,
      mkdir,
    });
  });

  it('should show context menu when user right-clicks on context area', async () => {
    const { baseElement } = renderComponent();

    fireEvent.contextMenu(screen.getByTestId('add-files-context-area__region'));

    expect(screen.getByRole('menu')).toBeVisible();
    expect(baseElement).toMatchSnapshot();
  });

  it('should close the context menu when user right-clicks on context area and clicks on the context area', async () => {
    renderComponent();

    fireEvent.contextMenu(screen.getByTestId('add-files-context-area__region'));

    // Derived from https://stackoverflow.com/questions/55030879/how-to-trigger-onclose-for-react-ui-menu-with-react-testing-libray
    fireEvent.click(screen.getByRole('presentation').firstChild);

    expect(screen.queryByRole('menu')).not.toBeInTheDocument();
  });

  it('should call RCloneClient.mkdir() and onNewFolderCreated() correctly when user right-clicks and selects New Folder', async () => {
    const view = renderComponent();

    fireEvent.contextMenu(screen.getByTestId('add-files-context-area__region'));
    userEvent.click(screen.getByTestId('new-folder'));

    await waitFor(() => expect(mkdir).toBeCalledWith('gdrive', 'Documents/New Folder'));
    await waitFor(() => expect(view.onNewFolderCreated).toBeCalled());
  });

  it('should not do anything and call onUploadedFile() correctly when user right-clicks and selects Upload File', async () => {
    const view = renderComponent();

    fireEvent.contextMenu(screen.getByTestId('add-files-context-area__region'));
    userEvent.click(screen.getByTestId('upload-file'));

    await waitFor(() => expect(view.onUploadedFile).toBeCalled());
  });

  const renderComponent = () => {
    const onNewFolderCreated = jest.fn();
    const onUploadedFile = jest.fn();

    const view = customRender(
      <AddFilesContextArea
        remote="gdrive"
        path="Documents"
        onNewFolderCreated={onNewFolderCreated}
        onUploadedFile={onUploadedFile}
      >
        <div data-testid="internal-content">Child element</div>
      </AddFilesContextArea>
    );

    view.onNewFolderCreated = onNewFolderCreated;
    view.onUploadedFile = onUploadedFile;

    return view;
  };
});
