import { act, customRender, userEvent, waitFor } from 'test-utils/react';
import { mockRemotes } from 'test-utils/mock-responses';
import FolderBrowserDialog from '../FolderBrowserDialog';
import FolderTree from '../FolderTree';

jest.mock('../FolderTree');

describe('FolderBrowserDialog', () => {
  it('should render FolderTree and call handleOk() once correctly if user selects an item from the FolderTree', async () => {
    let onFolderSelectFn = null;
    FolderTree.mockImplementation(({ onFolderSelect }) => {
      onFolderSelectFn = onFolderSelect;
      return null;
    });

    const onOkFn = jest.fn();
    const component = customRender(
      <FolderBrowserDialog
        remotes={mockRemotes.remotes}
        open
        onCancel={jest.fn()}
        onOk={onOkFn}
        title="Title"
      />
    );

    expect(component.baseElement).toMatchSnapshot();

    act(() => onFolderSelectFn('googledrive:Pictures'));

    userEvent.click(component.getByTestId('ok-button'));

    expect(onOkFn).toBeCalledTimes(1);
    expect(onOkFn).toBeCalledWith('googledrive:Pictures');
  });
});
