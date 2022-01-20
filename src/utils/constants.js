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

export const JobStatus = Object.freeze({
  ONGOING: 'ONGOING',
  SUCCESS: 'SUCCESS',
  ERROR: 'ERROR',
});

export const JobTypes = Object.freeze({
  UPLOAD_FILE: 'UPLOAD_FILE',
  MOVE_FILE: 'MOVE_FILE',
  MOVE_FOLDER: 'MOVE_FOLDER',
  RENAME_FILE: 'RENAME_FILE',
  RENAME_FOLDER: 'RENAME_FOLDER',
});

export const COLOR_MODE = Object.freeze({
  LIGHT: 'light',
  DARK: 'dark',
});

export const ImageMimeTypes = new Set(['image/jpeg', 'image/png']);
