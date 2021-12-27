/**
 * Configuration file for lint-staged
 * Refer to https://github.com/okonet/lint-staged#configuration for more info
 */
module.exports = {
  '*.{json,md,yaml,yml,html}': ['yarn prettier --write'],
  '*.js': ['eslint --fix', 'yarn prettier --write'],
  '*.scss': ['stylelint --fix', 'yarn prettier --write'],
};
