import { renderHook } from '@testing-library/react-hooks';
import { act, screen, userEvent, waitForElementToBeRemoved } from 'test-utils/react';
import { LoginHelpDialogProvider, useLoginHelpDialog } from '../index';

describe('useLoginHelpDialog()', () => {
  it('should open the dialog when openDialog() is called', async () => {
    const { result } = renderHook(() => useLoginHelpDialog(), {
      wrapper: LoginHelpDialogProvider,
    });

    act(() => result.current.openDialog());

    await screen.findByTestId('login-help-dialog');
  });

  it('should close the dialog when user closes the dialog', async () => {
    const { result } = renderHook(() => useLoginHelpDialog(), {
      wrapper: LoginHelpDialogProvider,
    });

    act(() => result.current.openDialog());
    await screen.findByTestId('login-help-dialog');

    userEvent.click(screen.getByTestId('close-button'));

    await waitForElementToBeRemoved(() => screen.queryByTestId('login-help-dialog'));
  });

  it('should throw an error when hook is not wrapped in LoginHelpDialogProvider', () => {
    const { result } = renderHook(() => useLoginHelpDialog());

    expect(result.error).toBeInstanceOf(Error);
  });
});
