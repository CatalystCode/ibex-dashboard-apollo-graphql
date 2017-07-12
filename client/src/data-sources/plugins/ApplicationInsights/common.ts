// for some reason this needs to have the scheme, host and port specified
// using just /applicationinsights means that the nock tests fail
// hard-coding these values is not ideal but will get fixed when ***REMOVED***@
// finishes refactoring the server setup/configuration
const appInsightsUri = 'http://localhost:3000/applicationinsights';

const appId = '4d567b3c-e52c-4139-8e56-8e573e55a06c'; // process.env.REACT_APP_APP_INSIGHTS_APPID;
const apiKey = 'o27hgbeqnkodr7ttcqs061z4bfxuyak4t0mvp8h1'; // process.env.REACT_APP_APP_INSIGHTS_APIKEY;

export {
  appInsightsUri,
  appId,
  apiKey
}