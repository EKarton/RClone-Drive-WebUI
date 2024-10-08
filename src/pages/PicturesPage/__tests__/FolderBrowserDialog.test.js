import FolderTree from 'components/FolderTree';
import { mockRemotes } from 'test-utils/mock-responses';
import { act, customRender, userEvent, waitFor, screen } from 'test-utils/react';
import FolderBrowserDialog from '../FolderBrowserDialog';

jest.mock('components/FolderTree');

jest.mock('react-pdf', () => ({
  Document: jest.fn(() => null),
  Page: jest.fn(() => null),
  pdfjs: {
    GlobalWorkerOptions: {
      workerSrc: 'mockedWorkerSrc',
    },
  },
}));

jest.mock('react-pdf/dist/Page/AnnotationLayer.css', () => ({}), { virtual: true });
jest.mock('react-pdf/dist/Page/TextLayer.css', () => ({}), { virtual: true });

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
    const { baseElement } = customRender(
      <FolderBrowserDialog
        remotes={mockRemotes.remotes}
        open
        onOk={onOkFn}
        onCancel={onCancelFn}
        title="Title"
      />
    );

    expect(baseElement).toMatchSnapshot();

    act(() => jest.advanceTimersByTime(10000));

    userEvent.click(screen.getByTestId('ok-button'));

    await waitFor(() => expect(onOkFn).toBeCalledTimes(1));
    await waitFor(() => expect(onOkFn).toBeCalledWith('googledrive:Pictures'));
    await waitFor(() => expect(onCancelFn).not.toBeCalled());
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
    customRender(
      <FolderBrowserDialog
        remotes={mockRemotes.remotes}
        open
        onOk={onOkFn}
        onCancel={onCancelFn}
        title="Title"
      />
    );

    act(() => jest.advanceTimersByTime(10000));

    userEvent.click(screen.getByTestId('ok-button'));

    await waitFor(() => expect(onCancelFn).toBeCalledTimes(1));
    await waitFor(() => expect(onOkFn).not.toBeCalled());
  });

  it('should call handleCancel() when the user clicks on the Cancel button', async () => {
    FolderTree.mockReturnValue(null);

    const onOkFn = jest.fn();
    const onCancelFn = jest.fn();
    customRender(
      <FolderBrowserDialog
        remotes={mockRemotes.remotes}
        open
        onOk={onOkFn}
        onCancel={onCancelFn}
        title="Title"
      />
    );

    userEvent.click(screen.getByTestId('cancel-button'));

    await waitFor(() => expect(onCancelFn).toBeCalledTimes(1));
    await waitFor(() => expect(onOkFn).not.toBeCalled());
  });
});
