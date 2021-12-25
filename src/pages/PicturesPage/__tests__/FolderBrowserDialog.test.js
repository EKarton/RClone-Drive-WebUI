import { act, customRender, userEvent } from 'test-utils/react';
import { mockRemotes } from 'test-utils/mock-responses';
import FolderBrowserDialog from '../FolderBrowserDialog';
import FolderTree from '../FolderTree';

jest.mock('../FolderTree');

describe('FolderBrowserDialog', () => {
  it('should render FolderTree and call handleOk() once correctly if user selects an item from the FolderTree', async () => {
    // Mock user selecting a folder
    jest.useFakeTimers();

    FolderTree.mockImplementation(({ onSelect }) => {
      setTimeout(() => onSelect('googledrive:Pictures'), 10000);
      return null;
    });

    const onOkFn = jest.fn();
    const onCancelFn = jest.fn();
    const component = customRender(
      <FolderBrowserDialog
        remotes={mockRemotes.remotes}
        open
        onOk={onOkFn}
        onCancel={onCancelFn}
        title="Title"
      />
    );

    expect(component.baseElement).toMatchSnapshot();

    act(() => jest.advanceTimersByTime(10000));

    userEvent.click(component.getByTestId('ok-button'));

    expect(onOkFn).toBeCalledTimes(1);
    expect(onOkFn).toBeCalledWith('googledrive:Pictures');
    expect(onCancelFn).not.toBeCalled();
  });

  it('should call handleCancel() when the Folder Tree clicks on onSelect() with no data', async () => {
    // Mock user selecting a folder
    jest.useFakeTimers();

    FolderTree.mockImplementation(({ onSelect }) => {
      setTimeout(() => onSelect(''), 10000);
      return null;
    });

    const onOkFn = jest.fn();
    const onCancelFn = jest.fn();
    const component = customRender(
      <FolderBrowserDialog
        remotes={mockRemotes.remotes}
        open
        onOk={onOkFn}
        onCancel={onCancelFn}
        title="Title"
      />
    );

    act(() => jest.advanceTimersByTime(10000));

    userEvent.click(component.getByTestId('ok-button'));

    expect(onCancelFn).toBeCalledTimes(1);
    expect(onOkFn).not.toBeCalled();
  });

  it('should call handleCancel() when the user clicks on the Cancel button', async () => {
    FolderTree.mockReturnValue(null);

    const onOkFn = jest.fn();
    const onCancelFn = jest.fn();
    const component = customRender(
      <FolderBrowserDialog
        remotes={mockRemotes.remotes}
        open
        onOk={onOkFn}
        onCancel={onCancelFn}
        title="Title"
      />
    );

    userEvent.click(component.getByTestId('cancel-button'));

    expect(onCancelFn).toBeCalledTimes(1);
    expect(onOkFn).not.toBeCalled();
  });
});
