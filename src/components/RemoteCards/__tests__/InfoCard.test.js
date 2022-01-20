import useFetchRemoteInfo from 'hooks/fetch-data/useFetchRemoteInfo';
import useFetchRemoteSpaceInfo from 'hooks/fetch-data/useFetchRemoteSpaceInfo';
import useRCloneClient from 'hooks/rclone/useRCloneClient';
import { StatusTypes } from 'utils/constants';
import { mockOperationsAboutResponse } from 'test-utils/mock-responses';
import { mockConfigGetResponse } from 'test-utils/mock-responses';
import { customRender, screen, fireEvent, userEvent } from 'test-utils/react';
import InfoCard from '../InfoCard';

jest.mock('hooks/fetch-data/useFetchRemoteSpaceInfo');
jest.mock('hooks/fetch-data/useFetchRemoteInfo');
jest.mock('hooks/rclone/useRCloneClient');

describe('InfoCard', () => {
  const emptyTrashCan = jest.fn();

  beforeEach(() => {
    emptyTrashCan.mockResolvedValue();

    useRCloneClient.mockReturnValue({
      emptyTrashCan,
    });

    useFetchRemoteSpaceInfo.mockReturnValue({
      status: StatusTypes.SUCCESS,
      data: mockOperationsAboutResponse,
      refetchData: jest.fn(),
    });

    useFetchRemoteInfo.mockReturnValue({
      status: StatusTypes.SUCCESS,
      data: mockConfigGetResponse,
      refetchData: jest.fn(),
    });
  });

  it('should render spinners when api call is in flight', async () => {
    useFetchRemoteSpaceInfo.mockReturnValue({ status: StatusTypes.LOADING });
    useFetchRemoteInfo.mockReturnValue({ status: StatusTypes.LOADING });

    const { baseElement } = customRender(<InfoCard remote="googledrive" />);

    await screen.findByTestId('remote-info-skeleton');
    await screen.findByTestId('remote-space-skeleton');
    expect(baseElement).toMatchSnapshot();
  });

  it('should render data correctly when api call finishes', async () => {
    const { baseElement } = customRender(<InfoCard remote="googledrive" />);

    expect(baseElement).toMatchSnapshot();
  });

  it('should render data correctly given there is no data in its size api call', async () => {
    useFetchRemoteSpaceInfo.mockReturnValue({
      status: StatusTypes.SUCCESS,
      data: {
        total: undefined,
        used: undefined,
        trashed: undefined,
      },
      refetchData: jest.fn(),
    });

    const { baseElement } = customRender(<InfoCard remote="googledrive" />);

    expect(baseElement).toMatchSnapshot();
  });

  it('should render error messages correctly when api calls fail', async () => {
    useFetchRemoteSpaceInfo.mockReturnValue({
      status: StatusTypes.ERROR,
      error: new Error('404 not found'),
    });
    useFetchRemoteInfo.mockReturnValue({
      status: StatusTypes.ERROR,
      error: new Error('404 not found'),
    });

    const { baseElement } = customRender(<InfoCard remote="googledrive" />);

    await screen.findByText('Unable to get remote details');
    await screen.findByText('Unable to get space information');
    expect(baseElement).toMatchSnapshot();
  });

  it('should call RCloneClient.emptyTrashCan() when user right-clicks on card and selects Clear Trash', () => {
    customRender(<InfoCard remote="googledrive" />);

    fireEvent.contextMenu(screen.getByRole('button'));
    userEvent.click(screen.getByTestId('clear-trash-button'));

    expect(emptyTrashCan).toBeCalledWith('googledrive');
  });
});
