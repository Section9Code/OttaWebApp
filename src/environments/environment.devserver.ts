// The file contents for the current environment will overwrite these during build.
// The build system defaults to the dev environment which uses `environment.ts`, but if you do
// `ng build --env=prod` then `environment.prod.ts` will be used instead.
// The list of which env maps to which file can be found in `.angular-cli.json`.

export const environment = {
  production: false,
  authConfig: {
    clientId: 'pKXL3IeC4maYk6h4Zwvl97LspRen7PA5',
    domain: 'otta.eu.auth0.com',
    callbackURL: 'https://dev.otta.io/callback',
    audience: 'OttaTestApi',
    redirectUri: 'https://dev.otta.io/callback',
    scopes: 'openid name email profile'
  },
  baseApiUrl: 'https://ottdevapi.azurewebsites.net',
  stripeKey: 'pk_test_YXS5UTT0DjNKuW17sdAM0YOS',
  pricePerUser: 999,
  version: 'v0.1 Alpha (Dev Server)'
};