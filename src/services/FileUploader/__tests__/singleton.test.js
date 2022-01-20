import FileUploader from '../index';
import fileUploader from '../singleton';

describe('singleton', () => {
  it('should return a FileUploader()', () => {
    expect(fileUploader).toBeInstanceOf(FileUploader);
  });
});
