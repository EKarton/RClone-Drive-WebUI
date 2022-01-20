import RCloneJobTracker from '../index';
import rCloneJobTracker from '../singleton';

describe('singleton', () => {
  it('should return a FileUploader()', () => {
    expect(rCloneJobTracker).toBeInstanceOf(RCloneJobTracker);
  });
});
