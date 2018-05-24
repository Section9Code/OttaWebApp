// The file contents for the current environment will overwrite these during build.
// The build system defaults to the dev environment which uses `environment.ts`, but if you do
// `ng build --env=prod` then `environment.prod.ts` will be used instead.
// The list of which env maps to which file can be found in `.angular-cli.json`.

export const environment = {
  production: true,
  authConfig: {
    clientId: 'pVM3vKxgpj2hpxsdEgQ9Cg8rG0Ug4NvA',
    domain: 'otta.eu.auth0.com',
    callbackURL: 'https://app.otta.io/callback',
    audience: 'https://otta.eu.auth0.com/userinfo',
    redirectUri: 'https://app.otta.io/callback',
    scopes: 'openid name email profile'
  },
  baseApiUrl: 'https://ottaapi.azurewebsites.net',
  stripeKey: 'pk_live_dMj7EjUe7c8UTzMrwYfcxR8L',
  pricePerUser: 999,
  version: 'v0.1 Alpha'
};