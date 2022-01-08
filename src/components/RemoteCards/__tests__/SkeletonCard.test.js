import { render } from 'test-utils/react';
import SkeletonCard from '../SkeletonCard';

describe('SkeletonCard', () => {
  it('should match snapshot', () => {
    const { baseElement } = render(<SkeletonCard />);

    expect(baseElement).toMatchSnapshot();
  });
});
