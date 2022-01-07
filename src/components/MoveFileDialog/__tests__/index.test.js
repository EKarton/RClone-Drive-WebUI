import useFetchRemotes from 'hooks/fetch-data/useFetchRemotes';
import useRCloneClient from 'hooks/rclone/useRCloneClient';
import { StatusTypes } from 'utils/constants';
import { mockFiles, mockRemotes } from 'test-utils/mock-responses';
import { customRender, userEvent, fireEvent, screen } from 'test-utils/react';
import MoveFileDialog from '..';

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
      <MoveFileDialog open fileName="dog.png" onCancel={onCancel} onOk={onOk} />
    );

    expect(baseElement).toMatchSnapshot();
  });

  it('should call onCancel() when user clicks on Cancel button', () => {
    customRender(
      <MoveFileDialog open fileName="dog.png" onCancel={onCancel} onOk={onOk} />
    );

    userEvent.click(screen.getByTestId('cancel-button'));

    expect(onCancel).toBeCalled();
  });

  it('should call onOk() when user selects a subfolder and clicks on the Ok button', async () => {
    customRender(
      <MoveFileDialog open fileName="dog.png" onCancel={onCancel} onOk={onOk} />
    );

    await screen.findByText('googledrive');

    fireEvent.click(screen.getByText('googledrive'));
    userEvent.click(screen.getByTestId('ok-button'));

    expect(onOk).toBeCalledWith('googledrive:');
  });

  it('should call onCancel() when user did not select anything and clicks on the Ok button', async () => {
    customRender(
      <MoveFileDialog open fileName="dog.png" onCancel={onCancel} onOk={onOk} />
    );

    userEvent.click(screen.getByTestId('ok-button'));

    expect(onCancel).toBeCalled();
  });
});
