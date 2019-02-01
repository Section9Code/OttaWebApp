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
  default_MaxProjects: 3,
  plans: [
    {
      id: '3010',
      optionId: '1',
      name: 'Simplest',
      isDefault: true,
      maxProjects: 1,
      maxRequeues: 3,
      pricePerMonth: 9.95,
      stripePricePerMonth: 995,
      pricePerAdditionalUserPerMonth: 9.95,
      image: '/assets/images/simplest.png',
      description: 'Great for bloggers and small companies just starting out. With <b>1 project</b> and <b>3 requeues per project</b> you can automate your workflow without all the confusion.'
    },
    {
      id: '3020',
      optionId: '2',
      name: 'Simpler',
      isDefault: false,
      maxProjects: 3,
      maxRequeues: 4,
      pricePerMonth: 19.95,
      stripePricePerMonth: 1995,
      pricePerAdditionalUserPerMonth: 9.95,
      image: '/assets/images/simpler.png',
      description: 'For bloggers with a lot to do or small companies with lots to keep track of. The simpler plan gives you <b>3 projects</b> and <b>4 requeues per project</b> to let you get more done.'
    },
    {
      id: '3030',
      optionId: '3',
      name: 'Simple',
      isDefault: false,
      maxProjects: 6,
      maxRequeues: 5,
      pricePerMonth: 29.95,
      stripePricePerMonth: 2995,
      pricePerAdditionalUserPerMonth: 9.95,
      image: '/assets/images/simple.png',
      description: 'Best for medium sized companies or anyone who wants to run lots of things at once. You get <b>6 projects</b> and <b>5 requeues per project</b> to help you grow all your ideas.'
    }
  ]
};