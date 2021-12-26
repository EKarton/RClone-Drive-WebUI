import useRCloneClient from 'hooks/rclone/useRCloneClient';
import { mockFiles } from 'test-utils/mock-responses';
import { customRender, fireEvent, userEvent, waitFor } from 'test-utils/react';
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

  it('should show context menu when user right-clicks on context area', () => {
    const component = renderComponent();

    fireEvent.contextMenu(component.getByTestId('add-files-context-area__region'));

    expect(component.getByRole('menu')).toBeVisible();
    expect(component.baseElement).toMatchSnapshot();
  });

  it('should close the context menu when user right-clicks on context area and clicks on the context area', async () => {
    const component = renderComponent();

    fireEvent.contextMenu(component.getByTestId('add-files-context-area__region'));

    // Derived from https://stackoverflow.com/questions/55030879/how-to-trigger-onclose-for-react-ui-menu-with-react-testing-libray
    fireEvent.click(component.getByRole('presentation').firstChild);

    await waitFor(() => expect(component.queryByRole('menu')).not.toBeInTheDocument());
  });

  it('should call RCloneClient.mkdir() and onNewFolderCreated() correctly when user right-clicks and selects New Folder', async () => {
    const component = renderComponent();

    fireEvent.contextMenu(component.getByTestId('add-files-context-area__region'));

    expect(component.getByRole('menu')).toBeVisible();

    userEvent.click(component.getByTestId('new-folder'));

    await waitFor(() => {
      expect(mkdir).toBeCalledWith('gdrive', 'Documents/New Folder');
      expect(component.onNewFolderCreated).toBeCalled();
    });
  });

  it('should not do anything and call onUploadedFile() correctly when user right-clicks and selects Upload File', async () => {
    const component = renderComponent();

    fireEvent.contextMenu(component.getByTestId('add-files-context-area__region'));

    expect(component.getByRole('menu')).toBeVisible();

    userEvent.click(component.getByTestId('upload-file'));

    await waitFor(() => {
      expect(component.onUploadedFile).toBeCalled();
    });
  });

  const renderComponent = () => {
    const onNewFolderCreated = jest.fn();
    const onUploadedFile = jest.fn();

    const component = customRender(
      <AddFilesContextArea
        remote="gdrive"
        path="Documents"
        onNewFolderCreated={onNewFolderCreated}
        onUploadedFile={onUploadedFile}
      >
        <div data-testid="internal-content">Child element</div>
      </AddFilesContextArea>
    );

    component.onNewFolderCreated = onNewFolderCreated;
    component.onUploadedFile = onUploadedFile;

    return component;
  };
});
