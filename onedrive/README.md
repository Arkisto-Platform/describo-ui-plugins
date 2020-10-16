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
