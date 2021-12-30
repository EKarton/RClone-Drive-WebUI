import Typography from '@mui/material/Typography';
import cx from 'classnames';
import './FeatureSection.scss';

export default function FeatureSection({ variant, title, subtitle, imgSrc }) {
  const isTextToRight = variant === 'right';
  const isImageToLeft = !isTextToRight;

  return (
    <div
      className={cx('feature-section', {
        'feature-section--right': isTextToRight,
      })}
    >
      <div className="feature-section__text">
        <Typography variant="h4">
          <strong>{title}</strong>
        </Typography>
        <Typography variant="h6">{subtitle}</Typography>
      </div>
      <img
        src={imgSrc}
        alt="Feature"
        className={cx('feature-section__image', {
          'feature-section__image--left': isImageToLeft,
        })}
      />
    </div>
  );
}
