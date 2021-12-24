import RemoteCard from 'components/RemoteCard';
import { mockOperationsAboutResponse } from 'test-utils/mock-responses';
import { mockConfigGetResponse } from 'test-utils/mock-responses';
import { customRender, waitFor } from 'test-utils/react';
import { StatusTypes } from 'utils/constants';
import useFetchRemoteSpaceInfo from 'hooks/rclone/fetch-data/useFetchRemoteSpaceInfo';
import useFetchRemoteInfo from 'hooks/rclone/fetch-data/useFetchRemoteInfo';

jest.mock('hooks/rclone/fetch-data/useFetchRemoteSpaceInfo');
jest.mock('hooks/rclone/fetch-data/useFetchRemoteInfo');

describe('RemoteCard', () => {
  it('should render spinners when api call is in flight', async () => {
    useFetchRemoteSpaceInfo.mockReturnValue({ status: StatusTypes.LOADING });
    useFetchRemoteInfo.mockReturnValue({ status: StatusTypes.LOADING });

    const component = customRender(<RemoteCard remote="googledrive" />);

    await waitFor(() => {
      expect(component.queryByTestId('remote-info-skeleton')).toBeInTheDocument();
      expect(component.queryByTestId('remote-space-skeleton')).toBeInTheDocument();
      expect(component.baseElement).toMatchSnapshot();
    });
  });

  it('should render data correctly when api call finishes', async () => {
    useFetchRemoteSpaceInfo.mockReturnValue({
      status: StatusTypes.SUCCESS,
      data: mockOperationsAboutResponse,
    });
    useFetchRemoteInfo.mockReturnValue({
      status: StatusTypes.SUCCESS,
      data: mockConfigGetResponse,
    });

    const component = customRender(<RemoteCard remote="googledrive" />);

    await waitFor(() => {
      expect(component.queryByTestId('remote-info-skeleton')).not.toBeInTheDocument();
      expect(component.queryByTestId('remote-space-skeleton')).not.toBeInTheDocument();
      expect(component.baseElement).toMatchSnapshot();
    });
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

    const component = customRender(<RemoteCard remote="googledrive" />);

    await waitFor(() => {
      const element1 = component.queryByText('Unable to get remote details');
      const element2 = component.queryByText('Unable to get space information');

      expect(element1).toBeInTheDocument();
      expect(element2).toBeInTheDocument();
      expect(component.baseElement).toMatchSnapshot();
    });
  });
});
