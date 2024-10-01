import { BehaviorSubject } from 'rxjs';
import { JobStatus, JobTypes } from 'utils/constants';
import { customRender, userEvent, waitFor, fireEvent, screen } from 'test-utils/react';
import JobsSection from '../JobsSection';

jest.mock('react-pdf', () => ({
  Document: jest.fn(() => null),
  Page: jest.fn(() => null),
  pdfjs: {
    GlobalWorkerOptions: {
      workerSrc: 'mockedWorkerSrc',
    },
  },
}));

jest.mock('react-pdf/dist/Page/AnnotationLayer.css', () => ({}), { virtual: true });
jest.mock('react-pdf/dist/Page/TextLayer.css', () => ({}), { virtual: true });

describe('JobsSection', () => {
  const initialJobQueueState = {
    jobs: [
      {
        status: new BehaviorSubject(JobStatus.ONGOING),
        jobType: JobTypes.UPLOAD_FILE,
        remote: 'gdrive',
        dirPath: 'Documents',
        name: 'Dog.png',
      },
    ],
    statusCounts: {
      numOngoing: 1,
      numSuccessful: 0,
      numFailed: 0,
    },
  };

  it('should match snapshot given there are no jobs', () => {
    const { baseElement } = customRender(<JobsSection />);

    expect(baseElement).toMatchSnapshot();
  });

  it('should match snapshot given there are jobs', () => {
    const { baseElement } = customRender(<JobsSection />, { initialJobQueueState });

    expect(baseElement).toMatchSnapshot();
  });

  it('should open job popover when user clicks on the jobs button given there are jobs available', async () => {
    customRender(<JobsSection />, { initialJobQueueState });

    userEvent.click(screen.getByTestId('job-button'));

    await screen.findByText('Uploading Dog.png');
  });

  it('should close job popover when user clicks on the jobs button and presses ESC', async () => {
    customRender(<JobsSection />, { initialJobQueueState });

    userEvent.click(screen.getByTestId('job-button'));
    fireEvent.keyDown(document.body, { key: 'Escape', code: 'Escape' });

    await waitFor(async () => {
      expect(screen.queryByRole('dialog')).not.toBeInTheDocument();
    });
  });

  it('should open jobs list dialog when user clicks on the jobs button and presses More Details button', async () => {
    customRender(<JobsSection />, { initialJobQueueState });

    userEvent.click(screen.getByTestId('job-button'));
    await screen.findByTestId('more-details-button');
    userEvent.click(screen.getByTestId('more-details-button'));

    await screen.findByTestId('jobs-list-dialog');
  });
});
