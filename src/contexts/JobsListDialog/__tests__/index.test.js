import { JobQueueProvider } from 'contexts/JobQueue/index';
import { render, screen, userEvent, fireEvent, waitFor } from 'test-utils/react';
import { JobsListDialogProvider, useJobsListDialog } from '../index';

describe('<JobsListDialogProvider> and useJobsListDialog()', () => {
  it('should open jobs file dialog given user opens dialog', async () => {
    const MockComponent = () => {
      const { show } = useJobsListDialog();

      return <button onClick={show}>Show dialog</button>;
    };

    render(
      <JobQueueProvider>
        <JobsListDialogProvider>
          <MockComponent />
        </JobsListDialogProvider>
      </JobQueueProvider>
    );

    userEvent.click(screen.getByText('Show dialog'));

    await screen.findByTestId('jobs-list-dialog');
  });

  it('should close jobs file dialog given user opens and closes the dialog', async () => {
    const MockComponent = () => {
      const { show } = useJobsListDialog();

      return <button onClick={show}>Show dialog</button>;
    };

    render(
      <JobQueueProvider>
        <JobsListDialogProvider>
          <MockComponent />
        </JobsListDialogProvider>
      </JobQueueProvider>
    );

    userEvent.click(screen.getByText('Show dialog'));
    fireEvent.keyDown(document.body, { key: 'Escape', code: 'Escape' });

    await waitFor(async () => {
      expect(screen.queryByRole('dialog')).not.toBeInTheDocument();
    });
  });

  it('should throw an error when Mock component uses useJobsListDialog() without the jobs list provider', () => {
    const MockComponent = () => {
      const { show } = useJobsListDialog();

      return <button onClick={show}>Show dialog</button>;
    };

    const renderComponent = () => {
      return render(
        <JobQueueProvider>
          <MockComponent />
        </JobQueueProvider>
      );
    };

    expect(renderComponent).toThrowError();
  });
});
