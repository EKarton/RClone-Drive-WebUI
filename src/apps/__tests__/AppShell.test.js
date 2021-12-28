import AppShell from 'apps/AppShell';
import GlobalAppBar from 'components/GlobalAppBar';
import GlobalNavBar from 'components/GlobalNavBar';
import { act, customRender } from 'test-utils/react';

jest.mock('components/GlobalAppBar');
jest.mock('components/GlobalNavBar');

describe('AppShell', () => {
  beforeEach(() => {
    GlobalAppBar.mockReturnValue(null);
    GlobalNavBar.mockReturnValue(null);
  });

  it('should expand the global nav bar when user clicks on the menu button in global app bar', () => {
    let onDrawerButttonClickedFn = null;
    GlobalAppBar.mockImplementation(({ onDrawerButttonClicked }) => {
      onDrawerButttonClickedFn = onDrawerButttonClicked;
      return null;
    });

    customRender(<AppShell />, {}, { route: '/files' });

    act(() => {
      onDrawerButttonClickedFn();
    });

    expect(GlobalNavBar.mock.calls[1][0].isExpanded).toBeTruthy();
  });
});
