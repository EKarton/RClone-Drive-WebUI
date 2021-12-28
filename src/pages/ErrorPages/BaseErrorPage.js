import Typography from '@mui/material/Typography';
import './BaseErrorPage.scss';

/**
 * This is the base error pages for all error pages
 * This component should not be used outside of this folder
 */
export default function BaseErrorPage({ error, imageUrl, title, subtitle, button }) {
  return (
    <div className="base-error-page">
      <div className="base-error-page__wrapper">
        <img src={imageUrl} alt="404" className="base-error-page__image" />
        <div className="base-error-page__message">
          <Typography variant="h4" color="text.primary">
            {title}
          </Typography>
          <Typography variant="h6" color="text.primary">
            {subtitle}
          </Typography>
        </div>
        <Typography variant="subtitle1" color="text.primary">
          <details className="base-error-page__error">
            <summary>Error: {error.message}</summary>
            <div>
              <div>{JSON.stringify(error.response)}</div>
              <div>{error.stack}</div>
            </div>
          </details>
        </Typography>
        {button}
      </div>
    </div>
  );
}
