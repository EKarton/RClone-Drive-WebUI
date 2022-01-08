import BaseCard from 'components/RemoteCards/BaseCard';
import { customRender } from 'test-utils/react';
import RemoteCardsList from '..';

describe('RemoteCardsList', () => {
  it('should match snapshot given a list of remote cards', () => {
    const { baseElement } = customRender(
      <RemoteCardsList>
        <BaseCard
          remoteName="Google Drive"
          remoteType="Type: gdrive"
          remoteSpace="3gb / 4gb"
        />
        <BaseCard
          remoteName="One Drive"
          remoteType="Type: onedrive"
          remoteSpace="3gb / 4gb"
        />
        <BaseCard
          remoteName="Dropbox"
          remoteType="Type: dropbox"
          remoteSpace="3gb / 4gb"
        />
      </RemoteCardsList>
    );

    expect(baseElement).toMatchSnapshot();
  });
});
