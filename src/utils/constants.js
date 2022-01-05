export const AuthenticatedPaths = ['/files', '/pictures'];

export const ICON_SIZE = Object.freeze({
  SMALL: 'small',
  MEDIUM: 'medium',
  LARGE: 'large',
});

export const StatusTypes = Object.freeze({
  LOADING: 'loading',
  SUCCESS: 'success',
  ERROR: 'error',
});

export const UploadStatusTypes = Object.freeze({
  NOT_STARTED: 'Not started',
  UPLOADING: 'Uploading',
  SUCCESS: 'Success',
  FAILED: 'Failed',
  CANCELLED: 'Cancelled',
});

export const COLOR_MODE = Object.freeze({
  LIGHT: 'light',
  DARK: 'dark',
});

export const ImageMimeTypes = new Set(['image/jpeg', 'image/png']);
