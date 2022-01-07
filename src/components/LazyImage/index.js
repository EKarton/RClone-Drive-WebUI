import PropTypes from 'prop-types';
import { useInView } from 'react-intersection-observer';
import Image from 'components/Image';
import './index.scss';

export default function LazyImage({ image, width, height }) {
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

LazyImage.propTypes = {
  image: Image.propTypes.image,
  width: PropTypes.number,
  height: PropTypes.number,
};
