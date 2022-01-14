/**
 * Configuration file for prettier
 * Refer to https://prettier.io/docs/en/configuration.html for more info
 */
module.exports = {
  trailingComma: 'es5',
  singleQuote: true,
  printWidth: 90,
  importOrder: [
    '<THIRD_PARTY_MODULES>',
    '^apps/(.*)$',
    '^assets/(.*)$',
    '^components/(.*)$',
    '^contexts/(.*)$',
    '^hooks/(.*)$',
    '^pages/(.*)$',
    '^services/(.*)$',
    '^utils/(.*)$',
    '^test-utils/(.*)$',
    '^[./]',
  ],
};
