import { useInView } from 'react-intersection-observer';
import Image from './Image';
import './LazyImage.scss';

export default function LazyImage({ image, width, height, imgClassName }) {
  const { ref, inView } = useInView({
    triggerOnce: true,
    rootMargin: '0px',
  });

  const renderContent = () => {
    if (!inView) {
      return null;
    }

    return (
      <Image
        image={image}
        width={width}
        height={height}
        imgClassName="lazy-image__img"
        skeletonClassName="lazy-image__skeleton"
      />
    );
  };

  return (
    <div ref={ref} data-inview={inView} style={{ width, height }}>
      {renderContent()}
    </div>
  );
}
