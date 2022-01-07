import useFetchRemoteInfo from 'hooks/fetch-data/useFetchRemoteInfo';
import useFetchRemoteSpaceInfo from 'hooks/fetch-data/useFetchRemoteSpaceInfo';
import { StatusTypes } from 'utils/constants';
import { mockOperationsAboutResponse } from 'test-utils/mock-responses';
import { mockConfigGetResponse } from 'test-utils/mock-responses';
import { customRender, screen } from 'test-utils/react';
import RemoteCard from '..';

jest.mock('hooks/fetch-data/useFetchRemoteSpaceInfo');
jest.mock('hooks/fetch-data/useFetchRemoteInfo');

describe('RemoteCard', () => {
  it('should render spinners when api call is in flight', async () => {
    useFetchRemoteSpaceInfo.mockReturnValue({ status: StatusTypes.LOADING });
    useFetchRemoteInfo.mockReturnValue({ status: StatusTypes.LOADING });

    const { baseElement } = customRender(<RemoteCard remote="googledrive" />);

    await screen.findByTestId('remote-info-skeleton');
    await screen.findByTestId('remote-space-skeleton');
    expect(baseElement).toMatchSnapshot();
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

    const { baseElement } = customRender(<RemoteCard remote="googledrive" />);

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

    const { baseElement } = customRender(<RemoteCard remote="googledrive" />);

    await screen.findByText('Unable to get remote details');
    await screen.findByText('Unable to get space information');
    expect(baseElement).toMatchSnapshot();
  });
});
