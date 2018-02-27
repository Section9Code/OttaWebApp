# Otta Web Application

This is the core application for Otta, this is the single page application that talks to the core API.

## Building for development
This application is an Angular single page application using TypeScript.

### Prerequisites
You must have Node, NPM, Angular CLI, Typescript, and Firebase tools installed to be able to use this application.

### First time setup

Once you have pulled this application from source control you must install all the project dependancies.

```npm install```

This will install everything you need

### Running the application locally
To run the application on your own machine run

```ng serve```

This will run the application on <http://localhost:4200>, there you will be able to debug it, and any changes you make to the code will be reflected automatically.

## Deploying the application
This frontend application is deployed to Google Firebase Hosting

### Deploying to dev
There is an NPM script to deploy the application for you

```npm run deployDev```

#### Deploying to dev by hand
To deploy to the dev environment you must first package the application into the **dist** folder.

```ng build --dev --e=devserver```

this builds the application in **dev mode** (useful for debugging) with the **devserver** environment setup. The application can then be deployed to the hosting environment.

```firebase deploy```

This will send the entire application to the hosting environment and will then be available at <https://otta-web-app.firebaseapp.com>.
