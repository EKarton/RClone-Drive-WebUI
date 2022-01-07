import { useFileUploader } from 'contexts/FileUploader';
import { customRender, fireEvent, waitFor, screen } from 'test-utils/react';
import AddFilesDropSection from '../AddFilesDropSection';

jest.mock('contexts/FileUploader');

describe('AddFilesDropSection', () => {
  const uploadFiles = jest.fn();

  beforeEach(() => {
    useFileUploader.mockReturnValue({
      uploadFiles,
    });
  });

  it('should upload files recursively given content were drag and dropped to drop section', async () => {
    const dataTransferItems = createDataTransferItems([
      {
        isFile: true,
        fullPath: 'Pictures/dog.png',
        file: new File(['(⌐□_□)'], 'dog.png', { type: 'image/png' }),
      },
      {
        isFile: false,
        fullPath: 'Pictures/2021',
        items: [
          {
            isFile: true,
            fullPath: 'Pictures/2021/fireworks.png',
            file: new File(['A'], 'fireworks.png', { type: 'image/png' }),
          },
        ],
      },
    ]);

    renderComponent();
    const dropSection = screen.getByTestId('add-files-drop-section');
    fireEvent.dragEnter(dropSection);
    fireEvent.drop(dropSection, { dataTransfer: { items: dataTransferItems } });
    fireEvent.dragEnd(dropSection);

    await waitFor(() => {
      expect(uploadFiles).toBeCalledWith([
        {
          remote: 'gdrive',
          dirPath: 'Documents/Pictures',
          file: expect.any(File),
        },
        {
          remote: 'gdrive',
          dirPath: 'Documents/Pictures/2021',
          file: expect.any(File),
        },
      ]);
    });
  });

  const createDataTransferItems = (root) => {
    return root.map((item) => {
      if (item.isFile) {
        return {
          webkitGetAsEntry: () => ({
            isFile: true,
            isDirectory: false,
            fullPath: item.fullPath,
            file: (resolve) => resolve(item.file),
          }),
        };
      }

      const subEntries = createDataTransferItems(item.items).map((item) =>
        item.webkitGetAsEntry()
      );

      return {
        webkitGetAsEntry: () => ({
          isFile: false,
          isDirectory: true,
          fullPath: item.fullPath,
          createReader: () => {
            let curIdx = 0;
            return {
              readEntries: (resolve) => {
                const items = subEntries.splice(curIdx);
                curIdx += 1;
                resolve(items);
              },
            };
          },
        }),
      };
    });
  };

  const renderComponent = () => {
    const onUploadedFiles = jest.fn();
    const view = customRender(
      <AddFilesDropSection
        remote="gdrive"
        dirPath="Documents"
        onUploadedFiles={onUploadedFiles}
      />
    );
    view.onUploadedFiles = onUploadedFiles;
    return view;
  };
});
