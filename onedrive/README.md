# describo-ui-plugins : onedrive

- [describo-ui-plugins : onedrive](#describo-ui-plugins--onedrive)
- [Dependencies](#dependencies)
  - [Using the plugin](#using-the-plugin)
    - [Register the plugin with vue](#register-the-plugin-with-vue)
  - [Events](#events)
  - [Setting up Azure](#setting-up-azure)
    - [Register the application](#register-the-application)
    - [Authentication](#authentication)
      - [API permissions](#api-permissions)
    - [Get the configuration data](#get-the-configuration-data)
    - [Developer Documentation](#developer-documentation)

A plugin providing a component to authenticate to Microsoft and produce an rclone configuration for onedrive access.

The plugin has one component: `onedrive-authenticator-component`

Usage:

```
<onedrive-authenticator-component
    v-if="onedrive"
    @rclone-configuration="handleRcloneConfiguration"
/>
```

And it registers one service: `this.onedriveAuthenticationManager`:

-   To get the account info of the user: `this.onedriveAuthenticationManager.getAccount()`
-   To get the current access token: `this.onedriveAuthenticationManager.getToken()`

# Dependencies

Install these dependencies in the app in which you use this plugin.

-   npm install --save "@microsoft/microsoft-graph-client"
-   npm install --save msal

## Using the plugin

### Register the plugin with vue

```
    Vue.use(OneDrivePlugin, {
        clientId: configuration.services.onedrive.clientId,
        redirectUri: configuration.services.onedrive.redirectUri,
        log: ...somelogger
    });
```

The plugin sets up a watcher through the authentication manager that checks the validity of the token
every two minutes and refreshes it when it has less than five minutes left.

## Events

-   @rclone-configuration: a configuration object to be used with rclone

## Setting up Azure

In order to use this plugin you firstly need to create a registration for this application. This applies to both development and production.

Follow the documentation at [https://docs.microsoft.com/en-us/azure/active-directory/develop/scenario-spa-app-registration](https://docs.microsoft.com/en-us/azure/active-directory/develop/scenario-spa-app-registration). Specifically, follow the `MSAL.js 2.0 with auth code` flow docs.

### Register the application

-   Register an application
    -   name: `describo-online-onedrive`
    -   supported account types: `Accounts in any organizational directory (Any Azure AD directory - Multitenant) and personal Microsoft accounts (e.g. Skype, Xbox)`
    -   Redirect URI: `http://localhost:9000/onedrive-callback`

Ensure you setup a `Single-page application`.

### Authentication

After registering the application navigate to the `Authentication` tab (in the sidebar) and enable `Access tokens` and `ID tokens` in the `Implicit grant` section.

#### API permissions

After registering the application navigate to the `API Permissions` tab (in the sidebar) and add the following permissions:

-   Files.Read
-   Files.Read.All
-   Files.ReadWrite
-   Files.ReadWrite.All
-   offline_access
-   Sites.Read.All
-   User.Read

When you `Add a permission` you will be asked to choose an API. Select `Microsoft Graph`. Select `Delegated permissions` then search for each permission and add it. Be sure to `save` when you're done.

### Get the configuration data

You will need the `Application (client) ID` from the overview page and the `Redirect URI` from the `Platform configurations` section of the `Authentication` tab.

### Developer Documentation

-   https://github.com/AzureAD/microsoft-authentication-library-for-js/tree/dev/lib/msal-browser
