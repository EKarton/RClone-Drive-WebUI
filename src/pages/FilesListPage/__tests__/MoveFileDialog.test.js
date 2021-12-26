import useFetchRemotes from 'hooks/fetch-data/useFetchRemotes';
import useRCloneClient from 'hooks/rclone/useRCloneClient';
import { mockFiles, mockRemotes } from 'test-utils/mock-responses';
import { customRender, userEvent, fireEvent, screen, waitFor } from 'test-utils/react';
import { StatusTypes } from 'utils/constants';
import MoveFileDialog from '../MoveFileDialog';

jest.mock('hooks/fetch-data/useFetchRemotes');
jest.mock('hooks/rclone/useRCloneClient');

describe('MoveFileDialog', () => {
  const subFolders = mockFiles.list.filter((item) => item.IsDir);
  const onOk = jest.fn();
  const onCancel = jest.fn();

  beforeEach(() => {
    useFetchRemotes.mockReturnValue({
      status: StatusTypes.SUCCESS,
      data: mockRemotes.remotes,
    });

    useRCloneClient.mockReturnValue({
      fetchSubFolders: jest.fn().mockResolvedValue(subFolders),
    });
  });

  it('should match snapshot given dialog is open and api call succeeds', () => {
    const { baseElement } = customRender(
      <MoveFileDialog open onCancel={onCancel} onOk={onOk} />
    );

    expect(baseElement).toMatchSnapshot();
  });

  it('should match snapshot given dialog is open and api call is pending', () => {
    useFetchRemotes.mockReturnValue({ status: StatusTypes.LOADING });

    const { baseElement } = customRender(
      <MoveFileDialog open onCancel={onCancel} onOk={onOk} />
    );

    expect(baseElement).toMatchSnapshot();
  });

  it('should match snapshot given dialog is open and api call failed', () => {
    useFetchRemotes.mockReturnValue({
      status: StatusTypes.ERROR,
      error: new Error('Random error'),
    });

    const { baseElement } = customRender(
      <MoveFileDialog open onCancel={onCancel} onOk={onOk} />
    );

    expect(baseElement).toMatchSnapshot();
  });

  it('should call onCancel() when user clicks on Cancel button', () => {
    const component = customRender(
      <MoveFileDialog open onCancel={onCancel} onOk={onOk} />
    );

    userEvent.click(component.getByTestId('cancel-button'));

    expect(onCancel).toBeCalled();
  });

  it('should call onOk() when user selects a subfolder and clicks on the Ok button', async () => {
    const component = customRender(
      <MoveFileDialog open onCancel={onCancel} onOk={onOk} />
    );

    await waitFor(() => {
      expect(component.getByText('googledrive')).toBeInTheDocument();
      fireEvent.click(screen.getByText('googledrive'));
    });

    userEvent.click(component.getByTestId('ok-button'));

    expect(onOk).toBeCalledWith('googledrive:');
  });

  it('should call onCancel() when user did not select anything and clicks on the Ok button', async () => {
    const component = customRender(
      <MoveFileDialog open onCancel={onCancel} onOk={onOk} />
    );

    userEvent.click(component.getByTestId('ok-button'));

    expect(onCancel).toBeCalled();
  });
});
