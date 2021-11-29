import RemoteCard from 'components/RemoteCard';
import useRCloneClient from 'hooks/useRCloneClient';
import {
  mockConfigGetResponse,
  mockOperationsAboutResponse,
} from 'test-utils/mock-responses';
import { customRender, waitFor } from 'test-utils/react';

jest.mock('hooks/useRCloneClient');

describe('RemoteCard', () => {
  const fetchRemoteSpaceInfoFn = jest.fn();
  const fetchRemoteInfoFn = jest.fn();

  beforeEach(() => {
    fetchRemoteSpaceInfoFn.mockReset();
    fetchRemoteInfoFn.mockReset();

    useRCloneClient.mockReturnValue({
      fetchRemoteSpaceInfo: fetchRemoteSpaceInfoFn,
      fetchRemoteInfo: fetchRemoteInfoFn,
    });
  });

  it('should render correctly when api call is loading and has succeeded', async () => {
    // Mock the timer
    jest.useFakeTimers();

    // Simulate api call that takes 10000 ms
    fetchRemoteSpaceInfoFn.mockImplementation(() => {
      return new Promise((resolve) => {
        setTimeout(() => resolve(mockOperationsAboutResponse), 10000);
      });
    });

    fetchRemoteInfoFn.mockImplementation(() => {
      return new Promise((resolve) => {
        setTimeout(() => resolve(mockConfigGetResponse), 10000);
      });
    });

    const component = customRender(<RemoteCard remote="googledrive" />);

    await waitFor(() => {
      expect(component.queryByTestId('remote-info-skeleton')).toBeInTheDocument();
      expect(component.queryByTestId('remote-space-skeleton')).toBeInTheDocument();
      expect(component.baseElement).toMatchSnapshot();
    });

    // Resolve all api calls
    jest.runAllTimers();

    await waitFor(() => {
      expect(component.queryByTestId('remote-info-skeleton')).not.toBeInTheDocument();
      expect(component.queryByTestId('remote-space-skeleton')).not.toBeInTheDocument();
      expect(component.baseElement).toMatchSnapshot();
    });
  });

  it('should render correctly when api call fails', async () => {
    fetchRemoteSpaceInfoFn.mockRejectedValue(new Error('Random error'));
    fetchRemoteInfoFn.mockRejectedValue(new Error('Random error'));

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
