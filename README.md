# Ibex Dashboard - GraphQL + Apollo version

Ibex is a dashboarding application that enables building dashboard and templates.
It mainly supports **Application Insights** but data sources and visual components are easily extendable.

## Apollo + GraphQL
This version introduce a brand new server and client implementations, the server is built using GraphQL and the client using Apollo React.
In this version the dashboard template is much simpler and easier to read and modify.

This version is a fork from the original Ibex dashboard project [Source Code](https://github.com/CatalystCode/ibex-dashboard)

# Preview

[![Preview](/docs/images/bot-fmk-dashboard.png)](/docs/images/bot-fmk-dashboard.png)
[![Preview](/docs/images/bot-fmk-dashboard-msgs.png)](/docs/images/bot-fmk-dashboard-msgs.png)
[![Preview](/docs/images/bot-fmk-dashboard-intent.png)](/docs/images/bot-fmk-dashboard-intent.png)

## Display your Bot Analytics Dashboard

```bash
npm install yarn -g

git clone https://github.com/CatalystCode/ibex-dashboard
cd ibex-dashboard
yarn
yarn start
```

1. Open **http://localhost:4000**
2. Create a new template from **Bot Analytics Basic Dashboard**
3. Run through the **Application Insights** setup and fill in **API Key** and **Application ID** according to the application insights account associated with your registered bot.

### Development

```bash
yarn start:dev
```

1. Open **http://localhost:3000**

(For more information on development environment, see https://www.fullstackreact.com/articles/using-create-react-app-with-a-server/)

## Deploy To Azure

There are 3 ways to deploy to Azure:

**1. Web App - Automated**

1. Fork this repo (to be able to automatically create github deployment key)
2. Copy the fork url and use it with the following deployment button:

<a href="https://portal.azure.com/#create/Microsoft.Template/uri/https%3A%2F%2Fraw.githubusercontent.com%2Ftorosent%2Fibex-dashboard%2Fmaster%2Fscripts%2Fdeployment%2Fwebapp%2Fazuredeploy.json" target="_blank">
    <img src="http://azuredeploy.net/deploybutton.png"/>
</a>

**2. Web App On Linux - Automated with Docker Hub**

<a href="https://portal.azure.com/#create/Microsoft.Template/uri/https%3A%2F%2Fraw.githubusercontent.com%2FCatalystCode%2Fibex-dashboard%2Fmaster%2Fscripts%2Fdeployment%2Fwebapponlinux%2Fazuredeploy.json" target="_blank">
    <img src="http://azuredeploy.net/deploybutton.png"/>
</a>

**3. Manual**

1. Fork this repo (to be able to automatically create github deployment key)
2. Clone & Deploy:
3. [Create a new Web App in Azure](https://docs.microsoft.com/en-us/azure/app-service-web/app-service-continuous-deployment)

## Deploy With Docker

1. `docker build -t **image name** .`
2. `docker run -d -e PORT=80 **image name** `
3. Docker image is also available at Docker Hub - `docker pull catalystcode/ibex-dashboard`

## Application Insights Integration

Since application insights API doesn't support ARM yet, we need to manually [create an API Key](https://dev.applicationinsights.io/documentation/Authorization/API-key-and-App-ID) for the application insights service.
The full instructions are also available when you create a new dashboard.

You can also follow the next headline.

## Create new API Key and Application ID

The following steps explain how to connect **Application Insights** bot with your bot and your dashboard:
[you can also follow the [official Application Insights article](https://dev.applicationinsights.io/documentation/Authorization/API-key-and-App-ID)].

1. Go to [azure portal](https://portal.azure.com)
2. Select: **Resource Groups** > **[new resource group]** > **App Insights Service**
3. Copy **Instrumentation Key** and paste into your bot registration page (on the bottom)
4. Click: **API Access** > **Create New Key** > **+ Read Telemetry**
5. Copy `Application ID` + `API Key`
6. Open the URL of your web app
7. Under **AppId**/**ApiKey** set the values you created.

# Resources

### Technologies In Use

* https://facebook.github.io/react/
* https://github.com/facebookincubator/create-react-app
* http://recharts.org/
* https://react-md.mlaursen.com/

### Design and Patterns
This project is built using:

* https://github.com/facebookincubator/create-react-app

The server approach was added using:

* https://www.fullstackreact.com/articles/using-create-react-app-with-a-server/
* https://medium.com/@patriciolpezjuri/using-create-react-app-with-react-router-express-js-8fa658bf892d#.14dex6478

Thinking about integrating with:

* https://github.com/facebookincubator/create-react-app/blob/master/packages/react-scripts/template/README.md


### Engines

* Running node version 6.11 or above. 

### Test Watcher
The test watcher is integrated into the create-react-app mechanism and runs tests related to files changes since the last commit.

To run the test watcher in an interactive mode:

```bash
cd client
yarn test
```

Alternatively, you can also run the full commands that the Travis CI server
will run to validate any changes.

```bash
.travis/ci.sh
```

### Build for Production
Our CI server Travis creates new production builds automatically for changes
to master. If you need to create a build locally, you can execute the same
commands as the CI server.

```bash
yarn build
```

Or

```bash
.travis/build.sh
```

# Lisence
MIT