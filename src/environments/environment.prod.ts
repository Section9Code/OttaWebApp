// The file contents for the current environment will overwrite these during build.
// The build system defaults to the dev environment which uses `environment.ts`, but if you do
// `ng build --env=prod` then `environment.prod.ts` will be used instead.
// The list of which env maps to which file can be found in `.angular-cli.json`.

// PROD
export const environment = {
  production: true,
  authConfig: {
    clientId: 'pKXL3IeC4maYk6h4Zwvl97LspRen7PA5',
    domain: 'otta.eu.auth0.com',
    callbackURL: 'https://app.otta.io/callback',
    audience: 'OttaTestApi',
    redirectUri: 'https://app.otta.io/callback',
    scopes: 'openid name email profile'
  },
  baseApiUrl: 'https://ottaapi.azurewebsites.net',
  stripeKey: 'pk_live_dMj7EjUe7c8UTzMrwYfcxR8L',
  pricePerUser: 999,
  version: 'v1.1.2',
  default_MaxRequeues: 3,
  default_MaxProjects: 3
};