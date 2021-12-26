import useRCloneClient from 'hooks/rclone/useRCloneClient';

jest.mock('hooks/rclone/useRCloneClient');

describe('AddFilesDropSection', () => {
  const uploadFiles = jest.fn();
  beforeEach(() => {
    uploadFiles.mockResolvedValue();

    useRCloneClient.mockReturnValue({
      uploadFiles,
    });
  });

  it('should upload files given files were drag-and-dropped to drop section', async () => {});
});
