# describo-ui-plugins : onedrive

A plugin providing a component to authenticate to Microsoft and produce an rclone configuration for onedrive access.

The plugin has one component: `onedrive-authenticator-component`

Usage:

```
<onedrive-authenticator-component
    v-if="onedrive"
    :client-id="onedrive.clientID"
    :redirect-uri="onedrive.redirectURI"
    @rclone-configuration="handleRcloneConfiguration"
/>
```

The component takes two parameters:

-   client-id
-   repositroy-id

## Events

-   @rclone-configuration: a configuration object to be used with rclone
-   @account: the user account information
-   @token: the user authorization token

## Setting up Azure

In order to use this plugin you firstly need to create a registration for this application. This applies to both development and production.

### Register the application

Sign in to [https://portal.azure.com/#blade/Microsoft_AAD_RegisteredApps/ApplicationsListBlade](https://portal.azure.com/#blade/Microsoft_AAD_RegisteredApps/ApplicationsListBlade)

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
