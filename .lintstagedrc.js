/**
 * Configuration file for lint-staged
 * Refer to https://github.com/okonet/lint-staged#configuration for more info
 */
module.exports = {
  '*.{js,scss,json,md,yaml,yml,html}': ['yarn prettier --write'],
  '*.{js}': ['yarn prettier --write'],
  '*.{scss}': ['yarn prettier --write'],
};
