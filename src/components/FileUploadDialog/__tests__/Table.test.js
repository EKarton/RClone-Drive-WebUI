import times from 'lodash/times';
import { BehaviorSubject } from 'rxjs';
import { UploadStatusTypes } from 'utils/constants';
import { render, screen, userEvent } from 'test-utils/react';
import Table from '../Table';

const mockUploadFiles = Array.from({ length: 100 }, (_, i) => ({
  remote: 'gdrive',
  dirPath: 'Documents',
  name: `Dog ${i}.png`,
  size: 10000,
  type: 'application/jpg',
  status: new BehaviorSubject(UploadStatusTypes.UPLOADING),
  cancelUpload: jest.fn(),
}));

describe('Table', () => {
  it('should match snapshot given a list of files', async () => {
    const { baseElement } = render(<Table files={mockUploadFiles} />);

    await waitForRecordsToExist(times(10));
    expect(baseElement).toMatchSnapshot();
  });

  it('should go to the next page given user clicks on the next page button', async () => {
    render(<Table files={mockUploadFiles} />);

    userEvent.click(screen.getByTestId('KeyboardArrowRightIcon'));

    await waitForRecordsToExist(times(10).map((i) => i + 10));
  });

  it('should display 25 records when user changes view to show 25 rows per page', async () => {
    render(<Table files={mockUploadFiles} />);

    userEvent.click(screen.getByText('10'));
    userEvent.click(screen.getByText('25'));

    await waitForRecordsToExist(times(25));
  });

  const waitForRecordsToExist = async (nums) => {
    const pendingChecks = nums.map(async (i) => {
      await screen.findByText(`Dog ${i}.png`);
    });

    await Promise.all(pendingChecks);
  };
});

// KeyboardArrowRightIcon

// ArrowDropDownIcon
// 25
